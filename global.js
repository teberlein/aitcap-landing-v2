/**
 * AITCAP — global.js
 * Contiene: Menú móvil, animaciones genéricas de scroll,
 * animación de hero (.reveal), IntersectionObserver premium
 * (.ux-text / .ux-visual), parallax compartido (.ux-parallax),
 * y animaciones de steps y cards (usados en 2+ páginas).
 *
 * Dependencias: GSAP + ScrollTrigger (cargados en el HTML).
 */

document.addEventListener('DOMContentLoaded', () => {

    gsap.registerPlugin(ScrollTrigger);

    // ===============================================
    // 1. GLOBAL: NAVBAR & MENU (Funciona en todas)
    // ===============================================
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileServicesToggle = document.getElementById('mobileServicesToggle');
    const mobileServices = document.getElementById('mobileServices');
    const desktopServicesToggle = document.getElementById('desktopServicesToggle');
    const desktopDropdown = desktopServicesToggle?.closest('.nav-dropdown');

    function setMobileMenu(open) {
        if (!menuToggle || !mobileMenu) return;
        mobileMenu.classList.toggle('open', open);
        menuToggle.classList.toggle('active', open);
        menuToggle.setAttribute('aria-expanded', String(open));
        document.body.style.overflow = open ? 'hidden' : '';
        if (!open && mobileServicesToggle && mobileServices) {
            mobileServices.hidden = true;
            mobileServicesToggle.setAttribute('aria-expanded', 'false');
        }
    }

    menuToggle?.addEventListener('click', () => setMobileMenu(!mobileMenu.classList.contains('open')));
    mobileMenu?.querySelectorAll('a.m-link').forEach(link => link.addEventListener('click', () => setMobileMenu(false)));
    mobileServicesToggle?.addEventListener('click', () => {
        const open = mobileServices.hidden;
        mobileServices.hidden = !open;
        mobileServicesToggle.setAttribute('aria-expanded', String(open));
    });

    function closeDesktopServices() {
        desktopDropdown?.classList.remove('open');
        desktopServicesToggle?.setAttribute('aria-expanded', 'false');
    }
    desktopServicesToggle?.addEventListener('click', () => {
        const open = !desktopDropdown.classList.contains('open');
        desktopDropdown.classList.toggle('open', open);
        desktopServicesToggle.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', event => {
        if (desktopDropdown && !desktopDropdown.contains(event.target)) closeDesktopServices();
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            closeDesktopServices();
            setMobileMenu(false);
        }
    });
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) setMobileMenu(false);
    });

    // ===============================================
    // 2. GLOBAL: ANIMACIONES SCROLL GENÉRICAS
    // Selector [data-scroll] usado en todas las páginas
    // ===============================================
    const sections = document.querySelectorAll('[data-scroll]');

    if (sections.length > 0) {
        sections.forEach(section => {
            gsap.fromTo(section,
                { y: 40, opacity: 0 },
                {
                    y: 0, opacity: 1,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 90%",
                        toggleActions: "play none none none"
                    }
                }
            );
        });
    }

    // ===============================================
    // 3. GLOBAL: ANIMACIÓN HERO (.reveal)
    // Usada en index, next, private, corporate, tech
    // ===============================================
    if (document.querySelector('.reveal')) {
        const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        heroTl.from('.reveal', {
            y: 50, opacity: 0, duration: 1, stagger: 0.15, delay: 0.2
        });
    }

    // ===============================================
    // 4. GLOBAL: PARALLAX HERO BACKGROUND
    // Usado en index (heroBg), next (nextHeroBg), private (privateHeroBg)
    // ===============================================
    const heroBg = document.getElementById('heroBg')
                   || document.getElementById('nextHeroBg')
                   || document.getElementById('privateHeroBg')
                   || document.getElementById('corpHeroBg')
                   || document.getElementById('techHeroBg');

    if (heroBg) {
        window.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            gsap.to(heroBg, { x: -x * 30, y: -y * 30, duration: 1.5, ease: "power1.out" });
        });
    }

    // ===============================================
    // 5. GLOBAL: CARDS ANIMATION (.card)
    // Usadas en index.html y potencialmente en otras
    // ===============================================
    const cards = document.querySelectorAll('.card');
    if (cards.length > 0) {
        gsap.set(".card", { y: 60, opacity: 0 });

        ScrollTrigger.batch(".card", {
            interval: 0.1,
            start: "top 85%",
            onEnter: batch => gsap.to(batch, {
                opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: "power3.out", overwrite: true
            }),
            onEnterBack: batch => gsap.to(batch, { opacity: 1, y: 0, overwrite: true })
        });
    }

    // ===============================================
    // 6. GLOBAL: STEPS ANIMATION (.step)
    // Usado en index.html y next.html
    // ===============================================
    const steps = document.querySelectorAll('.step');
    if (steps.length > 0) {
        gsap.set(".step", { y: 30, opacity: 0 });
        ScrollTrigger.batch(".step", {
            start: "top 85%",
            onEnter: batch => gsap.to(batch, {
                opacity: 1, y: 0, stagger: 0.2, duration: 0.6, ease: "power2.out"
            })
        });
    }

    /* // ===============================================
    // 7. GLOBAL: DIFERENCIALES STAGGER ANIMATION (.diff-item)
    // Usado en index.html
    // ===============================================
    const diffItems = document.querySelectorAll('.diff-item');
    if (diffItems.length > 0) {
        gsap.set(".diff-item", { y: 30, opacity: 0 });
        ScrollTrigger.batch(".diff-item", {
            start: "top 70%",
            onEnter: batch => gsap.to(batch, {
                opacity: 1, y: 0, stagger: 0.2, duration: 0.8, ease: "power2.out", overwrite: true
            }),
            onLeave: batch => gsap.set(batch, { opacity: 0, y: -30 }),
            onEnterBack: batch => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, overwrite: true })
        });
    } */

    // ===============================================
    // 8. GLOBAL: ANIMACIONES PREMIUM UX (IntersectionObserver)
    // Targets: .ux-text, .ux-visual
    // Usado en private y potencialmente en otras páginas
    // ===============================================
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -15% 0px',
        threshold: 0.1
    };

    const premiumObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const pageSections = document.querySelectorAll('section');
    pageSections.forEach(section => {
        const animatableItems = section.querySelectorAll('.ux-text, .ux-visual');
        animatableItems.forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.15}s`;
            premiumObserver.observe(item);
        });
    });

    // ===============================================
    // 9. GLOBAL: PARALLAX FLUIDO (.ux-parallax)
    // Usado en private (circles, grid-lines, tech-dots, growth-bars)
    // ===============================================
    const parallaxElements = document.querySelectorAll('.ux-parallax');

    if (parallaxElements.length > 0) {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    parallaxElements.forEach(el => {
                        const speed = parseFloat(el.getAttribute('data-speed')) || 0.05;

                        const rect = el.getBoundingClientRect();
                        const elCenter = rect.top + (rect.height / 2);
                        const viewCenter = window.innerHeight / 2;

                        const diff = elCenter - viewCenter;
                        const yPos = -(diff * speed);

                        let baseTransform = '';

                        // Fix rotación tech-line (private page)
                        if (el.classList.contains('tech-line')) {
                            baseTransform = 'rotate(15deg)';
                        }

                        el.style.transform = `translateY(${yPos}px) ${baseTransform}`;
                    });
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // ===============================================
    // 10. GLOBAL: PRIVATE SCROLL REVEAL
    // Targets: .private-section con [data-private-scroll] y [data-private-visual]
    // Solo actúa si existen elementos en la página actual
    // ===============================================
    const privateSections = document.querySelectorAll('.private-section');

    if (privateSections.length > 0) {
        privateSections.forEach(section => {
            const textCol = section.querySelector('[data-private-scroll]');
            if (textCol) {
                gsap.fromTo(textCol,
                    { y: 50, opacity: 0 },
                    {
                        y: 0, opacity: 1,
                        duration: 1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: section,
                            start: "top 70%",
                            toggleActions: "play none none none"
                        }
                    }
                );
            }

            const visualCol = section.querySelector('[data-private-visual]');
            if (visualCol) {
                gsap.fromTo(visualCol,
                    { scale: 0.9, opacity: 0 },
                    {
                        scale: 1, opacity: 1,
                        duration: 1.2,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: section,
                            start: "top 70%",
                            toggleActions: "play none none none"
                        }
                    }
                );
            }
        });
    }

/*     // ===============================================
    // 11. GLOBAL: MÉTODO — LÓGICA RESPONSIVE (MATCH MEDIA)
    // Usado en index.html (method-section)
    // ===============================================
    ScrollTrigger.matchMedia({
        "(min-width: 901px)": function() {
            const methodBlocks = document.querySelectorAll('.method-block');
            const navSteps = document.querySelectorAll('.nav-step');

            if (methodBlocks.length > 0) {
                gsap.set(methodBlocks, { opacity: 0.2, y: 0 });

                methodBlocks.forEach((block, i) => {
                    ScrollTrigger.create({
                        trigger: block, start: "top center", end: "bottom center",
                        onToggle: self => {
                            if (self.isActive) {
                                gsap.to(block, { opacity: 1, duration: 0.5 });
                                navSteps.forEach(nav => nav.classList.remove('active'));
                                if (navSteps[i]) navSteps[i].classList.add('active');
                            } else {
                                gsap.to(block, { opacity: 0.2, duration: 0.5 });
                            }
                        }
                    });
                });
            }
        },
        "(max-width: 900px)": function() {
            const methodBlocks = document.querySelectorAll('.method-block');
            if (methodBlocks.length > 0) {
                gsap.set(methodBlocks, { opacity: 0, y: 50 });
                ScrollTrigger.batch(".method-block", {
                    start: "top 80%",
                    onEnter: batch => gsap.to(batch, {
                        opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power2.out", overwrite: true
                    })
                });
            }
        }
    }); */

});
