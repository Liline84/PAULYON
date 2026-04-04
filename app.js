/**
 * ============================================================================
 * 📦 BLOC 1 : ÉTAT GLOBAL DE L'APPLICATION (STATE)
 * ============================================================================
 */
const state = {
    translations: {},
    dataConfig: {},
    currentLanguage: localStorage.getItem('lang') || "fr",
    cart: []
};

/**
 * ============================================================================
 * 🎨 BLOC 2 : INTERFACE UTILISATEUR ET NAVIGATION (UI)
 * ============================================================================
 */

// Gère l'ouverture et la fermeture du menu latéral
function toggleSidebar() {
    const nav = document.getElementById("main-nav");
    nav?.classList.toggle("active");
    
    // Gère les différents overlays (backdrop mobile ou overlay flou)
    document.querySelector(".mobile-backdrop")?.classList.toggle("visible");
    document.getElementById("overlay")?.classList.toggle("visible");
}

// Ferme tous les menus ouverts (utile pour les clics à l'extérieur)
function closeAllMenus() {
    document.getElementById("main-nav")?.classList.remove("active");
    document.querySelector(".mobile-backdrop")?.classList.remove("visible");
    document.querySelectorAll(".dropdown-content").forEach(d => d.classList.remove("show"));
}

// Attache les événements de clic pour la navigation
function attachNavigationListeners() {
    const menuToggle = document.querySelector(".menu-toggle");
    menuToggle?.addEventListener("click", toggleSidebar);
    
    document.querySelector(".mobile-backdrop")?.addEventListener("click", closeAllMenus);
}

/**
 * ============================================================================
 * ⚙️ BLOC 3 : PARAMÈTRES ET INTERNATIONALISATION (I18N)
 * ============================================================================
 */

// Applique les paramètres généraux du site (Titre, couleurs, etc.)
function applyGeneralSettings() {
    const settings = state.dataConfig.generalSettings;
    if (!settings) return;

    if (settings.siteName) {
        document.title = `${settings.siteName} - Lab Hub`;
    }
}

// Change la langue de l'application et met à jour le DOM
function setLanguage(lang) {
    state.currentLanguage = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.setAttribute('lang', lang); 

    const currentTrans = state.translations[lang] || state.translations["fr"];
    const settings = state.dataConfig.generalSettings;

    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (currentTrans[key]) {
            let text = currentTrans[key];
            
            // Remplacements dynamiques des variables
            text = text.replace('[YEAR]', settings?.copyrightYear || new Date().getFullYear())
                       .replace('[SITE_NAME]', settings?.siteName || 'PAULYON')
                       .replace('[EMAIL]', settings?.emailContact || 'contact@example.com');
            
            element.innerHTML = text;
        }
    });
}

/**
 * ============================================================================
 * 🛍️ BLOC 4 : RENDU DES PRODUITS ET SERVICES
 * ============================================================================
 */

// Génère et affiche les cartes de produits
function renderProductCards() {
    const container = document.querySelector('#products-section .cards-container');
    if (!container || !state.dataConfig.products) return;

    container.innerHTML = state.dataConfig.products.map(product => `
        <div class="data-card product-card">
            <i class="${product.iconClass} ${product.colorClass} icon"></i>
            <img src="${product.imagePath}" alt="${product.name}" style="width:100%; border-radius:8px; margin-bottom:15px;">
            <h3>${product.name}</h3>
            <span class="badge version-badge">${product.price || 'À confirmer'} ${state.dataConfig.generalSettings.currentCurrency}</span>
            <button class="btn btn-primary btn-add-cart" data-name="${product.name}" data-price="${product.price || 0}" style="margin-top:15px;">
                <i class="fa-solid fa-cart-plus"></i> Ajouter
            </button>
        </div>
    `).join('');
    
    // Attachement des events sur les nouveaux boutons (Optionnel mais recommandé ici)
    attachCartListeners(container);
}

// Génère et affiche les cartes de services
function renderServiceCards() {
    const container = document.querySelector('#services-section .cards-container');
    if (!container || !state.dataConfig.services) return;

    container.innerHTML = state.dataConfig.services.map(service => `
        <div class="data-card service-card">
            <i class="${service.iconClass} ${service.colorClass} icon" style="font-size: 2.5rem; margin-bottom:15px;"></i>
            <h3>${service.title}</h3>
            <p style="font-size: 0.9rem; margin-bottom:15px;">${service.details}</p>
            <span class="badge version-badge">${service.price} ${state.dataConfig.generalSettings.currentCurrency}</span>
            <button class="btn btn-primary btn-add-cart" data-name="${service.title}" data-price="${service.price}" style="margin-top:15px;">
                Réserver via WhatsApp
            </button>
        </div>
    `).join('');
    
    attachCartListeners(container);
}

/**
 * ============================================================================
 * 🛒 BLOC 5 : GESTION DU PANIER ET COMMANDES (CART)
 * ============================================================================
 */

// Fonction utilitaire pour attacher les clics d'ajout au panier
function attachCartListeners(container) {
    container.querySelectorAll('.btn-add-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const name = e.target.closest('button').dataset.name;
            const price = e.target.closest('button').dataset.price;
            addToCart(name, price);
        });
    });
}

// Ajoute un item au panier
function addToCart(name, price) {
    state.cart.push({ name, price });
    updateCartUI();
}

// Met à jour l'affichage du panier (À compléter selon ton interface)
function updateCartUI() {
    console.log("Panier mis à jour :", state.cart);
    // Exemple : document.getElementById('cart-count').innerText = state.cart.length;
}

// Génère et envoie la commande via WhatsApp
function orderWhatsApp() {
    const settings = state.dataConfig.generalSettings;
    const devise = settings.currentCurrency; 
    
    const total = state.cart.reduce((somme, item) => somme + (Number(item.price) || 0), 0);
    
    const items = state.cart.map(i => {
        const prixAffiche = i.price ? `${i.price} ${devise}` : "Prix à confirmer";
        return `▪️ ${i.name} - ${prixAffiche}`;
    }).join("\n");
    
    const messageTexte = `Bonjour ${settings.siteName || 'PAULYON'} ! 👋\nJe souhaite commander les articles/services suivants :\n\n${items}\n\n*Total estimé : ${total} ${devise}*\n\nMerci d'avance !`;
    const message = encodeURIComponent(messageTexte);
    
    const cleanNumber = settings.whatsappNumber.replace(/[\s+-]/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${message}`);
}

/**
 * ============================================================================
 * 🚀 BLOC 6 : INITIALISATION PRINCIPALE DE L'APPLICATION
 * ============================================================================
 */

document.addEventListener("DOMContentLoaded", async () => {
    try {
        // 1. Chargement des composants structurels HTML
        const headerHTML = await fetch("/header.html").then(res => res.text());
        document.getElementById("header-container").innerHTML = headerHTML;

        const footerHTML = await fetch("/footer.html").then(res => res.text());
        document.getElementById("footer-container").innerHTML = footerHTML;

        // 2. Chargement des données JSON (Traductions et Configuration)
        const [translations, config] = await Promise.all([
            fetch("/traduction.json").then(res => res.json()),
            fetch("/data.json").then(res => res.json())
        ]);

        // 3. Mise à jour du State global
        state.translations = translations;
        state.dataConfig = config;

        // 4. Application de la configuration
        applyGeneralSettings();
        setLanguage(state.currentLanguage);

        // 5. Rendu de l'interface dynamique
        renderProductCards();
        renderServiceCards();

        // 6. Activation des événements UI
        attachNavigationListeners();

    } catch (error) {
        console.error("🔥 ERREUR D'INITIALISATION :", error);
    }
});
