/**
 * ============================================================================
 * 📦 BLOC 1 : ÉTAT GLOBAL DE L'APPLICATION (STATE)
 * ============================================================================
 * Centralise toutes les données pour éviter les conflits dans le code.
 */
const state = {
    translations: {},
    dataConfig: {},
    currentLanguage: localStorage.getItem('lang') || "fr",
    cart: JSON.parse(localStorage.getItem('cart')) || [], // Persistance du panier
    activeCategory: "all",
    searchQuery: ""
};

/**
 * ============================================================================
 * 🎨 BLOC 2 : INTERFACE UTILISATEUR ET NAVIGATION (UI)
 * ============================================================================
 */

function toggleSidebar() {
    const nav = document.getElementById("sidebar");
    nav?.classList.toggle("open"); // Aligné avec les classes de ton HTML initial
    
    const overlay = document.getElementById("sidebarOverlay");
    overlay?.classList.toggle("active");
}

function closeAllMenus() {
    document.getElementById("sidebar")?.classList.remove("open");
    document.getElementById("sidebarOverlay")?.classList.remove("active");
}

function attachNavigationListeners() {
    document.getElementById("hamburgerBtn")?.addEventListener("click", toggleSidebar);
    document.getElementById("sidebarOverlay")?.addEventListener("click", closeAllMenus);
}

/**
 * ============================================================================
 * ⚙️ BLOC 3 : PARAMÈTRES ET INTERNATIONALISATION (I18N)
 * ============================================================================
 */

function applyGeneralSettings() {
    const settings = state.dataConfig.generalSettings;
    if (!settings) return;

    if (settings.siteName) {
        document.title = `${settings.siteName} — Lab Hub`;
    }
    updateCartUI(); // Met à jour le compteur global du panier au chargement
}

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
            
            text = text.replace('[YEAR]', settings?.copyrightYear || new Date().getFullYear())
                       .replace('[SITE_NAME]', settings?.siteName || 'PAULYON')
                       .replace('[EMAIL]', settings?.emailContact || 'contact.paulyon@gmail.com');
            
            element.innerHTML = text;
        }
    });
}

/**
 * ============================================================================
 * 🛍️ BLOC 4 : RENDU FILTRÉ ET RECHERCHE (MÉTHODE SHEIN / TEMU)
 * ============================================================================
 */

// Gère l'affichage des filtres et de la recherche dynamique
function initFiltersAndSearch() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');

    // Écoute la saisie utilisateur
    searchInput?.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.toLowerCase();
        renderProductCards();
    });

    // Écoute le changement de catégorie
    categoryFilter?.addEventListener('change', (e) => {
        state.activeCategory = e.target.value;
        renderProductCards();
    });
}

// Génère et affiche les cartes de produits avec filtres actifs
function renderProductCards() {
    const container = document.querySelector('#products-section .cards-container');
    if (!container || !state.dataConfig.products) return;

    const currency = state.dataConfig.generalSettings?.currentCurrency || "HTG";

    // Étape Shein/Temu : Filtrage des données avant affichage
    const filteredProducts = state.dataConfig.products.filter(product => {
        const matchSearch = product.name.toLowerCase().includes(state.searchQuery) || 
                            product.description.toLowerCase().includes(state.searchQuery);
        const matchCategory = state.activeCategory === "all" || product.category === state.activeCategory;
        return matchSearch && matchCategory;
    });

    if (filteredProducts.length === 0) {
        container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--t3);">Aucun produit trouvé.</div>`;
        return;
    }

    container.innerHTML = filteredProducts.map(product => {
        const isPending = !product.price || product.price === 0;
        const priceText = isPending ? "À confirmer" : `${product.price} ${currency}`;

        return `
            <div class="card">
                <div class="card-img">
                    <img src="${product.imagePath}" alt="${product.name}" onerror="this.style.display='none'">
                    <i class="${product.iconClass} ${product.colorClass}" style="font-size:36px; opacity:.3;"></i>
                    <div class="card-icon-badge">${product.badge || '✨'}</div>
                </div>
                <div class="card-body">
                    <p class="card-name">${product.name}</p>
                    <p class="card-desc">${product.description}</p>
                    <div class="card-footer">
                        <div class="card-price">
                            <span>À partir de</span>
                            ${priceText}
                        </div>
                        <button class="btn btn-primary btn-sm btn-add-cart" data-name="${product.name}" data-price="${product.price || 0}">
                            <i class="fa-solid fa-cart-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    attachCartListeners(container);
}

// Génère et affiche les cartes de services
function renderServiceCards() {
    const container = document.querySelector('#services-section .cards-container');
    if (!container || !state.dataConfig.services) return;

    const currency = state.dataConfig.generalSettings?.currentCurrency || "HTG";

    container.innerHTML = state.dataConfig.services.map(service => `
        <div class="card service-card">
            <div style="padding: 20px 20px 0 20px;">
                <i class="${service.iconClass} ${service.colorClass}" style="font-size: 2.5rem; margin-bottom:15px; display:block;"></i>
                <h3 class="card-name">${service.title}</h3>
                <p class="card-desc" style="margin-top:10px;">${service.details}</p>
            </div>
            <div class="card-body" style="padding-top:0;">
                <div class="card-footer" style="margin-top:15px;">
                    <div class="card-price">
                        <span>Tarif standard</span>
                        ${service.price} ${currency}
                    </div>
                    <button class="btn btn-primary btn-sm btn-add-cart" data-name="${service.title}" data-price="${service.price}">
                        <i class="fa-solid fa-calendar-check"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    attachCartListeners(container);
}

/**
 * ============================================================================
 * 🛒 BLOC 5 : GESTION DU PANIER ET COMMANDES (CART)
 * ============================================================================
 */

function attachCartListeners(container) {
    container.querySelectorAll('.btn-add-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            const name = btn.dataset.name;
            const price = btn.dataset.price;
            
            addToCart(name, price);

            // Animation visuelle d'ajout réussi
            const originalIcon = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-check"></i>';
            btn.style.background = 'var(--green, #22c55e)';
            setTimeout(() => {
                btn.innerHTML = originalIcon;
                btn.style.background = '';
            }, 1200);
        });
    });
}

function addToCart(name, price) {
    state.cart.push({ name, price: Number(price) });
    localStorage.setItem('cart', JSON.stringify(state.cart)); // Sauvegarde locale
    updateCartUI();
}

function updateCartUI() {
    // Si tu as un badge d'icône panier avec l'id "cart-count", il se mettra à jour automatiquement
    const cartBadge = document.getElementById('cart-count');
    if (cartBadge) {
        cartBadge.innerText = state.cart.length;
        cartBadge.style.display = state.cart.length > 0 ? "flex" : "none";
    }
    console.log("Panier à jour :", state.cart);
}

function clearCart() {
    state.cart = [];
    localStorage.removeItem('cart');
    updateCartUI();
}

function orderWhatsApp() {
    const settings = state.dataConfig.generalSettings;
    if (!settings || state.cart.length === 0) {
        alert("Votre commande est vide. Ajoutez des produits d'abord !");
        return;
    }

    const devise = settings.currentCurrency || "HTG";
    const total = state.cart.reduce((somme, item) => somme + (Number(item.price) || 0), 0);
    
    const items = state.cart.map(i => {
        const prixAffiche = i.price > 0 ? `${i.price} ${devise}` : "Prix à confirmer";
        return `▪️ ${i.name} - ${prixAffiche}`;
    }).join("\n");
    
    const messageTexte = `Bonjour ${settings.siteName || 'PAULYON'} ! 👋\nJe souhaite commander les articles suivants :\n\n${items}\n\n*Total estimé : ${total} ${devise}*\n\nMerci de valider ma commande !`;
    const message = encodeURIComponent(messageTexte);
    
    const cleanNumber = settings.whatsappNumber.replace(/[\s+-]/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${message}`);
    
    clearCart(); // Vide le panier après envoi de commande
}

// Rend la fonction accessible depuis le bouton global "Commander via WhatsApp" du HTML
window.orderWhatsApp = orderWhatsApp;

/**
 * ============================================================================
 * 🚀 BLOC 6 : INITIALISATION PRINCIPALE DE L'APPLICATION
 * ============================================================================
 */

document.addEventListener("DOMContentLoaded", async () => {
    try {
        // 1. Injection des composants structurels HTML
        const headerHTML = await fetch("/header.html").then(res => res.text()).catch(() => "");
        const headerContainer = document.getElementById("header-container");
        if (headerContainer) headerContainer.innerHTML = headerHTML;

        const footerHTML = await fetch("/footer.html").then(res => res.text()).catch(() => "");
        const footerContainer = document.getElementById("footer-container");
        if (footerContainer) footerContainer.innerHTML = footerHTML;

        // 2. Chargement asynchrone parallélisé des configurations JSON
        const [translations, config] = await Promise.all([
            fetch("/traduction.json").then(res => res.json()).catch(() => ({})),
            fetch("/data.json").then(res => res.json()).catch(() => ({}))
        ]);

        // 3. Hydratation du State global
        state.translations = translations;
        state.dataConfig = config;

        // 4. Exécution de la configuration
        applyGeneralSettings();
        setLanguage(state.currentLanguage);

        // 5. Initialisation des moteurs de recherche et filtres de produits
        initFiltersAndSearch();

        // 6. Rendu intelligent des cartes (uniquement si le conteneur cible existe sur la page actuelle)
        renderProductCards();
        renderServiceCards();

        // 7. Événements globaux de navigation
        attachNavigationListeners();

    } catch (error) {
        console.error("🔥 ERREUR D'INITIALISATION DE L'APPLICATION :", error);
    }
});
