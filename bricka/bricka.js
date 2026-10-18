document.addEventListener('DOMContentLoaded', () => {
    const heroVideo = document.querySelector('.bricka-hero-video');
    if (heroVideo) {
        const playWhenFullyBuffered = () => {
            const duration = heroVideo.duration;
            if (!Number.isFinite(duration) || duration <= 0) return;

            const buffered = heroVideo.buffered;
            const fullVideoBuffered = Array.from({ length: buffered.length }, (_, index) => index)
                .some(index => buffered.start(index) <= 0.1 && buffered.end(index) >= duration - 0.1);
            if (!fullVideoBuffered) return;

            ['progress', 'loadedmetadata', 'loadeddata', 'canplaythrough', 'durationchange', 'suspend']
                .forEach(eventName => heroVideo.removeEventListener(eventName, playWhenFullyBuffered));
            heroVideo.play().catch(() => {});
        };

        ['progress', 'loadedmetadata', 'loadeddata', 'canplaythrough', 'durationchange', 'suspend']
            .forEach(eventName => heroVideo.addEventListener(eventName, playWhenFullyBuffered));
        playWhenFullyBuffered();
    }
    const blocks = [...document.querySelectorAll('.bricka-process .method-block')];
    const links = [...document.querySelectorAll('.bricka-process .nav-step')];
    if (!blocks.length || !links.length) return;

    const setActive = (id) => {
        blocks.forEach(block => block.classList.toggle('active', block.id === id));
        links.forEach(link => {
            const active = link.hash === `#${id}`;
            link.classList.toggle('active', active);
            if (active) link.setAttribute('aria-current', 'step');
            else link.removeAttribute('aria-current');
        });
    };

    const observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
            if (entry.isIntersecting) setActive(entry.target.id);
        }
    }, { rootMargin: '-35% 0px -45% 0px', threshold: 0 });
    blocks.forEach(block => observer.observe(block));
    links.forEach(link => link.addEventListener('click', () => setActive(link.hash.slice(1))));

    const process = document.querySelector('.bricka-process');
    const scrollCol = process?.querySelector('.method-scroll-col');
    const stickyCol = process?.querySelector('.method-sticky-col');
    const leftDescription = process?.querySelector('.method-intro');
    const lastTitle = blocks.at(-1).querySelector('.block-content h3');
    const desktopProcess = window.matchMedia('(min-width: 901px)');
    const heroPrimaryButton = document.querySelector('.bricka-hero .hero-actions .btn-primary');
    const heroSecondaryButton = document.querySelector('.bricka-hero .hero-actions .btn-outline');

    const matchHeroButtonWidths = () => {
        if (!heroPrimaryButton || !heroSecondaryButton) return;
        heroSecondaryButton.style.width = `${heroPrimaryButton.getBoundingClientRect().width}px`;
    };

    matchHeroButtonWidths();
    window.addEventListener('resize', matchHeroButtonWidths, { passive: true });
    document.fonts?.ready.then(matchHeroButtonWidths);

    const alignProcessEnd = () => {
        if (!process || !scrollCol || !stickyCol || !leftDescription || !lastTitle) return;
        scrollCol.style.setProperty('--process-tail-space', '0px');
        if (!desktopProcess.matches) return;

        const processRect = process.getBoundingClientRect();
        const descriptionRect = leftDescription.getBoundingClientRect();
        const stickyTop = parseFloat(getComputedStyle(stickyCol).top) || 0;
        const descriptionMidpoint = (descriptionRect.top + descriptionRect.bottom) / 2 - stickyCol.getBoundingClientRect().top + stickyTop;
        const titleRect = lastTitle.getBoundingClientRect();
        const lastTitleCenterAtProcessEnd = (titleRect.top + titleRect.bottom) / 2 - processRect.bottom + window.innerHeight;
        const tailSpace = Math.max(0, lastTitleCenterAtProcessEnd - descriptionMidpoint);
        scrollCol.style.setProperty('--process-tail-space', `${tailSpace}px`);
    };

    alignProcessEnd();
    window.addEventListener('resize', alignProcessEnd, { passive: true });
    document.fonts?.ready.then(alignProcessEnd);
});
