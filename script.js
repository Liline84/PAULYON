// AJOUT : Classe pour gérer les transitions CSS après le chargement
document.body.classList.add('preload');

// ==========================================================
// A. Fonction de Traduction Principale (Rendue GLOBALE)
// ==========================================================
// Cette fonction sera initialisée plus bas dans runMainAppLogic,
// mais sa définition globale est nécessaire pour les autres pages.
let translations = { 'fr': {} };
let generalSettings = {};
let siteName = 'PAULYON';
let emailContact = 'contact.paulyon@gmail.com';
let whatsappNumber = '';
let copyrightYear = 2025;
let address = 'Adresse inconnue';

function setLanguage(langCode) {
    const currentTranslation = translations[langCode];
    if (!currentTranslation) return;
    
    // Simplification des variables globales dans la fonction
    const currentSiteName = generalSettings.siteName || siteName;
    const currentEmail = generalSettings.emailContact || emailContact;
    const currentWhatsapp = (generalSettings.whatsappNumber || whatsappNumber).replace('+', '');
    const currentCopyrightYear = generalSettings.copyrightYear || copyrightYear;
    const currentAddress = generalSettings.address || address;

    for (const id in currentTranslation) {
        const element = document.getElementById(id);
        const value = currentTranslation[id];
        
        if (element) {
            if (id === 'title-tag') {
                document.title = currentSiteName + ' | ' + value; 
            } else if (id.endsWith('-placeholder')) {
                const inputElement = document.getElementById(id.replace('-placeholder', ''));
                if (inputElement) inputElement.setAttribute('placeholder', value);
            } else if (id === 'p-contact-email') {
                const html = value.replace('[EMAIL]', `<a href="mailto:${currentEmail}">${currentEmail}</a>`);
                element.innerHTML = html;
            } else if (id === 'p-contact-whatsapp') {
                const whatsappLink = `<a href="https://wa.me/${currentWhatsapp}">${currentTranslation['nav-contact']}</a>`;
                const html = value.replace('[WHATSAPP]', whatsappLink);
                element.innerHTML = html;
            } else if (id === 'footer-copyright') {
                const html = value.replace('[YEAR]', currentCopyrightYear).replace('[SITE_NAME]', currentSiteName);
                element.innerHTML = html;
            } else if (id === 'footer-address') {
                const html = value.replace('[ADDRESS]', currentAddress);
                element.innerHTML = html;
            } else {
                element.textContent = value;
            }
        } 
    }

    document.querySelectorAll('[data-key="btn-order"]').forEach(btn => {
        btn.textContent = currentTranslation['btn-order'] || 'Commander';
    });
    document.querySelectorAll('[data-key="btn-quote"]').forEach(btn => {
        btn.textContent = currentTranslation['btn-quote'] || 'Demander un devis';
    });
    document.querySelectorAll('[data-translate-key="status-available"]').forEach(p => {
         p.textContent = currentTranslation['status-online'] || 'Disponible';
    });
    document.querySelectorAll('[data-translate-key="status-unavailable"]').forEach(p => {
         p.textContent = currentTranslation['status-offline'] || 'Indisponible';
    });

    document.documentElement.lang = langCode;
    localStorage.setItem('paulyon-lang', langCode);
}


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
        translations = await translationResponse.json(); // Mettre à jour la variable globale

        return { siteData, translations };
    } catch (error) {
        console.error("Erreur lors du chargement des fichiers JSON:", error);
        return { 
            siteData: { generalSettings: {}, products: [], services: [], languages: [] },
            translations: { 'fr': {} } 
        };
    }
}


// ==========================================================
// [FONCTION DU HEADER] Gère l'initialisation de tout le HEADER
// ==========================================================
function initMenuHandlers() {

    // Retirer la classe de préchargement pour activer les transitions CSS
    setTimeout(() => {
        document.body.classList.remove('preload');
    }, 100); 

    // ==========================================================
    // 1. SÉLECTION DES ÉLÉMENTS (Aucun changement nécessaire grâce à closest())
    // ==========================================================
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = mainNav ? mainNav.querySelectorAll('a') : [];

    const productsToggle = document.getElementById('nav-produits');
    const productsDropdown = productsToggle ? productsToggle.closest('#products-dropdown') : null;
    
    const servicesToggle = document.getElementById('nav-services');
    const servicesDropdown = servicesToggle ? servicesToggle.closest('#services-dropdown') : null;

    const settingsToggle = document.getElementById('nav-settings');
    const settingsMenu = settingsToggle ? settingsToggle.closest('#settings-dropdown') : null; 
    
    // languageToggle et languageDropdown sont maintenant au NIVEAU 2 (dans Paramètres)
    const languageToggle = document.getElementById('nav-language-toggle');
    const languageDropdown = languageToggle ? languageToggle.closest('#language-dropdown') : null; 
    
    const searchToggleBtn = document.getElementById('search-toggle-btn');
    const searchContainer = document.getElementById('search-container');
    const searchInput = document.getElementById('search-input');
    
    // ... closeAllMenus() reste inchangée ...
    function closeAllMenus() {
        if (mainNav) mainNav.classList.remove('active');
        if (menuToggle) {
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.textContent = '☰';
        }
        if (settingsMenu) settingsMenu.classList.remove('show');
        if (languageDropdown) languageDropdown.classList.remove('show');
        if (productsDropdown) productsDropdown.classList.remove('show');
        if (servicesDropdown) servicesDropdown.classList.remove('show');
        
        if (searchContainer) searchContainer.classList.remove('active');
        if (searchToggleBtn) searchToggleBtn.setAttribute('aria-expanded', 'false');
        if (searchInput) searchInput.value = '';
    }
    // ...

    // ... Sections 2 et 3 inchangées ...

    // ==========================================================
    // 4. GESTION DES SOUS-MENUS (MISE À JOUR)
    // ==========================================================
    function handleDropdownToggle(toggleElement, dropdownElement) {
        if (!toggleElement || !dropdownElement) return;

        toggleElement.addEventListener('click', (event) => {
            event.preventDefault(); 
            event.stopPropagation();
            
            // On définit les menus de niveau 1
            const levelOneMenus = [productsDropdown, servicesDropdown, settingsMenu]; 
            
            // Si le menu cliqué est un menu de niveau 1 (Produits, Services, Paramètres)
            if (levelOneMenus.includes(dropdownElement)) {
                // Ferme tous les AUTRES menus de Niveau 1
                levelOneMenus.forEach(d => {
                    if (d && d !== dropdownElement) {
                        d.classList.remove('show');
                    }
                });
                // S'assurer que la langue est fermée (même si elle est dans Paramètres)
                if (languageDropdown) languageDropdown.classList.remove('show'); 
                
            } else if (dropdownElement === languageDropdown) {
                // Si le menu cliqué est Langue (Niveau 2), on ferme uniquement les autres Niveau 2
                // (Ce n'est pas nécessaire ici car il n'y en a qu'un seul sous Paramètres)
                // MAIS on empêche le clic de fermer le menu Paramètres parent
                // (Ce qui est géré par event.stopPropagation())
            }

            // Ouvre ou ferme le menu actuel
            dropdownElement.classList.toggle('show');
        });
    }

    // Le gestionnaire de la langue reste car elle est cliquable (niveau 2)
    handleDropdownToggle(productsToggle, productsDropdown);
    handleDropdownToggle(servicesToggle, servicesDropdown);
    handleDropdownToggle(settingsToggle, settingsMenu);
    handleDropdownToggle(languageToggle, languageDropdown);
    
    // ... Le reste de initMenuHandlers() est inchangé ...
}
// FIN de initMenuHandlers()


// ==========================================================
// [LOGIQUE PRINCIPALE DE L'APPLICATION] (Appelée par index.html)
// ==========================================================
async function runMainAppLogic() { 

    // ==========================================================
    // 0. CHARGEMENT DES DONNÉES JSON
    // ==========================================================
    const { siteData, translations: newTranslations } = await loadSiteData();
    
    // Mise à jour des variables globales pour setLanguage
    Object.assign(generalSettings, siteData.generalSettings || {});
    Object.assign(translations, newTranslations);
    
    // Mise à jour des variables de secours (pour setLanguage)
    whatsappNumber = (generalSettings.whatsappNumber || '').replace('+', '');
    emailContact = generalSettings.emailContact || 'contact.paulyon@gmail.com';
    address = generalSettings.address || 'Adresse inconnue';
    copyrightYear = generalSettings.copyrightYear || 2025;
    siteName = generalSettings.siteName || 'PAULYON';
    const currentCurrency = generalSettings.currentCurrency || 'HTG';

    const cart = []; 
    const savedLang = localStorage.getItem('paulyon-lang') || 'fr';

    // ... (Fonction C. generateLanguageMenu) inchangée, elle utilise setLanguage global
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

        document.querySelectorAll('.lang-option').forEach(option => {
            option.addEventListener('click', (event) => {
                event.preventDefault();
                const newLang = event.target.getAttribute('data-lang');
                if (newLang) {
                    setLanguage(newLang); // Appel à la fonction globale
                }
            });
        });
    }

    // ... (Fonctions 7 et 8 restent inchangées et utilisent les variables globales/locales) ...

    // DÉCLENCHEMENT DE L'AFFICHAGE DYNAMIQUE ET DE LA TRADUCTION
    
    // 1. Génère le menu de langue
    if (siteData.languages) {
        generateLanguageMenu(siteData.languages);
    } else if (translations) {
        const languages = Object.keys(translations).map(code => ({ code, name: translations[code]['nav-language-toggle'] || code.toUpperCase() }));
        generateLanguageMenu(languages);
    }
    
    // 2. Affiche les produits si nous sommes sur la bonne page
    if (siteData.products.length > 0 && document.body.id === 'products-page') { 
        displayProducts(siteData.products);
    }

    // 3. Affiche les services si nous sommes sur la bonne page
    if (siteData.services.length > 0 && document.body.id === 'services-page') { 
        displayServices(siteData.services);
    }
    
    // 4. Applique la langue sauvegardée à tous les éléments
    setLanguage(savedLang);

} // FIN de runMainAppLogic()
