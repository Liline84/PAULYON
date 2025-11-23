// script.js (Réécrit pour le chargement dynamique)

// AJOUT : Classe pour gérer les transitions CSS après le chargement
document.body.classList.add('preload');


// ==========================================================
// [FONCTION GLOBALE] Gère l'initialisation de tout le HEADER
// Cette fonction doit être appelée depuis index.html APRES le fetch('header.html')
// ==========================================================
function initMenuHandlers() {

    // Retirer la classe de préchargement pour activer les transitions CSS
    setTimeout(() => {
        document.body.classList.remove('preload');
    }, 100); 

    // ==========================================================
    // 1. SÉLECTION DES ÉLÉMENTS (CONSOLIDÉ)
    // ==========================================================
    // Ces sélections ne devraient plus être NULL à ce stade.
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.getElementById('main-nav');
    // Vérification de l'existence avant d'appeler querySelectorAll
    const navLinks = mainNav ? mainNav.querySelectorAll('a') : [];

    // Menus Déroulants
    const settingsToggle = document.getElementById('nav-settings');
    const languageToggle = document.getElementById('nav-language-toggle');
    // Référence au <li> parent contenant la classe 'show'
    const settingsMenu = settingsToggle ? settingsToggle.closest('.dropdown') : null; 
    const languageDropdown = languageToggle ? languageToggle.closest('.dropdown-language') : null; 

    // Éléments pour la Recherche
    const searchToggleBtn = document.getElementById('search-toggle-btn');
    const searchContainer = document.getElementById('search-container');
    const searchInput = document.getElementById('search-input');
    
    // ==========================================================
    // [FONCTION COMMUNE] Gestion Générale de la Fermeture
    // ==========================================================
    function closeAllMenus() {
        if (mainNav) mainNav.classList.remove('active');
        if (menuToggle) {
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.textContent = '☰';
        }
        if (settingsMenu) settingsMenu.classList.remove('show');
        if (languageDropdown) languageDropdown.classList.remove('show');
        
        // Fermeture de la recherche
        if (searchContainer) searchContainer.classList.remove('active');
        if (searchToggleBtn) searchToggleBtn.setAttribute('aria-expanded', 'false');
        if (searchInput) searchInput.value = '';
    }

    // ==========================================================
    // 2. GESTION DU MENU HAMBURGER (MOBILE) - DOIT MAINTENANT FONCTIONNER
    // ==========================================================
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');

            const isExpanded = mainNav.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
            
            // Mise à jour de l'icône
            menuToggle.textContent = isExpanded ? '✖' : '☰';

            // Ferme les sous-menus si le menu principal est fermé
            if (!isExpanded) {
                 if (settingsMenu) settingsMenu.classList.remove('show');
                 if (languageDropdown) languageDropdown.classList.remove('show');
                 if (searchContainer) searchContainer.classList.remove('active');
                 if (searchToggleBtn) searchToggleBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    // ==========================================================
    // 3. FERMER LE MENU APRÈS AVOIR CLIQUÉ SUR UN LIEN PRINCIPAL
    // ==========================================================
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            if (!link.closest('.dropdown') && link.getAttribute('href').startsWith('#')) {
                closeAllMenus();
            }
            navLinks.forEach(l => l.removeAttribute('aria-current'));
            link.setAttribute('aria-current', 'page');
        });
    });

    // ==========================================================
    // 4. GESTION DES SOUS-MENUS PARAMÈTRES ET LANGUE
    // ==========================================================
    if (settingsToggle && settingsMenu) {
        settingsToggle.addEventListener('click', (event) => {
            event.preventDefault(); 
            event.stopPropagation();
            settingsMenu.classList.toggle('show'); 
            
            if (!settingsMenu.classList.contains('show') && languageDropdown) {
                languageDropdown.classList.remove('show');
            }
        });
    }

    if (languageToggle && languageDropdown) {
        languageToggle.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            languageDropdown.classList.toggle('show');
        });
    }

    // ==========================================================
    // 5. GESTION DU BOUTON DE RECHERCHE
    // ==========================================================
    if (searchToggleBtn && searchContainer && searchInput) {
        searchToggleBtn.addEventListener('click', function() {
            searchContainer.classList.toggle('active');
            
            const isExpanded = searchContainer.classList.contains('active');
            searchToggleBtn.setAttribute('aria-expanded', isExpanded);

            if (isExpanded) {
                searchInput.focus();
                if (mainNav && mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    menuToggle.textContent = '☰';
                }
            } else {
                searchInput.value = ''; 
            }
        });
    }
    
    // ==========================================================
    // 6. FERMER LES MENUS SI L'UTILISATEUR CLIQUE EN DEHORS
    // ==========================================================
    document.addEventListener('click', (event) => {
        const isOutsideMenu = mainNav && !mainNav.contains(event.target) && menuToggle && !menuToggle.contains(event.target);
        const isOutsideSearch = searchContainer && !searchContainer.contains(event.target) && searchToggleBtn && !searchToggleBtn.contains(event.target);
        
        if (isOutsideMenu && isOutsideSearch) {
            closeAllMenus();
        }
    });
}
// FIN de initMenuHandlers()


// ==========================================================
// LOGIQUE QUI N'EST PAS DANS initMenuHandlers (Traduction/WhatsApp)
// Elle sera exécutée au chargement normal de la page.
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {
    
    // Variables nécessaires
    const langOptions = document.querySelectorAll('.lang-option');
    const whatsappNumber = '50941172815'; 
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cart = []; 

    // A. Le Dictionnaire de Traduction (AJOUT de 'btn-order')
    const translations = {
        'fr': {
            // ... (translations existantes)
            'nav-accueil': 'Accueil',
            'nav-produits': 'Produits',
            'prod-electronique-btn': 'Voir la sélection',
            'btn-order': 'Commander', 
            // ... (autres services et contacts)
        },
        'en': {
             // ... (translations existantes)
             'nav-accueil': 'Home',
             'nav-produits': 'Products',
             'prod-electronique-btn': 'View Selection',
             'btn-order': 'Order', 
             // ...
        },
        'ht': {
            // ... (translations existantes)
            'nav-accueil': 'Lakay',
            'nav-produits': 'Pwodwi',
            'prod-electronique-btn': 'Gade seleksyon an',
            'btn-order': 'Kòmande', 
            // ...
        }
    };


    // B. Fonction de Traduction Principale (Inchangée)
    function setLanguage(langCode) {
        const currentTranslation = translations[langCode];
        if (!currentTranslation) return;
        
        // Cible la racine des lang options pour mise à jour visuelle si nécessaire
        const languageDropdown = document.querySelector('.dropdown-language');
        
        // 1. Traduction des éléments par ID et cas spéciaux
        for (const id in currentTranslation) {
            const element = document.getElementById(id);
            const value = currentTranslation[id];
            
            // ... (Logique de traduction complète ici, telle que vous l'aviez fournie)
            if (element) {
                if (id === 'title-tag') {
                    document.title = value;
                } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    if (id.includes('placeholder')) {
                        element.setAttribute('placeholder', value);
                    }
                } else if (id === 'p-contact-email') {
                    const email = 'contact.paulyon@gmail.com'; 
                    const contactHTML = value.replace(email, `<a href="mailto:${email}">${email}</a>`);
                    element.innerHTML = contactHTML;
                } else if (id === 'p-contact-whatsapp') {
                    const whatsappLink = element.querySelector('a');
                    const linkText = whatsappLink ? whatsappLink.outerHTML : 'WhatsApp';
                    const contactHTML = value.replace('WhatsApp', linkText);
                    element.innerHTML = contactHTML;
                } else {
                    element.textContent = value;
                }
            } else {
                // 2. Gestion des Cartes (Produits/Services)
                if (id.endsWith('-title')) {
                    const cardId = id.replace('-title', '');
                    const titleElement = document.querySelector(`#${cardId} h3`);
                    if (titleElement) titleElement.textContent = value;
                } else if (id.endsWith('-p')) {
                    const cardId = id.replace('-p', '');
                    const pElement = document.querySelector(`#${cardId} p:not(.status-online, .status-offline)`);
                    if (pElement) pElement.textContent = value;
                } else if (id.endsWith('-btn') || id === 'btn-order') { 
                    const cardId = id.replace('-btn', '');
                    let btnElement;
                    if (id === 'btn-order') {
                        btnElement = document.querySelector('.add-to-cart [data-key="btn-order"]');
                    } else {
                        btnElement = document.querySelector(`#${cardId} .btn-primary, #${cardId} .btn-secondary, #${cardId} button`);
                    }
                    if (btnElement) btnElement.textContent = value;
                } else if (id.includes('placeholder')) {
                    const inputId = id.replace('-placeholder', '');
                    const inputElement = document.getElementById(inputId);
                    if (inputElement) {
                         inputElement.setAttribute('placeholder', value);
                    }
                }
            }
        }
        
        document.documentElement.lang = langCode;
        localStorage.setItem('paulyon-lang', langCode);
    }
    
    // C. Initialisation de la langue
    const savedLang = localStorage.getItem('paulyon-lang') || 'fr';
    setLanguage(savedLang);


    // D. Gérer les Clics sur les Options de Langue
    langOptions.forEach(option => {
        option.addEventListener('click', (event) => {
            event.preventDefault();
            
            const newLang = event.target.getAttribute('data-lang');
            
            if (newLang) {
                setLanguage(newLang); 
            }
        });
    });
    
    // ==========================================================
    // 8. LOGIQUE DU PANIER ET COMMANDE WHATSAPP 
    // ==========================================================
    
    function redirectToWhatsAppOrder() {
        if (cart.length === 0) {
            alert("Votre panier est vide. Veuillez ajouter des articles.");
            return;
        }

        let message = "Bonjour PAULYON, je souhaite commander les articles suivants :\n\n";
        let total = 0;
        const currentCurrency = 'HTG'; 
        const currentLang = localStorage.getItem('paulyon-lang') || 'fr';

        cart.forEach((item, index) => {
            message += `${index + 1}. ${item.name} (${item.price} ${currentCurrency})\n`;
            total += parseFloat(item.price);
        });

        message += `\nTotal de la commande : ${total.toFixed(2)} ${currentCurrency}`;
        
        const thankYouMessages = {
            'fr': "Veuillez m'indiquer la disponibilité et les modalités de paiement. Merci!",
            'en': "Please let me know the availability and payment options. Thank you!",
            'ht': "Silvouplè, fè m konnen disponiblite ak opsyon peman yo. Mèsi!",
        };

        message += "\n\n" + (thankYouMessages[currentLang] || thankYouMessages['fr']);
        
        cart.length = 0;

        const encodedMessage = encodeURIComponent(message);
        const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        window.open(whatsappLink, '_blank');
    }

    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const itemElement = event.target.closest('.product-item');
            if (!itemElement) return;

            const name = itemElement.querySelector('.product-name').textContent.trim();
            const price = itemElement.getAttribute('data-price');

            cart.push({ name, price });
            
            alert(`${name} a été ajouté à votre commande ! Vous serez redirigé vers WhatsApp pour finaliser.`);
            
            redirectToWhatsAppOrder();
        });
    });

}); // FIN de DOMContentLoaded

