document.addEventListener('DOMContentLoaded', () => {
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav-menu');
    const navbar = document.querySelector('.navbar');

    if (burger && nav) {
        burger.addEventListener('click', () => {
            const expanded = burger.getAttribute('aria-expanded') === 'true';
            burger.setAttribute('aria-expanded', String(!expanded));
            nav.classList.toggle('active');
            document.body.classList.toggle('menu-open', !expanded);
        });

        nav.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                burger.setAttribute('aria-expanded', 'false');
                nav.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });

        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                burger.setAttribute('aria-expanded', 'false');
                nav.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }

    if (navbar) {
        const onScrollState = () => {
            navbar.classList.toggle('scrolled', window.scrollY > 24);
        };

        window.addEventListener('scroll', onScrollState, { passive: true });
        onScrollState();
    }

    const faders = document.querySelectorAll('.fade-up');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.16 });

        faders.forEach((element) => observer.observe(element));
    } else {
        faders.forEach((element) => element.classList.add('visible'));
    }

    const topBtn = document.getElementById('topBtn');
    if (topBtn) {
        const onTopBtn = () => {
            topBtn.classList.toggle('is-visible', window.scrollY > 320);
        };

        window.addEventListener('scroll', onTopBtn, { passive: true });
        onTopBtn();

        topBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    if (window.Swiper && document.querySelector('.mySwiper')) {
        new window.Swiper('.mySwiper', {
            slidesPerView: 'auto',
            spaceBetween: 18,
            loop: true,
            autoplay: {
                delay: 2600,
                disableOnInteraction: false
            },
            speed: 650,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            }
        });
    }
});
