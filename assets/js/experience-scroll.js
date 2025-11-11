// experience-scroll.js - Navigation par groupes de 3 cartes (section Expériences uniquement)

document.addEventListener('DOMContentLoaded', () => {
    // Cibler uniquement la section #experience
    const experienceSection = document.querySelector('#experience');
    if (!experienceSection) return; // sécurité

    const experienceTrack = experienceSection.querySelector('.experience-track');
    const experienceCards = experienceSection.querySelectorAll('.wrapPrimaire4');
    const prevBtn = experienceSection.querySelector('#prev-experience');
    const nextBtn = experienceSection.querySelector('#next-experience');

    // Vérification que tous les éléments nécessaires sont présents
    if (!experienceTrack || !experienceCards.length || !prevBtn || !nextBtn) {
        console.warn("⚠️ Éléments de la section 'Expériences' manquants. Script ignoré.");
        return;
    }

    let currentIndex = 0;
    const cardsPerView = 3; // Nombre de cartes visibles à la fois

    function updateCarousel() {
        const totalCards = experienceCards.length;
        const maxIndex = Math.max(0, totalCards - cardsPerView);

        // Calcul du déplacement en fonction de la largeur des cartes + gap
        const cardWidth = experienceCards[0].offsetWidth;
        const gap = parseFloat(getComputedStyle(experienceTrack).gap) || 0;
        const moveAmount = (cardWidth + gap) * currentIndex;

        experienceTrack.style.transform = `translateX(-${moveAmount}px)`;
        updateButtons(maxIndex);
    }

    function updateButtons(maxIndex) {
        // Gérer l'état du bouton précédent
        prevBtn.disabled = currentIndex === 0;
        prevBtn.style.opacity = prevBtn.disabled ? '0.5' : '1';
        prevBtn.style.cursor = prevBtn.disabled ? 'not-allowed' : 'pointer';

        // Gérer l'état du bouton suivant
        nextBtn.disabled = currentIndex >= maxIndex;
        nextBtn.style.opacity = nextBtn.disabled ? '0.5' : '1';
        nextBtn.style.cursor = nextBtn.disabled ? 'not-allowed' : 'pointer';
    }

    // Événements de navigation
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    nextBtn.addEventListener('click', () => {
        const totalCards = experienceCards.length;
        const maxIndex = Math.max(0, totalCards - cardsPerView);
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        }
    });

    // Gérer le redimensionnement de la fenêtre
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const totalCards = experienceCards.length;
            const maxIndex = Math.max(0, totalCards - cardsPerView);
            if (currentIndex > maxIndex) currentIndex = maxIndex;
            updateCarousel();
        }, 200);
    });

    // Initialisation
    updateCarousel();
});
