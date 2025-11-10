/* assets/js/experience-scroll.js
   Conversion du scroll vertical => horizontal pour .wrapPrimaire3.
   Écoute le wheel SUR le conteneur scroller (wrapPrimaire3) pour éviter de bloquer
   le scroll de la page entière quand on est juste au-dessus.
   
   MISE À JOUR : Simplification de la logique wheel et ajout de la navigation par boutons
*/

(function () {
    const section = document.getElementById('experience');
    if (!section) return;

    const scroller = section.querySelector('.wrapPrimaire3');
    if (!scroller) return;

    // rendre focusable pour support clavier
    scroller.setAttribute('tabindex', '0');

    let pointerOverScroller = false;
    let touchStartY = 0;
    let touchStartX = 0;

    // pointerenter/leave sur la SECTION entière pour élargir la zone de détection
    scroller.addEventListener('pointerenter', () => pointerOverScroller = true);
    scroller.addEventListener('pointerleave', () => pointerOverScroller = false);

    // IntersectionObserver utile pour les événements clavier (quand la section est majoritairement visible)
    let sectionMostlyVisible = false;
    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            sectionMostlyVisible = entry.isIntersecting && entry.intersectionRatio > 0.5;
        });
    }, { threshold: [0.5] });
    io.observe(section);

    function shouldInterceptWheel() {
        // n'intercepte le wheel que si la souris est SUR la section
        // ou (fallback clavier) si la section est majoritairement visible
        return pointerOverScroller || sectionMostlyVisible;
    }

    // WHEEL : attaché à la SECTION pour une zone de détection élargie
    function onWheel(e) {
        if (!shouldInterceptWheel()) return;
        if (e.ctrlKey) return; // laisse Ctrl+wheel (zoom)

        // Si le conteneur n'a pas d'overflow horizontal, on ne transforme pas le wheel
        if (scroller.scrollWidth <= scroller.clientWidth) return;

        // *** CORRECTION pour éviter le blocage : on intercepte TOUT scroll ***
        e.preventDefault();

        let delta = e.deltaY;
        if (e.deltaMode === 1) delta *= 16;
        if (e.deltaMode === 2) delta *= window.innerHeight;

        scroller.scrollLeft += delta;
    }

    // TOUCH : conversion swipe vertical -> scroll horizontal (attaché au scroller)
    function onTouchStart(e) {
        if (!shouldInterceptWheel()) return;
        const t = e.touches[0];
        touchStartY = t.clientY;
        touchStartX = t.clientX;
    }

    function onTouchMove(e) {
        if (!shouldInterceptWheel()) return;
        const t = e.touches[0];
        const dy = touchStartY - t.clientY;
        const dx = touchStartX - t.clientX;

        // si geste majoritairement vertical, on transforme
        if (Math.abs(dy) > Math.abs(dx)) {
            const atStart = scroller.scrollLeft <= 0;
            const atEnd = Math.ceil(scroller.scrollLeft + scroller.clientWidth) >= scroller.scrollWidth;

            // si on est au début et le geste veut remonter -> laisser page défiler
            if (atStart && dy < 0) return;
            // si on est à la fin et le geste veut descendre -> laisser page défiler
            if (atEnd && dy > 0) return;

            e.preventDefault();
            scroller.scrollLeft += dy;
            touchStartY = t.clientY;
        } else {
            touchStartX = t.clientX;
        }
    }

    // KEYBOARD : flèches et page up/down quand le scroller est focus ou la section visible
    function onKey(e) {
        if (!sectionMostlyVisible && document.activeElement !== scroller) return;
        const keys = ['ArrowUp','ArrowDown','PageUp','PageDown','Home','End'];
        if (!keys.includes(e.code)) return;
        e.preventDefault();
        switch (e.code) {
            case 'ArrowUp': scroller.scrollLeft -= 80; break;
            case 'ArrowDown': scroller.scrollLeft += 80; break;
            case 'PageUp': scroller.scrollLeft -= window.innerWidth * 0.8; break;
            case 'PageDown': scroller.scrollLeft += window.innerWidth * 0.8; break;
            case 'Home': scroller.scrollLeft = 0; break;
            case 'End': scroller.scrollLeft = scroller.scrollWidth; break;
        }
    }

    // Fonction de navigation pour les boutons (carrousel)
    function scrollToNextItem(direction) {
        // La navigation est basée sur le déplacement d'une fraction de la largeur du conteneur
        // car le scroll-snap s'occupera d'aligner parfaitement.
        const scrollAmount = direction === 'next' ? scroller.clientWidth * 0.8 : -scroller.clientWidth * 0.8;
        
        scroller.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }

    // Ajout des écouteurs pour les boutons de navigation (doivent exister dans index.html)
    const prevButton = document.getElementById('prev-experience');
    const nextButton = document.getElementById('next-experience');

    if (prevButton) {
        prevButton.addEventListener('click', () => scrollToNextItem('prev'));
    }
    if (nextButton) {
        nextButton.addEventListener('click', () => scrollToNextItem('next'));
    }

    // LISTENERS : wheel sur la section (passive:false pour pouvoir preventDefault)
    scroller.addEventListener('wheel', onWheel, { passive: false });
    scroller.addEventListener('touchstart', onTouchStart, { passive: true });
    scroller.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('keydown', onKey, { passive: false });

})();