const benevolatCards = document.querySelectorAll(".benevolat-card");
const nextBenevolat = document.getElementById("next-benevolat");
const prevBenevolat = document.getElementById("prev-benevolat");

let currentIndex = 0;

function showCard(index) {
    // Masque toutes les cartes
    benevolatCards.forEach(card => {
        card.classList.remove("active");
    });
    
    // Affiche la carte demandée
    benevolatCards[index].classList.add("active");
    currentIndex = index;
}

// Initialisation : affiche la première carte
showCard(0);

// Bouton suivant
nextBenevolat.addEventListener("click", () => {
    const nextIndex = (currentIndex + 1) % benevolatCards.length;
    showCard(nextIndex);
});

// Bouton précédent
prevBenevolat.addEventListener("click", () => {
    const prevIndex = (currentIndex - 1 + benevolatCards.length) % benevolatCards.length;
    showCard(prevIndex);
});