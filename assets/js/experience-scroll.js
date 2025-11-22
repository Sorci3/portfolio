// experience-scroll.js - Version améliorée pour mobile

document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.experience-track');
    const cards = document.querySelectorAll('.wrapPrimaire4');
    const prevBtn = document.getElementById('prev-experience');
    const nextBtn = document.getElementById('next-experience');
    
    let currentIndex = 0;
    let cardsPerView = 3; // Par défaut: 3 cartes visibles
    
    // Fonction pour déterminer le nombre de cartes visibles
    function updateCardsPerView() {
        const width = window.innerWidth;
        if (width <= 700) {
            cardsPerView = 1; // Mobile: 1 carte
        } else if (width <= 900) {
            cardsPerView = 2; // Tablette: 2 cartes
        } else {
            cardsPerView = 3; // Desktop: 3 cartes
        }
    }
    
    // Fonction pour calculer le déplacement
    function updateCarousel() {
        updateCardsPerView();
        
        // Calcul du déplacement
        const cardWidth = cards[0].offsetWidth;
        let gap = parseFloat(getComputedStyle(track).gap) || 0;
        
        // Sur mobile, pas de gap mais padding
        if (window.innerWidth <= 700) {
            gap = 0;
        }
        
        const offset = currentIndex * (cardWidth + gap);
        
        track.style.transform = `translateX(-${offset}px)`;
        
        // Désactiver les boutons si nécessaire
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= cards.length - cardsPerView;
        
        // Mise à jour visuelle des boutons
        if (prevBtn.disabled) {
            prevBtn.style.opacity = '0.5';
            prevBtn.style.cursor = 'not-allowed';
        } else {
            prevBtn.style.opacity = '1';
            prevBtn.style.cursor = 'pointer';
        }
        
        if (nextBtn.disabled) {
            nextBtn.style.opacity = '0.5';
            nextBtn.style.cursor = 'not-allowed';
        } else {
            nextBtn.style.opacity = '1';
            nextBtn.style.cursor = 'pointer';
        }
    }
    
    // Événement pour le bouton précédent
    prevBtn.addEventListener('click', function() {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });
    
    // Événement pour le bouton suivant
    nextBtn.addEventListener('click', function() {
        if (currentIndex < cards.length - cardsPerView) {
            currentIndex++;
            updateCarousel();
        }
    });
    
    // Gestion du swipe tactile (optionnel mais recommandé pour mobile)
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    track.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50; // Distance minimale pour un swipe
        
        if (touchStartX - touchEndX > swipeThreshold) {
            // Swipe vers la gauche (suivant)
            if (currentIndex < cards.length - cardsPerView) {
                currentIndex++;
                updateCarousel();
            }
        }
        
        if (touchEndX - touchStartX > swipeThreshold) {
            // Swipe vers la droite (précédent)
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        }
    }
    
    // Réinitialiser lors du redimensionnement de la fenêtre
    window.addEventListener('resize', function() {
        const oldCardsPerView = cardsPerView;
        updateCardsPerView();
        
        // Ajuster l'index si nécessaire
        if (currentIndex > cards.length - cardsPerView) {
            currentIndex = Math.max(0, cards.length - cardsPerView);
        }
        
        updateCarousel();
    });
    
    // Support du clavier (optionnel)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevBtn.click();
        } else if (e.key === 'ArrowRight') {
            nextBtn.click();
        }
    });
    
    // Initialisation
    updateCarousel();
});