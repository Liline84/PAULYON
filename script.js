// =======================================================
// SCRIPT.JS FINAL (V3.0) - SOLUTION COMPLÈTE
// Intègre l'injection du header, les données JSON et les menus
// =======================================================

document.addEventListener("DOMContentLoaded", () => {
    
    const headerContainer = document.getElementById("header-container");
    const body = document.body;

    // 0. Ajout de la classe 'preload' pour désactiver les transitions au démarrage
    body.classList.add('preload');

    // 1. INJECTION DU HEADER : Charger header.html dans le DOM en premier
    fetch("header.html")
        .then(response => {
            if (!response.ok) throw new Error("Erreur de chargement de header.html");
            return response.text();
        })
        .then(headerHtml => {
            headerContainer.innerHTML = headerHtml;
            // Une fois le header injecté, on peut démarrer l'initialisation complète
            startAppInitialization();
        })
        .catch(err => console.error("Erreur critique d'injection du header:", err));


    // ==========================================================
    // ** LA FONCTION PRINCIPALE DE DÉMARRAGE DE L'APPLICATION **
    // ==========================================================
    function startAppInitialization() {

        // 1. SÉLECTEURS ET VARIABLES GLOBALES (maintenant que le DOM est rempli)
        const DOMElements = {
            nav: document.getElementById("main-nav"),
            menuToggle: document.querySelector(".menu-toggle"),
            searchToggleBtn: document.getElementById("search-toggle-btn"),
            searchContainer: document.getElementById("search-container"),
            searchInput: document.getElementById("search-input"),
            
            // Les IDs que nous avons corrigés dans header.html
            productMenuContent: document.getElementById('products-menu-content'),
            serviceMenuContent: document.getElementById('services-menu-content'),
            languageDropdownContent: document.querySelector('.dropdown-language .dropdown-content'), 
            
            productCardsContainer: document.querySelector('#products-section .cards-container'),
            serviceCardsContainer: document.querySelector('#services-section .cards-container'),
            dropdowns: document.querySelectorAll(".dropdown"),
            cartZone: document.getElementById("cart-zone"), 
            htmlElement: document.documentElement
        };

        let translations = {};
        let dataConfig = {};
        let currentLanguage = localStorage.getItem('lang') || "fr";
        let cart = [];

        // 2. BACKDROP
        const backdrop = document.createElement("div");
        backdrop.classList.add("mobile-backdrop");
        body.appendChild(backdrop);
        
        const showBackdrop = () => backdrop.classList.add("visible");
        const hideBackdrop = () => backdrop.classList.remove("visible");

        // 3. CHARGEMENT ASYNCHRONE DES DONNÉES (JSON)
        Promise.all([
            fetch("traduction.json").then(res => res.json()),
            fetch("data.json").then(res => res.json())
        ])
        .then(([translationData, configData]) => {
            translations = translationData;
            dataConfig = configData;

            // Démarrer après le chargement du Header ET des JSON
            initializeDynamicContent();
            setLanguage(currentLanguage);

            // Retirer la classe 'preload' pour activer les transitions après le chargement
            body.classList.remove('preload');
        })
        .catch(err => console.error("Erreur critique lors du chargement des fichiers JSON:", err));


        // ==============================
        // 4. FONCTIONS DE TRADUCTION ET DE GÉNÉRATION DYNAMIQUE
        // ==============================
        
        function initializeDynamicContent() {
            generateProductMenu();
            generateServiceMenu();
            generateLanguageMenu(); 
            
            renderProductCards();
            renderServiceCards();

            attachProductCardListeners();
            attachNavigationListeners(); 
        }

        function setLanguage(lang) {
            currentLanguage = lang;
            localStorage.setItem('lang', lang);
            
            DOMElements.htmlElement.setAttribute('lang', lang); 

            const currentTrans = translations[lang] || translations["fr"];

            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                if (currentTrans[key]) {
                    let translatedText = currentTrans[key];
                    
                    // Remplacement des placeholders
                    const settings = dataConfig.generalSettings;
                    translatedText = translatedText.replace('[YEAR]', settings.copyrightYear || new Date().getFullYear());
                    translatedText = translatedText.replace('[SITE_NAME]', settings.siteName || 'PAULYON');
                    translatedText = translatedText.replace('[EMAIL]', settings.emailContact || 'contact.paulyon@gmail.com');
                    
                    const whatsappNum = settings.whatsappNumber;
                    const formattedWhatsapp = whatsappNum.startsWith('+') ? 
                        whatsappNum.replace(/(\+\d{3})(\d{4})(\d{4})/, '$1 $2 $3') : whatsappNum;
                    translatedText = translatedText.replace('[WHATSAPP]', formattedWhatsapp);
                    
                    element.innerHTML = translatedText;
                }
            });
            
            document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
                const key = element.getAttribute('data-i18n-placeholder');
                if (currentTrans[key]) {
                    element.placeholder = currentTrans[key];
                }
            });

            renderCart(); 
            generateLanguageMenu(); 
        }
        
        // Fonction de switch de langue pour l'écouteur
        function handleLangSwitch(e) {
             if (e.target.classList.contains('lang-switch')) {
                e.preventDefault();
                setLanguage(e.target.getAttribute('data-lang'));
                closeAllMenus();
            }
        }
        
        function generateProductMenu() {
            if (!DOMElements.productMenuContent || !dataConfig.products) return;

            DOMElements.productMenuContent.innerHTML = dataConfig.products.map(product => `
                <li><a href="#product-${product.id}" class="nav-link">${product.name}</a></li>
            `).join('');
        }
        
        function generateServiceMenu() {
            if (!DOMElements.serviceMenuContent || !dataConfig.services) return;

            DOMElements.serviceMenuContent.innerHTML = dataConfig.services.map(service => `
                <li><a href="#service-${service.id}" class="nav-link">${service.title}</a></li>
            `).join('');
        }

        function generateLanguageMenu() {
            if (!DOMElements.languageDropdownContent || !translations) return;

            const availableLangs = Object.keys(translations); 

            DOMElements.languageDropdownContent.removeEventListener('click', handleLangSwitch);
            
            DOMElements.languageDropdownContent.innerHTML = availableLangs.map(langCode => {
                const langName = translations[langCode]['nav-language-toggle'] || langCode.toUpperCase();
                const isActive = langCode === currentLanguage ? ' active-lang' : '';
                return `<li><a href="#" data-lang="${langCode}" class="lang-switch${isActive}">${langName}</a></li>`;
            }).join('');
            
            DOMElements.languageDropdownContent.addEventListener('click', handleLangSwitch);
        }

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
        
        function attachNavigationListeners() {
             // 5A. MENU MOBILE
            DOMElements.menuToggle?.addEventListener("click", () => {
                const expanded = DOMElements.menuToggle.getAttribute("aria-expanded") === "true";
                DOMElements.menuToggle.setAttribute("aria-expanded", !expanded);
                DOMElements.nav?.classList.toggle("active");
                if (!expanded) showBackdrop(); else hideBackdrop();
            });

            backdrop.addEventListener("click", closeAllMenus);

            // 5B. DROPDOWNS (MOBILE & DESKTOP)
            DOMElements.dropdowns.forEach(drop => {
                const toggle = drop.querySelector(".dropdown-toggle");
                const content = drop.querySelector(".dropdown-content");

                // CLIC (Mobile UNIQUEMENT)
                toggle?.addEventListener("click", e => {
                    if (window.innerWidth > 900) return; 
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const isVisible = content.classList.contains("show");
                    
                    closeAllMenus(drop); 
                    
                    if (!isVisible) {
                        content?.classList.add("show");
                        toggle.setAttribute("aria-expanded", "true");
                    }
                });

                // HOVER (Desktop UNIQUEMENT)
                drop.addEventListener("mouseenter", () => {
                    if (window.innerWidth <= 900) return;
                    content?.classList.add("show");
                });
                drop.addEventListener("mouseleave", () => {
                    if (window.innerWidth <= 900) return;
                    content?.classList.remove("show");
                });
            });

            // 5C. BARRE DE RECHERCHE
            DOMElements.searchToggleBtn?.addEventListener("click", () => {
                const expanded = DOMElements.searchToggleBtn.getAttribute("aria-expanded") === "true";
                DOMElements.searchToggleBtn.setAttribute("aria-expanded", !expanded);
                DOMElements.searchContainer?.classList.toggle("active");
                
                if (!expanded) {
                    DOMElements.searchInput?.focus();
                } else {
                    DOMElements.searchInput.value = '';
                }
            });
            
            // 5D. Fermeture globale et Responsive
            document.addEventListener("click", e => {
                const clickOutsideHeader = !e.target.closest("header");
                const clickOutsideBackdrop = !e.target.closest(".mobile-backdrop");

                if (clickOutsideHeader && clickOutsideBackdrop) {
                     closeAllMenus();
                } 
                
                if (e.target.classList.contains('nav-link') && DOMElements.nav?.classList.contains('active')) {
                     closeAllMenus();
                }
            });

            window.addEventListener("resize", () => {
                if (window.innerWidth > 900) {
                    closeAllMenus();
                }
            });
        }
        
        function closeAllMenus(exception = null) {
            DOMElements.dropdowns.forEach(d => {
                if (d !== exception) {
                     d.querySelector(".dropdown-content")?.classList.remove("show");
                }
            });
            
            DOMElements.nav?.classList.remove("active");
            DOMElements.menuToggle?.setAttribute("aria-expanded", "false");
            
            DOMElements.searchContainer?.classList.remove("active");
            DOMElements.searchToggleBtn?.setAttribute("aria-expanded", "false");
            
            hideBackdrop();
        }
        
        // ==============================
        // 6. LOGIQUE E-COMMERCE (PANIER + WHATSAPP)
        // ==============================
        
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

        function renderCart() {
            if (!DOMElements.cartZone) return;
            
            const currentTranslation = translations[currentLanguage] || translations["fr"];
            const currency = dataConfig.generalSettings.currentCurrency || '';

            if (cart.length === 0) {
                DOMElements.cartZone.innerHTML = `<p>${currentTranslation["alert-cart-empty"] || "Votre panier est vide."}</p>`;
                return;
            }

            DOMElements.cartZone.innerHTML = cart
                .map(item => `<p>${item.name} — ${item.price} ${currency}</p>`)
                .join("");
        }
        
        window.addToCart = function(name, price) {
            cart.push({ name, price });
            const currentTranslation = translations[currentLanguage] || translations["fr"];
            
            console.log(`${name} ${currentTranslation["alert-cart-add"] || "a été ajouté au panier !"}`);
            
            renderCart();
        }

        window.orderWhatsApp = function() {
            const currentTranslation = translations[currentLanguage] || translations["fr"];
            const currency = dataConfig.generalSettings.currentCurrency;
            // Nettoyage du numéro WhatsApp avant l'URL
            const whatsappNumber = dataConfig.generalSettings.whatsappNumber.replace('+', ''); 

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

            // Vider le panier seulement si l'ouverture a réussi
            if (windowRef) {
                cart.length = 0; 
                renderCart();
            } else {
                 alert("Veuillez autoriser les pop-ups pour finaliser la commande via WhatsApp.");
            }
        }
    }
});
