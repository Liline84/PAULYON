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

    // Nouveaux éléments pour la gestion des sous-menus (utilisant les IDs du nouveau fichier)
    const settingsToggle = document.getElementById('nav-settings');
    const languageToggle = document.getElementById('nav-language-toggle');
    const settingsMenu = settingsToggle ? settingsToggle.parentElement : null; // Référence au <li> parent
    const languageDropdown = languageToggle ? languageToggle.parentElement : null; // Référence au <li> parent

    const langOptions = document.querySelectorAll('.lang-option');
    
    // Nouveaux éléments pour la Recherche
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
                 // Ajout de la fermeture de la recherche
                 if (searchContainer) searchContainer.classList.remove('active');
                 if (searchToggleBtn) searchToggleBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    // ==========================================================
    // 3. FERMER LE MENU APRÈS AVOIR CLIQUÉ SUR UN LIEN PRINCIPAL
    // ==========================================================
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Seuls les liens qui ne sont PAS dans un sous-menu déroulant (dropdown) ferment le menu principal
            if (!link.closest('.dropdown')) {
                closeAllMenus();
                // Met en évidence le lien actif (ARIA)
                navLinks.forEach(l => l.removeAttribute('aria-current'));
                link.setAttribute('aria-current', 'page');
            }
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
            
            // Si Paramètres se ferme, ferme aussi Langue
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
                searchInput.value = ''; // Efface le contenu à la fermeture
            }
        });
    }
    
    // ==========================================================
    // 6. FERMER LES MENUS SI L'UTILISATEUR CLIQUE EN DEHORS
    // ==========================================================
    document.addEventListener('click', (event) => {
        const isOutsideMenu = mainNav && !mainNav.contains(event.target) && menuToggle && !menuToggle.contains(event.target);
        const isOutsideSearch = searchContainer && !searchContainer.contains(event.target) && searchToggleBtn && !searchToggleBtn.contains(event.target);
        
        // Ferme TOUT si on clique en dehors de la navigation principale et de la zone de recherche
        if (isOutsideMenu && isOutsideSearch) {
            closeAllMenus();
        }
    });


    // ==========================================================
    // 7. LOGIQUE DE TRADUCTION (UTILISATION DE LA NOUVELLE STRUCTURE)
    // ==========================================================
    
    // A. Le Dictionnaire de Traduction (Nouveau Dictionnaire)
    const translations = {
        'fr': {
            'title-tag': 'PAULYON',
            'nav-accueil': 'Accueil',
            'nav-produits': 'Produits',
            'nav-services': 'Services',
            'nav-contact': 'Contact',
            'nav-settings': 'Paramètres',
            'nav-language-toggle': 'Langue',
            'h1-accueil': 'Bienvenue chez PAULYON',
            'p-slogan': 'Nous transformons le néant en chef-d\'œuvre.',
            'h2-produits': 'Nos Produits',
            'prod-vetements-title': 'Vêtements (Homme & Femme)',
            'prod-vetements-p': 'T-shirts, hoodies, et autres vêtements personnalisés de haute qualité.',
            'prod-vetements-btn': 'Voir la collection',
            'prod-bijoux-title': 'Bijoux Personnalisés',
            'prod-bijoux-p': 'Création de bijoux uniques (colliers, bracelets, bagues).',
            'prod-bijoux-btn': 'Découvrir',
            'prod-cosmetiques-title': 'Produits Cosmétiques',
            'prod-cosmetiques-p': 'Maquillage, soins de la peau et parfums de qualité supérieure.',
            'prod-cosmetiques-btn': 'Acheter',
            'prod-electronique-title': 'Appareils Électroniques',
            'prod-electronique-p': 'Gadgets et équipements électroniques modernes et fiables.',
            'prod-electronique-btn': 'Voir la sélection',
            'h2-services': 'Nos Services',
            'serv-conception-title': 'Conception Graphique (Logos, Flyers, Tasses, etc.)',
            'serv-conception-p': 'Design créatif pour tous vos supports marketing : bidons, calendriers, et plus.',
            'serv-conception-btn': 'Demander un devis',
            'serv-webdev-title': 'Développement Web (Front-end & Back-end)',
            'serv-webdev-p': 'Création de sites internet professionnels, modernes et optimisés pour mobile.',
            'serv-webdev-btn': 'Démarrer un projet',
            'serv-codage-prog-title': 'Codage & Programmation',
            'serv-codage-prog-p': 'Développement de scripts, logiciels et solutions spécifiques.',
            'serv-codage-prog-btn': 'Détails',
            'h2-contact': 'Contactez-nous',
            // NOTE: Le nouveau dictionnaire gère le texte et le lien dans la fonction setLanguage.
            'p-contact-email': 'Envoyez-nous un message à contact.paulyon@gmail.com !', 
            'p-contact-whatsapp': 'Vous pouvez également nous contacter directement via WhatsApp.',
            'input-name-placeholder': 'Nom',
            'input-email-placeholder': 'Email',
            'input-message-placeholder': 'Message',
            'btn-submit': 'Envoyer',
            'footer-copyright': '© 2025 PAULYON. Tous droits réservés.',
            'footer-email': 'Email',
            'footer-address': 'Adresse : Ruelle Flora, Madeline, Cap-Haïtien, Nord, Haïti, W.I'

        },
        'en': {
            'title-tag': 'PAULYON',
            'nav-accueil': 'Home',
            'nav-produits': 'Products',
            'nav-services': 'Services',
            'nav-contact': 'Contact',
            'nav-settings': 'Settings',
            'nav-language-toggle': 'Language',
            'h1-accueil': 'Welcome to PAULYON',
            'p-slogan': 'We transform nothingness into a masterpiece.',
            'h2-produits': 'Our Products',
            'prod-vetements-title': 'Clothing (Men & Women)',
            'prod-vetements-p': 'High-quality custom t-shirts, hoodies, and other apparel.',
            'prod-vetements-btn': 'View Collection',
            'prod-bijoux-title': 'Custom Jewelry',
            'prod-bijoux-p': 'Creation of unique jewelry (necklaces, bracelets, rings).',
            'prod-bijoux-btn': 'Discover',
            'prod-cosmetiques-title': 'Cosmetic Products',
            'prod-cosmetiques-p': 'High-quality makeup, skincare, and perfumes.',
            'prod-cosmetiques-btn': 'Shop Now',
            'prod-electronique-title': 'Electronic Devices',
            'prod-electronique-p': 'Modern and reliable electronic gadgets and equipment.',
            'prod-electronique-btn': 'View Selection',
            'h2-services': 'Our Services',
            'serv-conception-title': 'Graphic Design (Logos, Flyers, Mugs, etc.)',
            'serv-conception-p': 'Creative design for all your marketing materials: bottles, calendars, and more.',
            'serv-conception-btn': 'Request a Quote',
            'serv-webdev-title': 'Web Development (Front-end & Back-end)',
            'serv-webdev-p': 'Creation of professional, modern, and mobile-optimized websites.',
            'serv-webdev-btn': 'Start a Project',
            'serv-codage-prog-title': 'Coding & Programming',
            'serv-codage-prog-p': 'Development of scripts, software, and specific solutions.',
            'serv-codage-prog-btn': 'Details',
            'h2-contact': 'Contact Us',
            'p-contact-email': 'Send us a message at contact.paulyon@gmail.com!',
            'p-contact-whatsapp': 'You can also contact us directly via WhatsApp.',
            'input-name-placeholder': 'Name',
            'input-email-placeholder': 'Email',
            'input-message-placeholder': 'Message',
            'btn-submit': 'Send',
            'footer-copyright': '© 2025 PAULYON. All rights reserved.',
            'footer-email': 'Email',
            'footer-address': 'Address: Ruelle Flora, Madeline, Cap-Haïtien, Nord, Haiti, W.I'
        },
        'ht': {
            'title-tag': 'PAULYON',
            'nav-accueil': 'Lakay',
            'nav-produits': 'Pwodwi',
            'nav-services': 'Sèvis',
            'nav-contact': 'Kontak',
            'nav-settings': 'Paramèt',
            'nav-language-toggle': 'Lang',
            'h1-accueil': 'Byenveni lakay PAULYON',
            'p-slogan': 'Nou transfòme anyen an yon chèf d’èv.',
            'h2-produits': 'Pwodwi Nou Yo',
            'prod-vetements-title': 'Rad (Gason & Fanm)',
            'prod-vetements-p': 'T-shirt, hoodie, ak tout lòt rad pèsonalize ki gen bon jan kalite.',
            'prod-vetements-btn': 'Gade koleksyon an',
            'prod-bijoux-title': 'Bijou Pèsonalize',
            'prod-bijoux-p': 'Kreyasyon bijou inik (kolye, braslè, bag).',
            'prod-bijoux-btn': 'Dekouvri',
            'prod-cosmetiques-title': 'Pwodwi Kosmetik',
            'prod-cosmetiques-p': 'Pwodwi pou makiyaj, swen po ak pafen ki gen siperyè kalite.',
            'prod-cosmetiques-btn': 'Achte Kounye a',
            'prod-electronique-title': 'Aparèy Elektwonik',
            'prod-electronique-p': 'Gadjèt ak ekipman elektwonik modèn ki fyab.',
            'prod-electronique-btn': 'Gade seleksyon an',
            'h2-services': 'Sèvis Nou Yo',
            'serv-conception-title': 'Konsepsyon Grafik (Logo, Flyer, Tas, elatriye)',
            'serv-conception-p': 'Konsepsyon kreyatif pou tout materyèl maketing ou yo: bidon, kalandriye, ak plis ankò.',
            'serv-conception-btn': 'Mande yon pri',
            'serv-webdev-title': 'Devlopman Web (Front-end & Back-end)',
            'serv-webdev-p': 'Kreyasyon sit entènèt pwofesyonèl, modèn ak optimize pou mobil.',
            'serv-webdev-btn': 'Kòmanse yon pwojè',
            'serv-codage-prog-title': 'Kodaj & Pwogramasyon',
            'serv-codage-prog-p': 'Devlopman script, lojisyèl, ak solisyon espesifik.',
            'serv-codage-prog-btn': 'Detay',
            'h2-contact': 'Kontakte Nou',
            'p-contact-email': 'Voye yon mesaj pou nou nan contact.paulyon@gmail.com !',
            'p-contact-whatsapp': 'Ou ka kontakte nou tou dirèkteman sou WhatsApp.',
            'input-name-placeholder': 'Non',
            'input-email-placeholder': 'Imèl',
            'input-message-placeholder': 'Mesaj',
            'btn-submit': 'Voye',
            'footer-copyright': '© 2025 PAULYON. Tout dwa rezève.',
            'footer-email': 'Imèl',
            'footer-address': 'Adrès: Ruelle Flora, Madeline, Cap-Haïtien, Nord, Haïti, W.I'
        }
        // NOTE: Ajoutez 'es' ici si l'Espagnol est nécessaire
    };


    // B. Fonction de Traduction Principale (Adaptée et Améliorée)
    function setLanguage(langCode) {
        const currentTranslation = translations[langCode];
        if (!currentTranslation) return;

        // 1. Traduction des éléments par ID et cas spéciaux
        for (const id in currentTranslation) {
            const element = document.getElementById(id);
            const value = currentTranslation[id];
            
            if (element) {
                // Titre de la page
                if (id === 'title-tag') {
                    document.title = value;
                } 
                // Placeholders (gérés par l'ID dédié dans le HTML)
                else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    if (id.includes('placeholder')) {
                        element.setAttribute('placeholder', value);
                    }
                } 
                // Liens dans des balises p (Contact)
                else if (id === 'p-contact-email') {
                    // Pour garder le lien <a> intact, nous mettons à jour le textNode
                    const email = 'contact.paulyon@gmail.com'; 
                    const contactHTML = value.replace(email, `<a href="mailto:${email}">${email}</a>`);
                    element.innerHTML = contactHTML;
                }
                 else if (id === 'p-contact-whatsapp') {
                    // Pour garder le lien <a> intact
                    const whatsappLink = element.querySelector('a');
                    const linkText = whatsappLink ? whatsappLink.outerHTML : 'WhatsApp';
                    const contactHTML = value.replace('WhatsApp', linkText);
                    element.innerHTML = contactHTML;
                }
                // Contenu standard (h1, p, a, button)
                else {
                    element.textContent = value;
                }
            } else {
                // 2. Gestion des Cartes (Produits/Services)
                // Recherche par la convention 'prod-id-title', 'serv-id-p', etc.
                if (id.endsWith('-title')) {
                    const cardId = id.replace('-title', '');
                    const titleElement = document.querySelector(`#${cardId} h3`);
                    if (titleElement) titleElement.textContent = value;
                } else if (id.endsWith('-p')) {
                    const cardId = id.replace('-p', '');
                    // Exclure les classes 'status' qui pourraient être dans un <p>
                    const pElement = document.querySelector(`#${cardId} p:not(.status-online, .status-offline)`);
                    if (pElement) pElement.textContent = value;
                } else if (id.endsWith('-btn')) {
                    const cardId = id.replace('-btn', '');
                    // Sélectionne un bouton dans la carte
                    const btnElement = document.querySelector(`#${cardId} .btn-primary, #${cardId} .btn-secondary, #${cardId} button`);
                    if (btnElement) btnElement.textContent = value;
                }
                // Cas de l'input placeholder si l'ID n'est pas sur le placeholder mais sur l'input lui-même (ajustement)
                 else if (id.includes('placeholder')) {
                        const inputId = id.replace('-placeholder', '');
                        const inputElement = document.getElementById(inputId);
                        if (inputElement) {
                             inputElement.setAttribute('placeholder', value);
                        }
                 }
            }
        }
        
        // Mettre à jour l'attribut lang de la balise HTML
        document.documentElement.lang = langCode;
        
        // Stocker la langue dans le localStorage 
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
                
                // Ferme les menus après la sélection
                if (settingsMenu) settingsMenu.classList.remove('show');
                if (languageDropdown) languageDropdown.classList.remove('show');
            }
        });
    });

});
