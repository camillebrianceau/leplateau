const body = document.body;
const header = document.querySelector(".site-header");
const navMenu = document.querySelector(".nav-menu");
const navToggle = document.querySelector(".nav-toggle");
const revealItems = document.querySelectorAll("[data-reveal]");
const year = document.querySelector("#year");
const pathTrack = document.querySelector(".path-track");
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

if (pathTrack && pathPawnAnchor && pathStops.length) {
    const pathSections = pathStops.map((stop) => {
        const target = stop.getAttribute("href");
        return target ? document.querySelector(target) : null;
    });

    let currentPathIndex = -1;
    let pathFrame = 0;
    let pawnMotionFrame = 0;
    let jumpTimer = 0;
    let targetProgress = 0;
    let renderedProgress = 0;

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
        const lastIndex = pathSections.length - 1;
        const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
        let activeIndex = 0;
        let progress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);

        pathSections.forEach((section, index) => {
            if (section && section.offsetTop <= marker) {
                activeIndex = index;
            }
        });

        if (lastIndex <= 0) {
            return { activeIndex, progress };
        }

        return { activeIndex, progress };
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
        setActiveStop(activeIndex);

        if (currentPathIndex !== -1 && activeIndex !== currentPathIndex) {
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
}

const carousels = Array.from(document.querySelectorAll(".memory-carousel"));

carousels.forEach((carousel) => {
    const track = carousel.querySelector(".carousel-track");
    const viewport = carousel.querySelector(".carousel-viewport");
    const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
    const prev = carousel.querySelector(".carousel-prev");
    const next = carousel.querySelector(".carousel-next");
    const dotsRoot = carousel.querySelector(".carousel-dots");

    if (!track || !viewport || !slides.length || !dotsRoot) return;

    let currentIndex = 0;
    let maxIndex = 0;
    let autoAdvanceTimer = 0;
    let dots = [];

    const getMetrics = () => {
        const firstSlide = slides[0];
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

        for (let index = 0; index <= maxIndex; index += 1) {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.className = "carousel-dot";
            dot.setAttribute("aria-label", `Aller au groupe de photos ${index + 1}`);
            dot.addEventListener("click", () => {
                renderSlide(index);
                restartAutoplay();
            });
            dotsRoot.appendChild(dot);
            dots.push(dot);
        }

        dotsRoot.hidden = maxIndex === 0;
    };

    const stopAutoplay = () => {
        if (!autoAdvanceTimer) return;
        window.clearInterval(autoAdvanceTimer);
        autoAdvanceTimer = 0;
    };

    const startAutoplay = () => {
        if (prefersReducedMotion.matches || slides.length < 2) return;
        stopAutoplay();
        autoAdvanceTimer = window.setInterval(() => {
            renderSlide(currentIndex + 1);
        }, 4600);
    };

    const restartAutoplay = () => {
        stopAutoplay();
        startAutoplay();
    };

    function renderSlide(index) {
        if (!slides.length) return;

        currentIndex = maxIndex > 0
            ? ((index % (maxIndex + 1)) + (maxIndex + 1)) % (maxIndex + 1)
            : 0;

        const offset = slides[currentIndex]?.offsetLeft || 0;
        track.style.transform = `translateX(-${offset}px)`;

        dots.forEach((dot, dotIndex) => {
            const isActive = dotIndex === currentIndex;
            dot.classList.toggle("is-active", isActive);
            dot.setAttribute("aria-current", isActive ? "true" : "false");
        });
    }

    const syncCarousel = () => {
        const { visibleSlides } = getMetrics();
        maxIndex = Math.max(slides.length - visibleSlides, 0);

        if (dots.length !== maxIndex + 1) {
            rebuildDots();
        }

        renderSlide(Math.min(currentIndex, maxIndex));
    };

    prev?.addEventListener("click", () => {
        renderSlide(currentIndex - 1);
        restartAutoplay();
    });

    next?.addEventListener("click", () => {
        renderSlide(currentIndex + 1);
        restartAutoplay();
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

    if (slides.length < 2) {
        prev?.setAttribute("hidden", "");
        next?.setAttribute("hidden", "");
        dotsRoot.setAttribute("hidden", "");
    }

    syncCarousel();
    startAutoplay();
    window.addEventListener("resize", syncCarousel);
});

if (modal && modalImage && zoomItems.length) {
    let currentIndex = 0;

    const renderModal = () => {
        const item = zoomItems[currentIndex];
        const src = item.dataset.zoomSrc || "";
        const alt = item.dataset.zoomAlt || item.querySelector("img")?.alt || "";

        modalImage.src = src;
        modalImage.alt = alt;

        if (modalCaption) {
            modalCaption.textContent = alt;
        }
    };

    const openModal = (index) => {
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
        currentIndex = (currentIndex + direction + zoomItems.length) % zoomItems.length;
        renderModal();
    };

    zoomItems.forEach((item, index) => {
        item.addEventListener("click", () => openModal(index));

        if (item.getAttribute("role") === "button") {
            item.addEventListener("keydown", (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openModal(index);
                }
            });
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
