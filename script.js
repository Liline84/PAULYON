document.addEventListener('DOMContentLoaded', () => {
    // 1. SÉLECTION DES ÉLÉMENTS
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = mainNav.querySelectorAll('a');
    
    const settingsMenu = document.getElementById('settings-menu');
    const dropdownToggle = settingsMenu.querySelector('.dropdown-toggle');


    // 2. GESTION DU MENU HAMBURGER (MOBILE)
    menuToggle.addEventListener('click', () => {
        // Bascule la classe 'active' pour afficher/cacher le menu
        mainNav.classList.toggle('active');

        // Gère l'état ARIA
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        
        // Change le symbole du bouton (☰ devient X)
        menuToggle.textContent = mainNav.classList.contains('active') ? '✖' : '☰';

        // S'assure de fermer le sous-menu Paramètres si le menu principal est fermé
        if (!mainNav.classList.contains('active')) {
             settingsMenu.classList.remove('show');
        }
    });
    
    // 3. FERMER LE MENU APRÈS AVOIR CLIQUÉ SUR UN LIEN
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Ferme le menu principal si on clique sur un lien (sauf Paramètres)
            if (mainNav.classList.contains('active') && !link.closest('.dropdown')) {
                mainNav.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.textContent = '☰';
            }
        });
    });

    // 4. GESTION DU SOUS-MENU DÉROULANT (PARAMÈTRES)
    dropdownToggle.addEventListener('click', (event) => {
        event.preventDefault(); // Empêche le lien '#' de recharger la page
        event.stopPropagation(); // Empêche l'événement de se propager
        
        // Bascule la classe 'show' sur le conteneur pour l'afficher
        settingsMenu.classList.toggle('show');
    });

    // 5. FERMER LE SOUS-MENU SI L'UTILISATEUR CLIQUE EN DEHORS
    document.addEventListener('click', (event) => {
        if (!settingsMenu.contains(event.target)) {
            settingsMenu.classList.remove('show');
        }
    });
});
