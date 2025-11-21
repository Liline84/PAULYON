// AJOUT : Classe pour gérer les transitions CSS après le chargement
// Ceci évite les animations indésirables au chargement initial de la page.
document.body.classList.add('preload');

document.addEventListener('DOMContentLoaded', () => {

    // Retirer la classe de préchargement pour activer les transitions CSS
    setTimeout(() => {
        document.body.classList.remove('preload');
    }, 100); 

    // ==========================================================
    // 1. SÉLECTION DES ÉLÉMENTS (CONSOLIDÉ)
    // ==========================================================
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = mainNav ? mainNav.querySelectorAll('a') : [];

    // Menus Déroulants
    const settingsToggle = document.getElementById('nav-settings');
    const languageToggle = document.getElementById('nav-language-toggle');
    // Référence au <li> parent contenant la classe 'show'
    const settingsMenu = settingsToggle ? settingsToggle.closest('.dropdown') : null; 
    const languageDropdown = languageToggle ? languageToggle.closest('.dropdown-language') : null; 

    const langOptions = document.querySelectorAll('.lang-option');
    
    // Éléments pour la Recherche
    const searchToggleBtn = document.getElementById('search-toggle-btn');
    const searchContainer = document.getElementById('search-container');
    const searchInput = document.getElementById('search-input');
    
    // Éléments pour les produits/WhatsApp (NOUVEAU)
    const whatsappNumber = '50941172815'; 
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cart = []; // Panier vide


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
    // 2. GESTION DU MENU HAMBURGER (MOBILE)
    // *C'est la section qui ouvre/ferme votre menu principal*
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
    // (Conserve la logique pour les ancres si vous êtes sur index.html)
    // ==========================================================
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            // Si le lien mène à une autre page, le navigateur gère la fermeture.
            // Si le lien est une ancre ou un lien dans un menu déroulant, on ferme.
            if (!link.closest('.dropdown') && link.getAttribute('href').startsWith('#')) {
                closeAllMenus();
            }
            // Mettre à jour l'état actif (utile pour l'accessibilité)
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
    // 5. GESTION DU BOUTON DE RECHERCHE (NOUVEAU)
    // ==========================================================
    if (searchToggleBtn && searchContainer && searchInput) {
        searchToggleBtn.addEventListener('click', function() {
            searchContainer.classList.toggle('active');
            
            const isExpanded = searchContainer.classList.contains('active');
            searchToggleBtn.setAttribute('aria-expanded', isExpanded);

            if (isExpanded) {
                searchInput.focus();
                // Ferme le menu principal si la recherche s'ouvre
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


    // ==========================================================
    // 7. LOGIQUE DE TRADUCTION (Dictionnaire mis à jour)
    // ==========================================================
    
    // A. Le Dictionnaire de Traduction (AJOUT de 'btn-order')
    const translations = {
        'fr': {
            // ... (translations existantes)
            'nav-accueil': 'Accueil',
            'nav-produits': 'Produits',
            // ...
            'prod-electronique-btn': 'Voir la sélection',
            'btn-order': 'Commander', // NOUVEAU pour le bouton WhatsApp
            // ... (autres services et contacts)
        },
        'en': {
             // ... (translations existantes)
             'nav-accueil': 'Home',
             'nav-produits': 'Products',
             // ...
             'prod-electronique-btn': 'View Selection',
             'btn-order': 'Order', // NOUVEAU
             // ...
        },
        'ht': {
            // ... (translations existantes)
            'nav-accueil': 'Lakay',
            'nav-produits': 'Pwodwi',
            // ...
            'prod-electronique-btn': 'Gade seleksyon an',
            'btn-order': 'Kòmande', // NOUVEAU
            // ...
        }
        // NOTE: Ajoutez 'es' ici si l'Espagnol est nécessaire
    };


    // B. Fonction de Traduction Principale (Inchangée)
    function setLanguage(langCode) {
        const currentTranslation = translations[langCode];
        if (!currentTranslation) return;

        // 1. Traduction des éléments par ID et cas spéciaux
        for (const id in currentTranslation) {
            const element = document.getElementById(id);
            const value = currentTranslation[id];
            
            if (element) {
                // ... (Logique de traduction standard inchangée)
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
                // ... (Logique de traduction pour les cartes inchangée)
                if (id.endsWith('-title')) {
                    const cardId = id.replace('-title', '');
                    const titleElement = document.querySelector(`#${cardId} h3`);
                    if (titleElement) titleElement.textContent = value;
                } else if (id.endsWith('-p')) {
                    const cardId = id.replace('-p', '');
                    const pElement = document.querySelector(`#${cardId} p:not(.status-online, .status-offline)`);
                    if (pElement) pElement.textContent = value;
                } else if (id.endsWith('-btn') || id === 'btn-order') { // INCLURE 'btn-order'
                    const cardId = id.replace('-btn', '');
                    // Cibler les boutons dans les cartes ET les boutons de commande WhatsApp
                    let btnElement;
                    if (id === 'btn-order') {
                        // Cibler spécifiquement les <span> à l'intérieur des boutons .add-to-cart
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
                
                if (settingsMenu) settingsMenu.classList.remove('show');
                if (languageDropdown) languageDropdown.classList.remove('show');
            }
        });
    });
    
    // ==========================================================
    // 8. LOGIQUE DU PANIER ET COMMANDE WHATSAPP (NOUVEAU)
    // ==========================================================
    
    // Fonction pour générer le lien WhatsApp avec les détails de la commande
    function redirectToWhatsAppOrder() {
        if (cart.length === 0) {
            alert("Votre panier est vide. Veuillez ajouter des articles.");
            return;
        }

        let message = "Bonjour PAULYON, je souhaite commander les articles suivants :\n\n";
        let total = 0;
        const currentCurrency = 'HTG'; 
        const currentLang = localStorage.getItem('paulyon-lang') || 'fr';

        // Construire la liste des articles et calculer le total
        cart.forEach((item, index) => {
            message += `${index + 1}. ${item.name} (${item.price} ${currentCurrency})\n`;
            total += parseFloat(item.price);
        });

        // Ajouter le total
        message += `\nTotal de la commande : ${total.toFixed(2)} ${currentCurrency}`;
        
        // Ajouter un message de clôture traduit
        const thankYouMessages = {
            'fr': "Veuillez m'indiquer la disponibilité et les modalités de paiement. Merci!",
            'en': "Please let me know the availability and payment options. Thank you!",
            'ht': "Silvouplè, fè m konnen disponiblite ak opsyon peman yo. Mèsi!",
            // Ajoutez l'espagnol si nécessaire
        };

        message += "\n\n" + (thankYouMessages[currentLang] || thankYouMessages['fr']);
        
        // Vider le panier après la génération du message
        cart.length = 0;

        // Encoder le message et créer le lien
        const encodedMessage = encodeURIComponent(message);
        const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        // Rediriger l'utilisateur
        window.open(whatsappLink, '_blank');
    }

    // Écoute des clics sur les boutons 'Commander'
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const itemElement = event.target.closest('.product-item');
            if (!itemElement) return;

            // Récupère les données du produit à partir des attributs data-
            const name = itemElement.querySelector('.product-name').textContent.trim();
            // Utiliser data-price qui doit être un nombre simple
            const price = itemElement.getAttribute('data-price');

            // Ajout de l'article au panier
            cart.push({ name, price });
            
            alert(`${name} a été ajouté à votre commande ! Vous serez redirigé vers WhatsApp pour finaliser.`);
            
            redirectToWhatsAppOrder();
        });
    });

});
