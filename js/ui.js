// Gestion de l'interface utilisateur : menus, dropdowns, traduction, barre recherche, interactions

export function initUI(DOMElements, translations, dataConfig, currentLanguage, setLanguage, closeAllMenus) {
    
    // Génération du menu produits
    function generateProductMenu() {
        if (!DOMElements.productMenuContent || !dataConfig.products) return;

        DOMElements.productMenuContent.innerHTML = dataConfig.products.map(product => `
            <li><a href="#product-product.id" class="nav-link">{product.name}</a></li>
        `).join('');
    }

    // Génération du menu services
    function generateServiceMenu() {
        if (!DOMElements.serviceMenuContent || !dataConfig.services) return;

        DOMElements.serviceMenuContent.innerHTML = dataConfig.services.map(service => `
            <li><a href="#service-service.id" class="nav-link">{service.title}</a></li>
        `).join('');
    }

    // Génération du menu langues
    function generateLanguageMenu() {
        if (!DOMElements.languageDropdownContent || !translations) return;
const availableLangs = Object.keys(translations);

        DOMElements.languageDropdownContent.removeEventListener('click', handleLangSwitch);

        DOMElements.languageDropdownContent.innerHTML = availableLangs.map(langCode => {
            const langName = translations[langCode]['nav-language-toggle'] || langCode.toUpperCase();
            const isActive = langCode === currentLanguage ? ' active-lang' : '';
            return `<li><a href="#" data-lang="langCode" class="lang-switch{isActive}">${langName}</a></li>`;
        }).join('');

        DOMElements.languageDropdownContent.addEventListener('click', handleLangSwitch);
    }

    // Gestion du clic sur changement de langue
    function handleLangSwitch(e) {
        if (e.target.classList.contains('lang-switch')) {
            e.preventDefault();
            setLanguage(e.target.getAttribute('data-lang'));
            closeAllMenus();
        }
    }

    // Fonction pour appliquer la traduction sur le DOM
    function applyTranslations(currentLanguage) {
        const currentTrans = translations[currentLanguage] || translations["fr"];
        const settings = dataConfig.generalSettings;

        document.querySelectorAll('[data-i18n]').forEach(element => {if (currentTrans[key]) 
                let translatedText = currentTrans[key];

                // Remplacement des placeholders
                translatedText = translatedText.replace('[YEAR]', settings.copyrightYear || new Date().getFullYear());
                translatedText = translatedText.replace('[SITE_NAME]', settings.siteName || 'PAULYON');
                translatedText = translatedText.replace('[EMAIL]', settings.emailContact || 'contact.paulyon@gmail.com');

                const whatsappNum = settings.whatsappNumber;
                const formattedWhatsapp = whatsappNum.startsWith('+') ?
                    whatsappNum.replace(/(3̣)(4̣)(4̣)/, '1 23') : whatsappNum;
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
    }

    // Gestion des interactions utilisateur (menus, dropdowns, recherche)
    function attachNavigationListeners() {
        // Menu mobile toggle
  DOMElements.menuToggle?.addEventListener("click", () => {
            const expanded = DOMElements.menuToggle.getAttribute("aria-expanded") === "true";
            DOMElements.menuToggle.setAttribute("aria-expanded", !expanded);
            DOMElements.nav?.classList.toggle("active");
            if (!expanded) showBackdrop(); else hideBackdrop();
        });

        // Backdrop click
        backdrop.addEventListener("click", closeAllMenus);

        // Dropdowns click (mobile) and hover (desktop)
        DOMElements.dropdowns.forEach(drop => {
            const toggle = drop.querySelector(".dropdown-toggle");
            const content = drop.querySelector(".dropdown-content");

            // Click mobile only
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

            // Hover desktop only
            drop.addEventListener("mouseenter", () => {if (window.innerWidth <= 900) return;
                content?.classList.add("show");
            });
            drop.addEventListener("mouseleave", () => {
                if (window.innerWidth <= 900) return;
                content?.classList.remove("show");
            });
        });

        // Barre de recherche toggle
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

        // Fermeture globale des menus au clic extérieur
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

        // Resize window : fermer menus si large écran
        window.addEventListener("resize", () => {
            if (window.innerWidth > 900) {
                closeAllMenus();
            }
        });
    }

    // Backdrop management
    const backdrop = document.createElement("div");
    backdrop.classList.add("mobile-backdrop");
    document.body.appendChild(backdrop);

    const showBackdrop = () => backdrop.classList.add("visible");
    const hideBackdrop = () => backdrop.classList.remove("visible");

    return {
        generateProductMenu,
        generateServiceMenu,
        generateLanguageMenu,
        applyTranslations,
        attachNavigationListeners,
        showBackdrop,
        hideBackdrop,
        backdrop
    };
}
