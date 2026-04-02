const body = document.body;
const header = document.querySelector(".site-header");
const navMenu = document.querySelector(".nav-menu");
const navToggle = document.querySelector(".nav-toggle");
const revealItems = document.querySelectorAll("[data-reveal]");
const year = document.querySelector("#year");
const pathPawnAnchor = document.querySelector(".path-pawn-anchor");
const pathStops = Array.from(document.querySelectorAll(".path-stop"));

const modal = document.querySelector("#zoom-modal");
const modalImage = document.querySelector(".zoom-image");
const modalCaption = document.querySelector(".zoom-caption");
const modalClose = document.querySelector(".zoom-close");
const modalPrev = document.querySelector("#zoom-prev");
const modalNext = document.querySelector("#zoom-next");
const zoomItems = Array.from(document.querySelectorAll(".zoom-item"));
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (year) {
    year.textContent = new Date().getFullYear();
}

const syncHeader = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
};

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

if (navMenu && navToggle) {
    const setMenu = (open) => {
        navMenu.classList.toggle("is-open", open);
        navToggle.classList.toggle("is-open", open);
        navToggle.setAttribute("aria-expanded", String(open));
        body.classList.toggle("menu-open", open);
    };

    navToggle.addEventListener("click", () => {
        setMenu(!navMenu.classList.contains("is-open"));
    });

    navMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => setMenu(false));
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 860) {
            setMenu(false);
        }
    });

    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            setMenu(false);
        }
    });
}

if (revealItems.length && "IntersectionObserver" in window) {
    body.classList.add("is-ready");

    revealItems.forEach((item) => {
        item.style.setProperty("--reveal-delay", item.dataset.revealDelay || "0s");
    });

    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            currentObserver.unobserve(entry.target);
        });
    }, {
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px"
    });

    revealItems.forEach((item) => observer.observe(item));
}

if (pathPawnAnchor) {
    const pathPawn = pathPawnAnchor.querySelector(".path-pawn");
    const pathSections = pathStops.map((stop) => {
        const target = stop.getAttribute("href");
        if (!target || !target.startsWith("#")) {
            return null;
        }

        try {
            return document.querySelector(target);
        } catch (error) {
            return null;
        }
    });
    const hasSectionTargets = pathSections.some(Boolean);

    let currentPathIndex = -1;
    let pathFrame = 0;
    let pawnMotionFrame = 0;
    let jumpTimer = 0;
    let targetProgress = 0;
    let renderedProgress = 0;
    let activePawnPointerId = null;
    let isDraggingPawn = false;

    const setActiveStop = (index) => {
        pathStops.forEach((item, itemIndex) => {
            item.classList.toggle("is-active", itemIndex === index);
        });
    };

    const triggerJump = () => {
        pathPawnAnchor.classList.remove("is-jumping");
        window.clearTimeout(jumpTimer);
        void pathPawnAnchor.offsetWidth;
        pathPawnAnchor.classList.add("is-jumping");
        jumpTimer = window.setTimeout(() => {
            pathPawnAnchor.classList.remove("is-jumping");
        }, 540);
    };

    const getPathState = () => {
        const marker = window.scrollY + (window.innerHeight * 0.42);
        const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
        const progress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
        let activeIndex = Math.min(4, Math.floor(progress * 5));

        if (hasSectionTargets) {
            activeIndex = 0;
            pathSections.forEach((section, index) => {
                if (section && section.offsetTop <= marker) {
                    activeIndex = index;
                }
            });
        }

        return { activeIndex, progress };
    };

    const getScrollableHeight = () => (
        Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
    );

    const setScrollFromClientY = (clientY) => {
        const railRect = pathPawnAnchor.getBoundingClientRect();
        const railPadding = 8;
        const railStart = railRect.top + railPadding;
        const railLength = Math.max(railRect.height - (railPadding * 2), 1);
        const progress = Math.min(Math.max((clientY - railStart) / railLength, 0), 1);
        const nextScroll = progress * getScrollableHeight();

        window.scrollTo(0, nextScroll);
    };

    const renderPawn = () => {
        const diff = targetProgress - renderedProgress;
        renderedProgress += diff * 0.14;

        if (Math.abs(diff) < 0.0015) {
            renderedProgress = targetProgress;
        }

        pathPawnAnchor.style.setProperty("--scroll-progress", String(renderedProgress));

        if (renderedProgress !== targetProgress) {
            pawnMotionFrame = window.requestAnimationFrame(renderPawn);
            return;
        }

        pawnMotionFrame = 0;
    };

    const syncPathPawn = () => {
        pathFrame = 0;
        const { activeIndex, progress } = getPathState();

        if (currentPathIndex === -1) {
            renderedProgress = progress;
            pathPawnAnchor.style.setProperty("--scroll-progress", String(progress));
        }

        targetProgress = progress;

        if (pathStops.length) {
            setActiveStop(activeIndex);
        }

        if (!isDraggingPawn && currentPathIndex !== -1 && activeIndex !== currentPathIndex) {
            triggerJump();
        }

        currentPathIndex = activeIndex;

        if (!pawnMotionFrame) {
            pawnMotionFrame = window.requestAnimationFrame(renderPawn);
        }
    };

    const requestPathSync = () => {
        if (pathFrame) return;
        pathFrame = window.requestAnimationFrame(syncPathPawn);
    };

    syncPathPawn();
    window.addEventListener("scroll", requestPathSync, { passive: true });
    window.addEventListener("resize", requestPathSync);
    window.addEventListener("load", requestPathSync);

    if (pathPawn && "PointerEvent" in window) {
        const stopDraggingPawn = () => {
            if (!isDraggingPawn) return;

            isDraggingPawn = false;
            activePawnPointerId = null;
            body.classList.remove("is-dragging-pawn");
            pathPawnAnchor.classList.remove("is-dragging");
            requestPathSync();
        };

        const handlePawnPointerMove = (event) => {
            if (!isDraggingPawn || event.pointerId !== activePawnPointerId) {
                return;
            }

            setScrollFromClientY(event.clientY);
        };

        const handlePawnPointerEnd = (event) => {
            if (event.pointerId !== activePawnPointerId) {
                return;
            }

            stopDraggingPawn();
        };

        pathPawnAnchor.addEventListener("pointerdown", (event) => {
            if (event.button !== 0 && event.pointerType !== "touch") {
                return;
            }

            isDraggingPawn = true;
            activePawnPointerId = event.pointerId;
            body.classList.add("is-dragging-pawn");
            pathPawnAnchor.classList.add("is-dragging");
            pathPawnAnchor.classList.remove("is-jumping");
            window.clearTimeout(jumpTimer);
            setScrollFromClientY(event.clientY);
            event.preventDefault();
        });

        window.addEventListener("pointermove", handlePawnPointerMove);
        window.addEventListener("pointerup", handlePawnPointerEnd);
        window.addEventListener("pointercancel", handlePawnPointerEnd);
        window.addEventListener("blur", stopDraggingPawn);
    }
}

const carousels = Array.from(document.querySelectorAll(".memory-carousel"));

carousels.forEach((carousel) => {
    const track = carousel.querySelector(".carousel-track");
    const viewport = carousel.querySelector(".carousel-viewport");
    const prev = carousel.querySelector(".carousel-prev");
    const next = carousel.querySelector(".carousel-next");
    const dotsRoot = carousel.querySelector(".carousel-dots");

    if (!track || !viewport || !dotsRoot) return;

    const originalSlides = Array.from(track.children);

    if (!originalSlides.length) return;

    let currentIndex = 0;
    let logicalIndex = 0;
    let visibleSlides = 1;
    let autoAdvanceTimer = 0;
    let dots = [];
    let cloneSpan = 0;
    let isSyncing = false;

    const getMetrics = () => {
        const firstSlide = track.querySelector(".carousel-slide");
        if (!firstSlide) {
            return { visibleSlides: 1 };
        }

        const styles = window.getComputedStyle(track);
        const gap = Number.parseFloat(styles.gap || styles.columnGap || "0") || 0;
        const slideWidth = firstSlide.getBoundingClientRect().width;
        const visibleSlides = Math.max(1, Math.floor((viewport.clientWidth + gap) / (slideWidth + gap)));
        return { visibleSlides };
    };

    const rebuildDots = () => {
        dotsRoot.innerHTML = "";
        dots = [];

        for (let index = 0; index < originalSlides.length; index += 1) {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.className = "carousel-dot";
            dot.setAttribute("aria-label", `Aller à l'élément ${index + 1}`);
            dot.addEventListener("click", () => {
                logicalIndex = index;
                renderSlide(cloneSpan + logicalIndex);
                restartAutoplay();
            });
            dotsRoot.appendChild(dot);
            dots.push(dot);
        }

        dotsRoot.hidden = originalSlides.length <= 1;
    };

    const stopAutoplay = () => {
        if (!autoAdvanceTimer) return;
        window.clearInterval(autoAdvanceTimer);
        autoAdvanceTimer = 0;
    };

    const startAutoplay = () => {
        if (prefersReducedMotion.matches || originalSlides.length < 2) return;
        stopAutoplay();
        autoAdvanceTimer = window.setInterval(() => {
            renderSlide(currentIndex + 1);
        }, 4600);
    };

    const restartAutoplay = () => {
        stopAutoplay();
        startAutoplay();
    };

    const updateDots = () => {
        dots.forEach((dot, dotIndex) => {
            const isActive = dotIndex === logicalIndex;
            dot.classList.toggle("is-active", isActive);
            dot.setAttribute("aria-current", isActive ? "true" : "false");
        });
    };

    const buildLoop = () => {
        track.innerHTML = "";

        if (originalSlides.length <= visibleSlides) {
            originalSlides.forEach((slide) => track.appendChild(slide.cloneNode(true)));
            cloneSpan = 0;
            currentIndex = 0;
            logicalIndex = 0;
            return;
        }

        cloneSpan = visibleSlides;
        const headClones = originalSlides.slice(-cloneSpan).map((slide) => {
            const clone = slide.cloneNode(true);
            clone.dataset.carouselClone = "true";
            return clone;
        });
        const tailClones = originalSlides.slice(0, cloneSpan).map((slide) => {
            const clone = slide.cloneNode(true);
            clone.dataset.carouselClone = "true";
            return clone;
        });

        [...headClones, ...originalSlides.map((slide) => slide.cloneNode(true)), ...tailClones].forEach((slide) => {
            track.appendChild(slide);
        });

        currentIndex = cloneSpan + logicalIndex;
    };

    function renderSlide(index, instant = false) {
        const renderedSlides = Array.from(track.children);
        if (!renderedSlides.length) return;

        currentIndex = index;
        logicalIndex = originalSlides.length
            ? ((currentIndex - cloneSpan) % originalSlides.length + originalSlides.length) % originalSlides.length
            : 0;

        if (instant) {
            track.style.transition = "none";
        } else {
            track.style.transition = "";
        }

        const offset = renderedSlides[currentIndex]?.offsetLeft || 0;
        track.style.transform = `translateX(-${offset}px)`;
        updateDots();

        if (instant) {
            void track.offsetWidth;
            track.style.transition = "";
        }
    }

    const syncCarousel = () => {
        if (isSyncing) return;
        isSyncing = true;
        visibleSlides = getMetrics().visibleSlides;
        buildLoop();

        if (dots.length !== originalSlides.length) {
            rebuildDots();
        }

        renderSlide(currentIndex, true);
        isSyncing = false;
    };

    prev?.addEventListener("click", () => {
        renderSlide(currentIndex - 1);
        restartAutoplay();
    });

    next?.addEventListener("click", () => {
        renderSlide(currentIndex + 1);
        restartAutoplay();
    });

    track.addEventListener("transitionend", () => {
        if (cloneSpan === 0 || originalSlides.length <= visibleSlides) return;

        if (currentIndex >= originalSlides.length + cloneSpan) {
            renderSlide(cloneSpan, true);
            return;
        }

        if (currentIndex < cloneSpan) {
            renderSlide(originalSlides.length + cloneSpan - 1, true);
        }
    });

    carousel.addEventListener("mouseenter", stopAutoplay);
    carousel.addEventListener("mouseleave", startAutoplay);
    carousel.addEventListener("focusin", stopAutoplay);
    carousel.addEventListener("focusout", (event) => {
        if (!carousel.contains(event.relatedTarget)) {
            startAutoplay();
        }
    });

    const handleMotionPreference = () => {
        if (prefersReducedMotion.matches) {
            stopAutoplay();
            return;
        }

        startAutoplay();
    };

    if ("addEventListener" in prefersReducedMotion) {
        prefersReducedMotion.addEventListener("change", handleMotionPreference);
    } else if ("addListener" in prefersReducedMotion) {
        prefersReducedMotion.addListener(handleMotionPreference);
    }

    if (originalSlides.length < 2) {
        prev?.setAttribute("hidden", "");
        next?.setAttribute("hidden", "");
        dotsRoot.setAttribute("hidden", "");
    }

    syncCarousel();
    startAutoplay();
    window.addEventListener("resize", syncCarousel);
});

if (modal && modalImage) {
    let currentIndex = 0;
    const getZoomItems = () => Array.from(document.querySelectorAll(".zoom-item")).filter((item) => !item.hidden);

    const renderModal = () => {
        const items = getZoomItems();
        const item = items[currentIndex];
        if (!item) return;
        const src = item.dataset.zoomSrc || "";
        const alt = item.dataset.zoomAlt || item.querySelector("img")?.alt || "";

        modalImage.src = src;
        modalImage.alt = alt;

        if (modalCaption) {
            modalCaption.textContent = alt;
        }
    };

    const openModal = (index) => {
        const items = getZoomItems();
        if (!items.length) return;
        currentIndex = index;
        renderModal();
        modal.hidden = false;
        modal.setAttribute("aria-hidden", "false");
        body.classList.add("modal-open");
    };

    const closeModal = () => {
        modal.hidden = true;
        modal.setAttribute("aria-hidden", "true");
        body.classList.remove("modal-open");
    };

    const moveModal = (direction) => {
        const items = getZoomItems();
        if (!items.length) return;
        currentIndex = (currentIndex + direction + items.length) % items.length;
        renderModal();
    };

    document.addEventListener("click", (event) => {
        const item = event.target.closest(".zoom-item");
        if (!item) return;
        const items = getZoomItems();
        const index = items.indexOf(item);
        if (index !== -1) {
            openModal(index);
        }
    });

    document.addEventListener("keydown", (event) => {
        const item = event.target.closest(".zoom-item");
        if (!item) return;
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        const items = getZoomItems();
        const index = items.indexOf(item);
        if (index !== -1) {
            openModal(index);
        }
    });

    modalClose?.addEventListener("click", closeModal);
    modalPrev?.addEventListener("click", () => moveModal(-1));
    modalNext?.addEventListener("click", () => moveModal(1));

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    window.addEventListener("keydown", (event) => {
        if (modal.hidden) return;
        if (event.key === "Escape") closeModal();
        if (event.key === "ArrowLeft") moveModal(-1);
        if (event.key === "ArrowRight") moveModal(1);
    });
}
