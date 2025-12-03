// AJOUT : Classe pour gérer les transitions CSS après le chargement
document.body.classList.add('preload');

// ==========================================================
// [FONCTION ASYNCHRONE] Charge et retourne le contenu de data.json
// ==========================================================
async function loadSiteData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erreur lors du chargement de data.json:", error);
        // Retourne un objet par défaut pour éviter les erreurs
        return { 
            generalSettings: {}, 
            products: [], 
            services: [] 
        };
    }
}

// ==========================================================
// [FONCTION GLOBALE] Gère l'initialisation de tout le HEADER
// ==========================================================
function initMenuHandlers() {

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
    // 2. GESTION DU MENU HAMBURGER (MOBILE)
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
            
            if (settingsMenu.classList.contains('show') && languageDropdown) {
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
// [LOGIQUE PRINCIPALE] Exécutée au chargement du DOM
// ==========================================================
document.addEventListener('DOMContentLoaded', async () => { 

    // ==========================================================
    // 0. CHARGEMENT DES DONNÉES JSON
    // ==========================================================
    const siteData = await loadSiteData();
    
    // Récupération des paramètres généraux
    const generalSettings = siteData.generalSettings || {};
    const whatsappNumber = (generalSettings.whatsappNumber || '').replace('+', '');
    const currentCurrency = generalSettings.currentCurrency || 'HTG';
    const emailContact = generalSettings.emailContact || 'contact.paulyon@gmail.com';
    const address = generalSettings.address || 'Adresse inconnue';
    const copyrightYear = generalSettings.copyrightYear || 2025;
    const siteName = generalSettings.siteName || 'PAULYON';

    // Variables nécessaires
    const cart = []; 

    // ==========================================================
    // A. Le Dictionnaire de Traduction (Étendu)
    // ==========================================================
    const translations = {
        'fr': {
            'nav-accueil': 'Accueil',
            'nav-produits': 'Produits',
            'nav-services': 'Services',
            'nav-contact': 'Contact',
            'nav-settings': 'Paramètres',
            'nav-language-toggle': 'Langue',
            'search-input-placeholder': 'Rechercher...',
            'h1-accueil': 'Bienvenue chez PAULYON',
            'p-slogan': 'Nous transformons le néant en chef-d\'œuvre.',
            'h2-produits': 'Nos Produits',
            'h2-services': 'Nos Services',
            'h2-contact': 'Contactez-nous',
            'p-contact-email': `Envoyez-nous un message à <a href="mailto:${emailContact}">${emailContact}</a> !`,
            'p-contact-whatsapp': `Vous pouvez également nous contacter directement via <a href="https://wa.me/${whatsappNumber}">WhatsApp</a>.`,
            'input-name-placeholder': 'Nom',
            'input-email-placeholder': 'Email',
            'input-message-placeholder': 'Message',
            'btn-submit': 'Envoyer',
            'footer-copyright': `&copy; ${copyrightYear} ${siteName}. Tous droits réservés.`,
            'footer-address': `Adresse : ${address}`,
            'status-online': 'Disponible',
            'status-offline': 'Indisponible',
            'btn-order': 'Commander', 
            'btn-quote': 'Demander un devis',
        },
        'en': {
            'nav-accueil': 'Home',
            'nav-produits': 'Products',
            'nav-services': 'Services',
            'nav-contact': 'Contact',
            'nav-settings': 'Settings',
            'nav-language-toggle': 'Language',
            'search-input-placeholder': 'Search...',
            'h1-accueil': 'Welcome to PAULYON',
            'p-slogan': 'We transform nothingness into a masterpiece.',
            'h2-produits': 'Our Products',
            'h2-services': 'Our Services',
            'h2-contact': 'Contact Us',
            'p-contact-email': `Send us a message at <a href="mailto:${emailContact}">${emailContact}</a>!`,
            'p-contact-whatsapp': `You can also contact us directly via <a href="https://wa.me/${whatsappNumber}">WhatsApp</a>.`,
            'input-name-placeholder': 'Name',
            'input-email-placeholder': 'Email',
            'input-message-placeholder': 'Message',
            'btn-submit': 'Send',
            'footer-copyright': `&copy; ${copyrightYear} ${siteName}. All rights reserved.`,
            'footer-address': `Address: ${address}`,
            'status-online': 'Available',
            'status-offline': 'Unavailable',
            'btn-order': 'Order',
            'btn-quote': 'Request a quote',
        },
        'ht': {
            'nav-accueil': 'Lakay',
            'nav-produits': 'Pwodwi',
            'nav-services': 'Sèvis',
            'nav-contact': 'Kontakte',
            'nav-settings': 'Paramèt',
            'nav-language-toggle': 'Lang',
            'search-input-placeholder': 'Chèche...',
            'h1-accueil': 'Byenvini lakay PAULYON',
            'p-slogan': 'Nou transfòme anyen an yon chèfdèv.',
            'h2-produits': 'Pwodwi Nou Yo',
            'h2-services': 'Sèvis Nou Yo',
            'h2-contact': 'Kontakte Nou',
            'p-contact-email': `Voye yon mesaj pou nou nan <a href="mailto:${emailContact}">${emailContact}</a>!`,
            'p-contact-whatsapp': `Ou kapab kontakte nou dirèkteman sou <a href="https://wa.me/${whatsappNumber}">WhatsApp</a>.`,
            'input-name-placeholder': 'Non',
            'input-email-placeholder': 'Imèl',
            'input-message-placeholder': 'Mesaj',
            'btn-submit': 'Voye',
            'footer-copyright': `&copy; ${copyrightYear} ${siteName}. Tout dwa rezève.`,
            'footer-address': `Adrès: ${address}`,
            'status-online': 'Disponib',
            'status-offline': 'Pa disponib',
            'btn-order': 'Kòmande',
            'btn-quote': 'Mande yon deviz',
        },
        // Ajoutez 'es' ici si nécessaire
    };


    // B. Fonction de Traduction Principale (Adaptée pour le JSON)
    function setLanguage(langCode) {
        const currentTranslation = translations[langCode];
        if (!currentTranslation) return;
        
        // 1. Traduction des éléments statiques par ID et cas spéciaux
        for (const id in currentTranslation) {
            const element = document.getElementById(id);
            const value = currentTranslation[id];
            
            if (element) {
                if (id === 'title-tag') {
                    document.title = value;
                } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.setAttribute('placeholder', value);
                } else if (id.startsWith('p-contact') || id.startsWith('footer-')) {
                    element.innerHTML = value; // Utiliser innerHTML pour conserver les balises <a>
                } else {
                    element.textContent = value;
                }
            } 
        }

        // 2. Traduction des boutons générés dynamiquement (Products & Services)
        // Ceci cible les éléments créés par displayProducts/displayServices
        document.querySelectorAll('[data-key="btn-order"]').forEach(btn => {
            if (currentTranslation['btn-order']) {
                btn.textContent = currentTranslation['btn-order'];
            }
        });
        document.querySelectorAll('[data-key="btn-quote"]').forEach(btn => {
            if (currentTranslation['btn-quote']) {
                btn.textContent = currentTranslation['btn-quote'];
            }
        });
        
        // 3. Traduction des statuts (Disponible/Indisponible)
        document.querySelectorAll('[data-translate-key="status-available"]').forEach(p => {
             p.textContent = currentTranslation['status-online'] || 'Disponible';
        });
        document.querySelectorAll('[data-translate-key="status-unavailable"]').forEach(p => {
             p.textContent = currentTranslation['status-offline'] || 'Indisponible';
        });


        document.documentElement.lang = langCode;
        localStorage.setItem('paulyon-lang', langCode);
    }

    // C. Fonction pour générer la liste des langues dans le Header
    function generateLanguageMenu(languages) {
        const langContent = document.querySelector('.language-content');
        if (!langContent || languages.length === 0) return;

        langContent.innerHTML = ''; 

        languages.forEach(lang => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '#';
            a.setAttribute('data-lang', lang.code);
            a.classList.add('lang-option');
            a.textContent = lang.name;
            li.appendChild(a);
            langContent.appendChild(li);
        });

        // Réattacher les écouteurs aux nouvelles options
        document.querySelectorAll('.lang-option').forEach(option => {
            option.addEventListener('click', (event) => {
                event.preventDefault();
                const newLang = event.target.getAttribute('data-lang');
                if (newLang) {
                    setLanguage(newLang); 
                }
            });
        });
    }

    // ==========================================================
    // 7. FONCTIONS DE GESTION DU PANIER (FINALISÉ)
    // ==========================================================
    
    // Fonction utilitaire pour la redirection WhatsApp
    function redirectToWhatsAppOrder() {
        if (cart.length === 0) {
            alert(translations[localStorage.getItem('paulyon-lang') || 'fr']['cart-empty'] || "Votre panier est vide. Veuillez ajouter des articles.");
            return;
        }

        let message = "Bonjour PAULYON, je souhaite commander les articles suivants :\n\n";
        let total = 0;
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
        
        // Vider le panier après la commande
        cart.length = 0; 

        const encodedMessage = encodeURIComponent(message);
        const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        window.open(whatsappLink, '_blank');
    }
    
    // Fonction de gestion de l'ajout au panier (attachée aux boutons)
    function handleAddToCart(event) {
        // Cible le parent commun (.product-item)
        const itemElement = event.target.closest('.product-item');
        if (!itemElement) return;

        const name = itemElement.querySelector('.product-name').textContent.trim();
        const price = itemElement.getAttribute('data-price');

        cart.push({ name, price });
        
        // Alerte simple (vous pouvez remplacer par un toast ou une modale)
        alert(`${name} a été ajouté à votre commande ! Vous serez redirigé vers WhatsApp pour finaliser.`);
        
        redirectToWhatsAppOrder();
    }
    
    // Fonction utilitaire pour attacher les écouteurs sur les boutons 'Commander'
    function attachCartListeners() {
        // Cible tous les boutons qui ont la classe pour ajouter au panier
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.removeEventListener('click', handleAddToCart); // Empêche l'attachement multiple
            button.addEventListener('click', handleAddToCart);
        });
    }

    // ==========================================================
    // 8. AFFICHAGE DYNAMIQUE DU CONTENU (Produits/Services)
    // ==========================================================
    
    // Fonction d'affichage des produits (pour produits.html)
    function displayProducts(products) {
        const productsContainer = document.getElementById('products-list-container');
        if (!productsContainer) return;

        products.forEach(product => {
            const productHTML = `
                <div class="data-card product-card product-item" data-price="${product.price}" data-id="${product.id}">
                    <i class="${product.iconClass} icon-feature ${product.colorClass}"></i>
                    <h3 class="product-name">${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="data-value">${product.price} ${currentCurrency}</div>
                    <button class="add-to-cart btn-primary" data-key="btn-order">Commander</button>
                </div>
            `;
            productsContainer.insertAdjacentHTML('beforeend', productHTML);
        });

        // TRES IMPORTANT: Attacher les écouteurs aux nouveaux boutons créés
        attachCartListeners();
    }

    // Fonction d'affichage des services (pour services.html)
    function displayServices(services) {
        const servicesContainer = document.getElementById('services-list-container');
        if (!servicesContainer) return;

        services.forEach(service => {
            // Détermine la classe de statut (online/offline)
            const statusClass = service.status === 'online' ? 'status-online' : 'status-offline';
            const statusTextKey = service.status === 'online' ? 'status-available' : 'status-unavailable';
            
            const serviceHTML = `
                <div class="data-card service-card" data-price="${service.price}" data-id="${service.id}">
                    <i class="${service.iconClass} icon-feature ${service.colorClass}"></i>
                    <h3>${service.title}</h3>
                    <p>${service.details}</p>
                    <p class="${statusClass}" data-translate-key="${statusTextKey}">${service.status === 'online' ? 'Disponible' : 'Indisponible'}</p> 
                    <div class="data-value">${service.price}</div>
                    <a href="contact.html" class="btn-secondary" data-key="btn-quote">Demander un devis</a>
                </div>
            `;
            servicesContainer.insertAdjacentHTML('beforeend', serviceHTML);
        });
    }
    
    // ==========================================================
    // DÉCLENCHEMENT DE L'AFFICHAGE DYNAMIQUE
    // ==========================================================

    // 1. Génère le menu de langue
    if (siteData.languages) {
        generateLanguageMenu(siteData.languages);
    }
    
    // 2. Affiche les produits si nous sommes sur la bonne page
    if (siteData.products.length > 0 && document.body.id === 'products-page') { 
        displayProducts(siteData.products);
    }

    // 3. Affiche les services si nous sommes sur la bonne page
    if (siteData.services.length > 0 && document.body.id === 'services-page') { 
        displayServices(siteData.services);
    }
    
    // 4. Applique la langue sauvegardée à tous les éléments nouvellement créés
    setLanguage(savedLang);

}); // FIN de DOMContentLoaded
