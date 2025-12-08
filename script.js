// AJOUT : Classe pour gérer les transitions CSS après le chargement
document.body.classList.add('preload');

// ==========================================================
// [FONCTION ASYNCHRONE] Charge et retourne le contenu des fichiers JSON
// ==========================================================
async function loadSiteData() {
    try {
        const [dataResponse, translationResponse] = await Promise.all([
            fetch('data.json'),
            fetch('traduction.json')
        ]);

        if (!dataResponse.ok) throw new Error(`Erreur HTTP pour data.json: ${dataResponse.status}`);
        if (!translationResponse.ok) throw new Error(`Erreur HTTP pour traduction.json: ${translationResponse.status}`);

        const siteData = await dataResponse.json();
        const translations = await translationResponse.json();

        return { siteData, translations };
    } catch (error) {
        console.error("Erreur lors du chargement des fichiers JSON:", error);
        // Retourne un objet par défaut pour éviter les erreurs
        return { 
            siteData: { generalSettings: {}, products: [], services: [], languages: [] },
            translations: { 'fr': {} } 
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
    // 1. SÉLECTION DES ÉLÉMENTS (CONSOLIDÉ ET ÉTENDU)
    // ==========================================================
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = mainNav ? mainNav.querySelectorAll('a') : [];

    // Nouveaux Menus Déroulants (Produits & Services)
    const productsToggle = document.getElementById('nav-produits');
    const productsDropdown = productsToggle ? productsToggle.closest('#products-dropdown') : null;
    const servicesToggle = document.getElementById('nav-services');
    const servicesDropdown = servicesToggle ? servicesToggle.closest('#services-dropdown') : null;

    // Menus Déroulants existants (Paramètres & Langue)
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
        // Fermeture de TOUS les sous-menus
        if (settingsMenu) settingsMenu.classList.remove('show');
        if (languageDropdown) languageDropdown.classList.remove('show');
        if (productsDropdown) productsDropdown.classList.remove('show');
        if (servicesDropdown) servicesDropdown.classList.remove('show');
        
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
                 closeAllMenus(); // Utilise la fonction générale
            }
        });
    }
    
    // ==========================================================
    // 3. FERMER LE MENU APRÈS AVOIR CLIQUÉ SUR UN LIEN PRINCIPAL
    // ==========================================================
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            // Ferme tout si on clique sur un lien qui ne fait pas partie d'un dropdown
            if (!link.closest('.dropdown') && link.getAttribute('href').startsWith('#')) {
                closeAllMenus();
            }
            navLinks.forEach(l => l.removeAttribute('aria-current'));
            link.setAttribute('aria-current', 'page');
        });
    });

    // ==========================================================
    // 4. GESTION DES SOUS-MENUS PRODUITS, SERVICES, PARAMÈTRES ET LANGUE
    // ==========================================================
    
    // Fonction utilitaire pour gérer l'ouverture/fermeture d'un menu déroulant
    function handleDropdownToggle(toggleElement, dropdownElement) {
        if (!toggleElement || !dropdownElement) return;

        toggleElement.addEventListener('click', (event) => {
            event.preventDefault(); 
            event.stopPropagation();
            
            // Ferme tous les AUTRES menus déroulants
            [productsDropdown, servicesDropdown, settingsMenu, languageDropdown].forEach(d => {
                if (d && d !== dropdownElement) {
                    d.classList.remove('show');
                }
            });
            
            // Ouvre ou ferme le menu actuel
            dropdownElement.classList.toggle('show');
        });
    }

    // Application aux 4 menus déroulants
    handleDropdownToggle(productsToggle, productsDropdown);
    handleDropdownToggle(servicesToggle, servicesDropdown);
    handleDropdownToggle(settingsToggle, settingsMenu);
    handleDropdownToggle(languageToggle, languageDropdown);
    
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
                // Ferme le menu principal s'il est ouvert
                if (mainNav && mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    menuToggle.textContent = '☰';
                }
                // Ferme tous les dropdowns
                if (productsDropdown) productsDropdown.classList.remove('show');
                if (servicesDropdown) servicesDropdown.classList.remove('show');
                if (settingsMenu) settingsMenu.classList.remove('show');
                if (languageDropdown) languageDropdown.classList.remove('show');
            } else {
                searchInput.value = ''; 
            }
        });
    }
    
    // ==========================================================
    // 6. FERMER LES MENUS SI L'UTILISATEUR CLIQUE EN DEHORS
    // ==========================================================
    document.addEventListener('click', (event) => {
        const isOutsideNav = mainNav && !mainNav.contains(event.target) && menuToggle && !menuToggle.contains(event.target);
        const isOutsideSearch = searchContainer && !searchContainer.contains(event.target) && searchToggleBtn && !searchToggleBtn.contains(event.target);
        
        if (isOutsideNav && isOutsideSearch) {
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
    const { siteData, translations } = await loadSiteData();
    
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
    const savedLang = localStorage.getItem('paulyon-lang') || 'fr';

    // ==========================================================
    // A. Fonction de Traduction Principale (Adaptée pour le JSON)
    // ==========================================================
    function setLanguage(langCode) {
        const currentTranslation = translations[langCode];
        if (!currentTranslation) return;
        
        // 1. Traduction des éléments statiques par ID et cas spéciaux
        for (const id in currentTranslation) {
            const element = document.getElementById(id);
            const value = currentTranslation[id];
            
            if (element) {
                if (id === 'title-tag') {
                    document.title = siteName + ' | ' + value; 
                } else if (id.endsWith('-placeholder')) {
                    const inputElement = document.getElementById(id.replace('-placeholder', ''));
                    if (inputElement) inputElement.setAttribute('placeholder', value);

                } else if (id === 'p-contact-email') {
                    const html = value.replace('[EMAIL]', `<a href="mailto:${emailContact}">${emailContact}</a>`);
                    element.innerHTML = html;
                } else if (id === 'p-contact-whatsapp') {
                    const whatsappLink = `<a href="https://wa.me/${whatsappNumber}">${currentTranslation['nav-contact']}</a>`;
                    const html = value.replace('[WHATSAPP]', whatsappLink);
                    element.innerHTML = html;
                } else if (id === 'footer-copyright') {
                    const html = value.replace('[YEAR]', copyrightYear).replace('[SITE_NAME]', siteName);
                    element.innerHTML = html;
                } else if (id === 'footer-address') {
                    const html = value.replace('[ADDRESS]', address);
                    element.innerHTML = html;
                } else {
                    element.textContent = value;
                }
            } 
        }

        // 2. Traduction des boutons générés dynamiquement
        document.querySelectorAll('[data-key="btn-order"]').forEach(btn => {
            btn.textContent = currentTranslation['btn-order'] || 'Commander';
        });
        document.querySelectorAll('[data-key="btn-quote"]').forEach(btn => {
            btn.textContent = currentTranslation['btn-quote'] || 'Demander un devis';
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
        const currentLang = localStorage.getItem('paulyon-lang') || 'fr';
        const t = translations[currentLang];
        
        if (cart.length === 0) {
            alert(t['alert-cart-empty'] || "Votre panier est vide. Veuillez ajouter des articles.");
            return;
        }

        let message = t['whatsapp-msg-intro'] || "Bonjour PAULYON, je souhaite commander les articles suivants :\n\n";
        let total = 0;

        cart.forEach((item, index) => {
            message += `${index + 1}. ${item.name} (${item.price} ${currentCurrency})\n`;
            total += parseFloat(item.price);
        });

        message += `${t['whatsapp-msg-total'] || '\nTotal de la commande : '}${total.toFixed(2)} ${currentCurrency}`;
        message += "\n\n" + (t['whatsapp-msg-thanks'] || "Veuillez m'indiquer la disponibilité et les modalités de paiement. Merci!");
        
        // Vider le panier après la commande
        cart.length = 0; 

        const encodedMessage = encodeURIComponent(message);
        const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        window.open(whatsappLink, '_blank');
    }
    
    // Fonction de gestion de l'ajout au panier (attachée aux boutons)
    function handleAddToCart(event) {
        const currentLang = localStorage.getItem('paulyon-lang') || 'fr';
        const t = translations[currentLang];
        
        const itemElement = event.target.closest('.product-item');
        if (!itemElement) return;

        const name = itemElement.querySelector('.product-name').textContent.trim();
        const price = itemElement.getAttribute('data-price');

        cart.push({ name, price });
        
        alert(`${name}${t['alert-cart-add'] || " a été ajouté à votre commande ! Vous serez redirigé vers WhatsApp pour finaliser."}`);
        
        redirectToWhatsAppOrder();
    }
    
    // Fonction utilitaire pour attacher les écouteurs sur les boutons 'Commander'
    function attachCartListeners() {
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.removeEventListener('click', handleAddToCart); 
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

        attachCartListeners();
    }

    // Fonction d'affichage des services (pour services.html)
    function displayServices(services) {
        const servicesContainer = document.getElementById('services-list-container');
        if (!servicesContainer) return;

        services.forEach(service => {
            const statusKey = service.status === 'online' ? 'status-available' : 'status-unavailable';
            const statusClass = service.status === 'online' ? 'status-online' : 'status-offline';
            
            const serviceHTML = `
                <div class="data-card service-card" data-price="${service.price}" data-id="${service.id}">
                    <i class="${service.iconClass} icon-feature ${service.colorClass}"></i>
                    <h3>${service.title}</h3>
                    <p>${service.details}</p>
                    <p class="${statusClass}" data-translate-key="${statusKey}">Disponible</p> 
                    <div class="data-value">${service.price} ${currentCurrency}</div>
                    <a href="contact.html" class="btn-secondary" data-key="btn-quote">Demander un devis</a>
                </div>
            `;
            servicesContainer.insertAdjacentHTML('beforeend', serviceHTML);
        });
    }
    
    // ==========================================================
    // DÉCLENCHEMENT DE L'AFFICHAGE DYNAMIQUE ET DE LA TRADUCTION
    // ==========================================================
    
    // 1. Déclenche l'initialisation des gestionnaires de menus (y compris Produits/Services)
    initMenuHandlers();

    // 2. Génère le menu de langue
    if (siteData.languages) {
        generateLanguageMenu(siteData.languages);
    } else if (translations) {
        // Fallback: générer la liste des langues à partir des clés du fichier de traduction
        const languages = Object.keys(translations).map(code => ({ code, name: translations[code]['nav-language-toggle'] || code.toUpperCase() }));
        generateLanguageMenu(languages);
    }
    
    // 3. Affiche les produits si nous sommes sur la bonne page
    if (siteData.products.length > 0 && document.body.id === 'products-page') { 
        displayProducts(siteData.products);
    }

    // 4. Affiche les services si nous sommes sur la bonne page
    if (siteData.services.length > 0 && document.body.id === 'services-page') { 
        displayServices(siteData.services);
    }
    
    // 5. Applique la langue sauvegardée à tous les éléments
    setLanguage(savedLang);

}); // FIN de DOMContentLoaded
