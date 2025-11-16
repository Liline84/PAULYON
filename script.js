document.addEventListener('DOMContentLoaded', () => {
    // 1. Sélectionner les éléments du DOM
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = mainNav.querySelectorAll('a');

    // 2. Événement de clic sur le bouton (☰)
    menuToggle.addEventListener('click', () => {
        // Bascule la classe 'active' sur l'élément #main-nav
        mainNav.classList.toggle('active');

        // Met à jour l'état ARIA pour l'accessibilité
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        
        // Change le symbole du bouton (optionnel : ☰ devient X)
        menuToggle.textContent = mainNav.classList.contains('active') ? '✖' : '☰';
    });
    
    // 3. Fermer le menu après avoir cliqué sur un lien (utile sur mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.textContent = '☰';
            }
        });
    });
});