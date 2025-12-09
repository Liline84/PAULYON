// =======================================================
// SCRIPT.JS OPTIMISÉ (V2.0) - FIX CRITIQUES & PERF
// =======================================================

document.addEventListener("DOMContentLoaded", () => {
    
    // ==============================
    // 1. SÉLECTEURS ET VARIABLES GLOBALES
    // ==============================
    const DOMElements = {
        nav: document.getElementById("main-nav"),
        menuToggle: document.querySelector(".menu-toggle"),
        searchToggleBtn: document.getElementById("search-toggle-btn"),
        searchContainer: document.getElementById("search-container"),
        searchInput: document.getElementById("search-input"),
        productDropdownContent: document.querySelector('.dropdown-products .dropdown-content'),
        languageDropdownContent: document.querySelector('.dropdown-language .dropdown-content'),
        productCardsContainer: document.querySelector('#products-section .cards-container'),
        serviceCardsContainer: document.querySelector('#services-section .cards-container'),
        dropdowns: document.querySelectorAll(".dropdown"),
        cartZone: document.getElementById("cart-zone"), // Supposant que vous avez une zone d'affichage du panier
        htmlElement: document.documentElement // <html> tag for language setting
    };

    let translations = {};
    let dataConfig = {};
    let currentLanguage = localStorage.getItem('lang') || "fr";
    let cart = [];

    // ==============================
    // 2. BACKDROP ET FOUC (Flash of Unstyled Content)
    // ==============================
    // Ajout de la classe 'preload' pour désactiver les transitions au démarrage
    document.body.classList.add('preload');
    
    // Crée et gère le fond gris transparent pour le menu mobile (Backdrop)
    const backdrop = document.createElement("div");
    backdrop.classList.add("mobile-backdrop");
    document.body.appendChild(backdrop);
    
    const showBackdrop = () => backdrop.classList.add("visible");
    const hideBackdrop = () => backdrop.classList.remove("visible");


    // ==============================
    // 3. CHARGEMENT ASYNCHRONE DES DONNÉES
    // ==============================

    Promise.all([
        fetch("traduction.json").then(res => res.json()),
        fetch("data.json").then(res => res.json())
    ])
    .then(([translationData, configData]) => {
        translations = translationData;
        dataConfig = configData;

        // Initialisation complète après le chargement des données
        initializeDynamicContent();
        
        // Démarrage de la traduction par défaut & mise à jour de la balise <html>
        setLanguage(currentLanguage);

        // Retirer la classe 'preload' pour activer les transitions
        document.body.classList.remove('preload');
    })
    .catch(err => console.error("Erreur critique lors du chargement des fichiers JSON:", err));


    // ==============================
    // 4. FONCTIONS DE TRADUCTION ET DE GÉNÉRATION DYNAMIQUE
    // ==============================
    
    /**
     * Applique les traductions et initialise le contenu dynamique.
     */
    function initializeDynamicContent() {
        // Gérer les menus déroulants
        generateProductMenu();
        generateServiceMenu();
        generateLanguageMenu();
        // generateSocialLinks(); // Si nécessaire

        // Rendu des cartes (doit se faire avant la traduction)
        renderProductCards();
        renderServiceCards();

        // Délégation des événements (pour le Panier - Correction 5)
        attachProductCardListeners();
    }

    /**
     * Applique les traductions à tous les éléments marqués par data-i18n.
     */
    function setLanguage(lang) {
        currentLanguage = lang;
        localStorage.setItem('lang', lang);
        
        // Correction 6: Mise à jour de la balise <html>
        DOMElements.htmlElement.setAttribute('lang', lang); 

        const currentTrans = translations[lang] || translations["fr"];

        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (currentTrans[key]) {
                // Utilisation de innerHTML pour remplacer les placeholders
                let translatedText = currentTrans[key];
                
                // Remplacement des placeholders spécifiques
                translatedText = translatedText.replace('[YEAR]', dataConfig.generalSettings.year || new Date().getFullYear());
                translatedText = translatedText.replace('[SITE_NAME]', dataConfig.generalSettings.siteName || 'PAULYON');
                translatedText = translatedText.replace('[EMAIL]', dataConfig.generalSettings.email || 'contact.paulyon@gmail.com');
                translatedText = translatedText.replace('[WHATSAPP]', dataConfig.generalSettings.whatsappNumberFormatted || dataConfig.generalSettings.whatsappNumber);
                
                element.innerHTML = translatedText;
            }
        });
        
        // Mise à jour des placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (currentTrans[key]) {
                element.placeholder = currentTrans[key];
            }
        });

        renderCart(); // Assure la traduction du panier
    }
    
    /**
     * Génère la liste des produits dans le menu déroulant.
     */
    function generateProductMenu() {
        if (!DOMElements.productDropdownContent || !dataConfig.products) return;

        DOMElements.productDropdownContent.innerHTML = dataConfig.products.map(product => `
            <li><a href="#product-${product.id}" class="nav-link">${product.name}</a></li>
        `).join('');
    }
    
    /**
     * Génère la liste des services dans le menu déroulant.
     */
    function generateServiceMenu() {
        if (!DOMElements.serviceDropdownContent || !dataConfig.services) return;
        
        // Correction : On assume qu'il existe un sélecteur pour le menu service
        const serviceDropdownContent = document.querySelector('.dropdown-services .dropdown-content');
        if (!serviceDropdownContent) return;

        serviceDropdownContent.innerHTML = dataConfig.services.map(service => `
            <li><a href="#service-${service.id}" class="nav-link">${service.title}</a></li>
        `).join('');
    }

    /**
     * Génère le menu de sélection de langue.
     */
    function generateLanguageMenu() {
        if (!DOMElements.languageDropdownContent || !translations) return;

        const availableLangs = Object.keys(translations);

        DOMElements.languageDropdownContent.innerHTML = availableLangs.map(langCode => {
            // Afficher le nom de la langue dans sa propre langue si possible
            const langName = translations[langCode]['nav-language-toggle'] || langCode.toUpperCase();
            const isActive = langCode === currentLanguage ? ' active-lang' : '';
            return `<li><a href="#" data-lang="${langCode}" class="lang-switch${isActive}">${langName}</a></li>`;
        }).join('');
        
        // Attachement de l'événement de changement de langue
        DOMElements.languageDropdownContent.addEventListener('click', (e) => {
            if (e.target.classList.contains('lang-switch')) {
                e.preventDefault();
                setLanguage(e.target.getAttribute('data-lang'));
                closeAllMenus();
            }
        });
    }

    /**
     * Génère les cartes de Produits.
     */
    function renderProductCards() {
        const container = DOMElements.productCardsContainer;
        if (!container || !dataConfig.products) return;

        container.innerHTML = dataConfig.products.map(product => `
            <div class="card product-card" id="product-${product.id}">
                <div class="card-icon ${product.colorClass}">
                    <i class="${product.iconClass}"></i>
                </div>
                
                <img src="${product.imagePath}" alt="${product.name}" class="card-img" loading="lazy">
                
                <div class="card-body">
                    <h3>${product.name}</h3>
                    <p class="card-description">${product.description}</p>
                    
                    <div class="card-footer">
                        <span class="card-price">${product.price} ${dataConfig.generalSettings.currentCurrency}</span>
                        
                        <button class="btn btn-primary btn-add-cart"  
                                data-i18n="btn-order"
                                data-product-name="${product.name}"
                                data-product-price="${product.price}">
                            Commander
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    /**
     * Génère les cartes de Services.
     */
    function renderServiceCards() {
        const container = DOMElements.serviceCardsContainer;
        if (!container || !dataConfig.services) return;

        container.innerHTML = dataConfig.services.map(service => `
            <div class="card service-card ${service.status === 'online' ? 'status-online' : 'status-offline'}" id="service-${service.id}">
                <div class="card-icon ${service.colorClass}">
                    <i class="${service.iconClass}"></i>
                </div>
                
                <div class="card-body">
                    <h3>${service.title}</h3>
                    <p class="card-description">${service.details}</p>
                    
                    <div class="card-footer">
                        <span class="card-price">${service.price} ${dataConfig.generalSettings.currentCurrency}</span>
                        <span class="card-status status-dot" data-i18n="status-${service.status}">
                            ${service.status === 'online' ? 'En Ligne' : 'Hors Ligne'}
                        </span>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    // ==============================
    // 5. GESTION DES INTERACTIONS UTILISATEUR
    // ==============================

    /**
     * Gère la fermeture globale de tous les éléments superposés.
     * @param {HTMLElement} exception - Élément à ne pas fermer.
     */
    function closeAllMenus(exception = null) {
        // Fermeture des Dropdowns (sauf l'exception)
        DOMElements.dropdowns.forEach(d => {
            // Le parent de l'exception est la liste d'items (d.closest('.dropdown'))
            if (d !== exception) {
                 d.querySelector(".dropdown-content")?.classList.remove("show");
            }
        });
        
        // Fermeture du menu mobile
        DOMElements.nav?.classList.remove("active");
        DOMElements.menuToggle?.setAttribute("aria-expanded", "false");
        
        // Fermeture de la recherche
        DOMElements.searchContainer?.classList.remove("active");
        DOMElements.searchToggleBtn?.setAttribute("aria-expanded", "false");
        
        // Fermeture du backdrop
        hideBackdrop();
    }
    
    // 5A. MENU MOBILE
    DOMElements.menuToggle?.addEventListener("click", () => {
        const expanded = DOMElements.menuToggle.getAttribute("aria-expanded") === "true";
        DOMElements.menuToggle.setAttribute("aria-expanded", !expanded);
        DOMElements.nav?.classList.toggle("active");
        if (!expanded) showBackdrop(); else hideBackdrop();
    });

    backdrop.addEventListener("click", closeAllMenus);

    // 5B. DROPDOWNS (Logique simplifiée et stable - Fix 2 & 3)
    DOMElements.dropdowns.forEach(drop => {
        const toggle = drop.querySelector(".dropdown-toggle");
        const content = drop.querySelector(".dropdown-content");

        // GESTION DU CLIC (Mobile UNIQUEMENT)
        toggle?.addEventListener("click", e => {
            if (window.innerWidth > 900) return; // Désactivé en Desktop
            e.preventDefault();
            e.stopPropagation();
            
            const isVisible = content.classList.contains("show");
            
            // Ferme tous les autres menus (au niveau racine)
            closeAllMenus(drop); 
            
            if (!isVisible) {
                // Ouvre uniquement si c'était fermé
                content?.classList.add("show");
                toggle.setAttribute("aria-expanded", "true");
            }
        });

        // GESTION DU HOVER (Desktop UNIQUEMENT)
        drop.addEventListener("mouseenter", () => {
            if (window.innerWidth <= 900) return;
            content?.classList.add("show");
        });
        drop.addEventListener("mouseleave", () => {
            if (window.innerWidth <= 900) return;
            content?.classList.remove("show");
        });
    });

    document.addEventListener("click", e => {
        // Ferme tous les menus si le clic est en dehors du Header ou du Backdrop
        const clickOutsideHeader = !e.target.closest("header");
        const clickOutsideBackdrop = !e.target.closest(".mobile-backdrop");

        if (clickOutsideHeader && clickOutsideBackdrop) {
             closeAllMenus();
        } 
        
        // Assure que le clic sur un lien du menu mobile ferme le menu
        if (e.target.classList.contains('nav-link') && DOMElements.nav?.classList.contains('active')) {
             closeAllMenus();
        }
    });

    // 5C. BARRE DE RECHERCHE
    DOMElements.searchToggleBtn?.addEventListener("click", () => {
        const expanded = DOMElements.searchToggleBtn.getAttribute("aria-expanded") === "true";
        DOMElements.searchToggleBtn.setAttribute("aria-expanded", !expanded);
        DOMElements.searchContainer?.classList.toggle("active");
        
        if (!expanded) {
            DOMElements.searchInput?.focus();
        } else {
            DOMElements.searchInput.value = ''; // Optionnel: effacer la recherche en fermant
        }
    });

    // 5D. RESPONSIVE
    window.addEventListener("resize", () => {
        if (window.innerWidth > 900) {
            closeAllMenus(); // S'assurer que le menu mobile et le backdrop sont désactivés
        }
    });


    // ==============================
    // 6. LOGIQUE E-COMMERCE (PANIER + WHATSAPP) - Fix Critique 1 & Optimisation 5
    // ==============================
    
    /**
     * Délégation des événements pour les boutons "Commander" après le rendu des cartes.
     */
    function attachProductCardListeners() {
        DOMElements.productCardsContainer?.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-add-cart');
            if (btn) {
                const name = btn.getAttribute('data-product-name');
                const price = parseFloat(btn.getAttribute('data-product-price'));
                if (name && !isNaN(price)) {
                    window.addToCart(name, price);
                }
            }
        });
    }

    /**
     * Affiche le contenu actuel du panier.
     */
    function renderCart() {
        if (!DOMElements.cartZone) return;
        
        const currentTranslation = translations[currentLanguage] || translations["fr"];
        const currency = dataConfig.generalSettings.currentCurrency || '';

        if (cart.length === 0) {
            DOMElements.cartZone.innerHTML = `<p>${currentTranslation["alert-cart-empty"] || "Votre panier est vide."}</p>`;
            return;
        }

        // Affichage des articles groupés (ou listés, selon le besoin)
        DOMElements.cartZone.innerHTML = cart
            .map(item => `<p>${item.name} — ${item.price} ${currency}</p>`)
            .join("");
    }
    
    // Fonction globale pour ajouter au panier
    window.addToCart = function(name, price) {
        cart.push({ name, price });
        const currentTranslation = translations[currentLanguage] || translations["fr"];
        
        // Affichage d'une alerte moins intrusive ou d'un toast pour une meilleure UX
        console.log(`${name} ${currentTranslation["alert-cart-add"] || "a été ajouté au panier !"}`);
        // Remplacez alert par un système de notification (ex: Toasts) pour une meilleure UX
        
        renderCart();
        // Optionnel : rediriger immédiatement vers la commande
        // window.orderWhatsApp(); 
    }

    // Fonction globale pour commander via WhatsApp
    window.orderWhatsApp = function() {
        const currentTranslation = translations[currentLanguage] || translations["fr"];
        const currency = dataConfig.generalSettings.currentCurrency;
        const whatsappNumber = dataConfig.generalSettings.whatsappNumber;

        if (cart.length === 0) return alert(currentTranslation["alert-cart-empty"]);

        const items = cart.map(i => `${i.name} — ${i.price} ${currency}`).join("\n");
        const totalAmount = cart.reduce((sum, i) => sum + i.price, 0);

        const message = (currentTranslation["whatsapp-msg-intro"] || "Bonjour, je souhaite commander :\n") +
                            items +
                            "\n" +
                            (currentTranslation["whatsapp-msg-total"] || "Total : ") +
                            totalAmount.toFixed(2) + " " + currency +
                            "\n" +
                            (currentTranslation["whatsapp-msg-thanks"] || "Merci !");
        
        const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        const windowRef = window.open(url, "_blank", "noopener,noreferrer");

        // CORRECTION CRITIQUE 1: Vider le panier SEULEMENT si l'ouverture réussit
        if (windowRef) {
            cart.length = 0; 
            renderCart(); // Mettre à jour l'affichage
        } else {
             // Fallback si la pop-up est bloquée
             alert("Veuillez autoriser les pop-ups pour finaliser la commande via WhatsApp.");
        }
    }
});
