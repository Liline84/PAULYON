// =======================================================
// SCRIPT.JS OPTIMISÉ - GESTION COMPLÈTE DU FRONT-END
// Intègre data.json et traduction.json
// =======================================================

document.addEventListener("DOMContentLoaded", () => {
    
    // ==============================
    // 1. SÉLECTEURS ET VARIABLES GLOBALES
    // ==============================
    const nav = document.getElementById("main-nav");
    const menuToggle = document.querySelector(".menu-toggle");
    const searchToggleBtn = document.getElementById("search-toggle-btn");
    const searchContainer = document.getElementById("search-container");
    const searchInput = document.getElementById("search-input");
    const productDropdownContent = document.querySelector('.dropdown-products .dropdown-content');
    const languageDropdownContent = document.querySelector('.dropdown-language .dropdown-content');
    const dropdowns = document.querySelectorAll(".dropdown");
    const body = document.body;

    let translations = {};
    let dataConfig = {}; // Contient le contenu de data.json
    let currentLanguage = "fr";
    let cart = []; // Panier pour l'e-commerce

    // ==============================
    // 2. BACKDROP ET INITIALISATION DU CHARGEMENT
    // ==============================
    
    // Ajoutez la classe 'preload' pour désactiver les transitions au démarrage (voir CSS)
    body.classList.add('preload');
    
    // Crée le fond gris transparent pour le menu mobile
    function createBackdrop() {
        const b = document.createElement("div");
        b.classList.add("mobile-backdrop");
        body.appendChild(b);
        return b;
    }
    const backdrop = createBackdrop();

    function showBackdrop() { backdrop.classList.add("visible"); }
    function hideBackdrop() { backdrop.classList.remove("visible"); }

    // ==============================
    // 3. CHARGEMENT ASYNCHRONE DES DONNÉES
    // ==============================

    Promise.all([
        fetch("traduction.json").then(res => res.json()),
        fetch("data.json").then(res => res.json()) // Chargement du fichier data.json
    ])
    .then(([translationData, configData]) => {
        translations = translationData;
        dataConfig = configData;

        // 3A. Initialisation des composants après chargement
        initializeDynamicContent(); 

        // 3B. Démarrage de la traduction par défaut
        setLanguage(currentLanguage);
        
        // Retirer la classe 'preload' pour activer les transitions après le chargement
        body.classList.remove('preload');
    })
    .catch(err => console.error("Erreur critique lors du chargement des fichiers JSON:", err));


    // ...
// ==============================
// 4. FONCTIONS DE TRADUCTION ET DE GÉNÉRATION DYNAMIQUE
// ==============================
    
function initializeDynamicContent() {
    // Gérer les menus déroulants et les liens du footer
    generateProductMenu();
    generateServiceMenu(); // L'appel est ici
    generateLanguageMenu();
    generateSocialLinks();
}
    
// Gère l'injection des chaînes de traduction et le remplacement des placeholders
function setLanguage(lang) { /* ... */ }

// Génère la liste des produits dans le menu
function generateProductMenu() { 
    const productDropdownContent = document.getElementById('products-menu-content');
    if (!productDropdownContent) return;

    productDropdownContent.innerHTML = dataConfig.products.map(product => `
        <li><a href="/products/${product.id}">${product.name}</a></li>
    `).join('');
}

// Fonction de génération des services (À placer ici)
function generateServiceMenu() {
    const serviceDropdownContent = document.getElementById('services-menu-content');
    if (!serviceDropdownContent) return;

    serviceDropdownContent.innerHTML = dataConfig.services.map(service => `
        <li><a href="/services/${service.id}">${service.title}</a></li>
    `).join('');
}

// Génère la liste des langues dans le menu
function generateLanguageMenu() { /* ... */ }

// Génère les liens sociaux dans le footer
function generateSocialLinks() { /* ... */ }

// ... (Reste du script)    // Ici, vous pouvez ajouter la fonction de rendu des cartes Produits/Services si nécessaire
    }
    
    // Gère l'injection des chaînes de traduction et le remplacement des placeholders
    function setLanguage(lang) {
        currentLanguage = lang;
        const general = dataConfig.generalSettings;
        const currentTranslation = translations[lang] || translations["fr"];

        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.getAttribute("data-i18n");
            let text = currentTranslation[key] || "";
            
            // Remplacement des placeholders globaux dans la chaîne
            if (text) {
                text = text
                    .replace(/\[EMAIL\]/g, `<a href="mailto:${general.emailContact}">${general.emailContact}</a>`)
                    .replace(/\[WHATSAPP\]/g, `<a href="https://wa.me/${general.whatsappNumber}" target="_blank">+${general.whatsappNumber}</a>`)
                    .replace(/\[YEAR\]/g, general.copyrightYear)
                    .replace(/\[SITE_NAME\]/g, general.siteName)
                    .replace(/\[ADDRESS\]/g, general.address);
                el.innerHTML = text;
            }
        });

        document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
            const key = el.getAttribute("data-i18n-placeholder");
            if(currentTranslation[key]) el.placeholder = currentTranslation[key];
        });

        renderCart(); 
    }
    
    // Génère la liste des produits dans le menu
    function generateProductMenu() {
        if (!productDropdownContent) return;

        productDropdownContent.innerHTML = dataConfig.products.map(product => `
            <li><a href="/products/${product.id}">${product.name}</a></li>
        `).join('');
    }
    
    // Génère la liste des langues dans le menu
    function generateLanguageMenu() {
        if (!languageDropdownContent) return;

        languageDropdownContent.innerHTML = dataConfig.languages.map(lang => `
            <li><a href="#" data-lang="${lang.code}">${lang.name}</a></li>
        `).join('');

        // Attache l'écouteur d'événements à la liste générée
        languageDropdownContent.addEventListener("click", e => {
            if (e.target.tagName.toLowerCase() === "a" && e.target.hasAttribute("data-lang")) {
                e.preventDefault();
                const langCode = e.target.getAttribute("data-lang");
                setLanguage(langCode);
                closeAllMenus();
            }
        });
    }

    // Génère les liens sociaux dans le footer (nécessite que le conteneur soit dans le HTML)
    function generateSocialLinks() {
        const socialContainer = document.querySelector('.footer-social .social-icons');
        if (!socialContainer) return;

        socialContainer.innerHTML = dataConfig.socialLinks.map(link => `
            <a href="${link.url}" target="_blank" title="${link.platform}">
                <i class="${link.iconClass}"></i>
            </a>
        `).join('');
    }


    // ==============================
    // 5. GESTION DES INTERACTIONS UTILISATEUR
    // ==============================

    // 5A. MENU MOBILE
    menuToggle?.addEventListener("click", () => {
        const expanded = menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute("aria-expanded", !expanded);
        nav?.classList.toggle("active");
        if (!expanded) showBackdrop(); else hideBackdrop();
    });

    backdrop.addEventListener("click", closeAllMenus);

    // 5B. DROPDOWNS (MOBILE & DESKTOP)
    dropdowns.forEach(drop => {
        const toggle = drop.querySelector(".dropdown-toggle");
        const content = drop.querySelector(".dropdown-content");

        // Mobile click (au-dessous de 900px)
        toggle?.addEventListener("click", e => {
            if (window.innerWidth > 900) return;
            e.preventDefault();
            e.stopPropagation();
            // Ferme tous les autres menus sauf celui-ci
            closeAllMenus(drop); 
            content?.classList.toggle("show");
        });

        // Desktop hover (au-dessus de 900px)
        drop.addEventListener("mouseenter", () => {
            if (window.innerWidth <= 900) return;
            content?.classList.add("show");
        });
        drop.addEventListener("mouseleave", () => {
            if (window.innerWidth <= 900) return;
            content?.classList.remove("show");
        });
    });

    function closeAllMenus(exception = null) {
        dropdowns.forEach(d => {
            if (d !== exception) d.querySelector(".dropdown-content")?.classList.remove("show");
        });
        nav?.classList.remove("active");
        menuToggle?.setAttribute("aria-expanded", "false");
        hideBackdrop();
        searchContainer?.classList.remove("active"); // Ferme la recherche aussi
        searchToggleBtn?.setAttribute("aria-expanded", "false");
    }

    document.addEventListener("click", e => {
        // Ferme tous les menus si le clic est en dehors du header
        if (!e.target.closest("header") && !e.target.closest(".mobile-backdrop")) closeAllMenus();
    });

    // 5C. BARRE DE RECHERCHE
    searchToggleBtn?.addEventListener("click", () => {
        const expanded = searchToggleBtn.getAttribute("aria-expanded") === "true";
        searchToggleBtn.setAttribute("aria-expanded", !expanded);
        searchContainer?.classList.toggle("active");
        if (!expanded) searchInput?.focus();
    });

    // 5D. RESPONSIVE (ferme tous les menus au redimensionnement si desktop)
    window.addEventListener("resize", () => {
        if (window.innerWidth > 900) hideBackdrop();
        closeAllMenus();
    });


    // ==============================
    // 6. LOGIQUE E-COMMERCE (PANIER + WHATSAPP)
    // ==============================
    
    function renderCart() {
        const zone = document.getElementById("cart-zone");
        if (!zone) return;
        
        const currentTranslation = translations[currentLanguage] || translations["fr"];
        const currency = dataConfig.generalSettings.currentCurrency;

        if (cart.length === 0) {
            zone.innerHTML = currentTranslation["alert-cart-empty"] || "Votre panier est vide.";
            return;
        }

        zone.innerHTML = cart
            .map(item => `<p>${item.name} — ${item.price} ${currency}</p>`)
            .join("");
    }

    window.addToCart = function(name, price) {
        cart.push({ name, price });
        const currentTranslation = translations[currentLanguage] || translations["fr"];
        alert(`${name} ${currentTranslation["alert-cart-add"] || "a été ajouté au panier !"}`);
        renderCart();
    }

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
                        totalAmount + " " + currency +
                        "\n" +
                        (currentTranslation["whatsapp-msg-thanks"] || "Merci !");
        
        const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    }

});
