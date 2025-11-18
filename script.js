// AJOUT : Classe pour gérer les transitions CSS après le chargement
// Ceci évite les animations indésirables au chargement initial de la page.
document.body.classList.add('preload');

document.addEventListener('DOMContentLoaded', () => {

    // Retirer la classe de préchargement pour activer les transitions CSS
    setTimeout(() => {
        document.body.classList.remove('preload');
    }, 100); 

    // ==========================================================
    // 1. SÉLECTION DES ÉLÉMENTS (INCHANGÉ)
    // ==========================================================
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = mainNav ? mainNav.querySelectorAll('a') : [];

    const settingsMenu = document.getElementById('settings-menu');
    const dropdownToggle = settingsMenu ? settingsMenu.querySelector('.dropdown-toggle') : null;

    const languageDropdown = document.querySelector('.dropdown-language');
    const languageToggle = document.querySelector('.language-toggle');
    const langOptions = document.querySelectorAll('.lang-option');
    

    // ==========================================================
    // [NOUVELLE FONCTION] Gestion Générale de la Fermeture
    // Réduit la répétition de code dans les sections 2, 3 et 4
    // ==========================================================
    function closeAllMenus() {
        if (mainNav) mainNav.classList.remove('active');
        if (menuToggle) {
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.textContent = '☰';
        }
        if (settingsMenu) settingsMenu.classList.remove('show');
        if (languageDropdown) languageDropdown.classList.remove('show');
    }

    // ==========================================================
    // 2. GESTION DU MENU HAMBURGER (MOBILE) (MODIFIÉ)
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
            }
        });
    }
    
    // ==========================================================
    // 3. FERMER LE MENU APRÈS AVOIR CLIQUÉ SUR UN LIEN PRINCIPAL (MODIFIÉ)
    // ==========================================================
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Seuls les liens qui ne sont PAS dans un sous-menu déroulant (dropdown) ferment le menu principal
            if (!link.closest('.dropdown')) {
                closeAllMenus();
                // [AJOUT MODERNE] Met en évidence le lien actif (ARIA)
                navLinks.forEach(l => l.removeAttribute('aria-current'));
                link.setAttribute('aria-current', 'page');
            }
        });
    });

    // ==========================================================
    // 4. GESTION DU SOUS-MENU PARAMÈTRES (Niveau 1) (MODIFIÉ)
    // ==========================================================
    if (dropdownToggle && settingsMenu) {
        dropdownToggle.addEventListener('click', (event) => {
            event.preventDefault(); 
            event.stopPropagation();
            
            // Toggle de la classe 'show'
            settingsMenu.classList.toggle('show'); 
            
            // Ferme le sous-menu Langue s'il est ouvert et si Paramètres se ferme
            if (!settingsMenu.classList.contains('show') && languageDropdown) {
                languageDropdown.classList.remove('show');
            }
        });
    }

    // ==========================================================
    // 5. GESTION DU SOUS-MENU LANGUE (Niveau 2) (INCHANGÉ)
    // ==========================================================
    if (languageToggle && languageDropdown) {
        languageToggle.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            
            languageDropdown.classList.toggle('show');
        });
    }

    // ==========================================================
    // 6. FERMER LES MENUS SI L'UTILISATEUR CLIQUE EN DEHORS (MODIFIÉ)
    // Utilisation de la fonction centralisée closeAllMenus() pour plus de fluidité.
    // ==========================================================
    document.addEventListener('click', (event) => {
        // Vérifie si l'utilisateur a cliqué en dehors du menu principal (nav) et du bouton hamburger
        if (mainNav && !mainNav.contains(event.target) && menuToggle && !menuToggle.contains(event.target)) {
            closeAllMenus();
        }
    });


    // ==========================================================
    // 7. LOGIQUE DE TRADUCTION (LÉGÈRES MODIFICATIONS)
    // ==========================================================

    // A. Le Dictionnaire de Traduction (INCHANGÉ)
    const translations = {
        'title-tag': { fr: 'PAULYON', en: 'PAULYON', es: 'PAULYON', ht: 'PAULYON' },
        'nav-accueil': { fr: 'Accueil', en: 'Home', es: 'Inicio', ht: 'Akèy' },
        'nav-produits': { fr: 'Produits', en: 'Products', es: 'Productos', ht: 'Pwodwi' },
        'nav-services': { fr: 'Services', en: 'Services', es: 'Servicios', ht: 'Sèvis' },
        'nav-contact': { fr: 'Contact', en: 'Contact', es: 'Contacto', ht: 'Kontak' },
        'nav-settings': { fr: 'Paramètres', en: 'Settings', es: 'Ajustes', ht: 'Anviwònman' },
        'nav-language-toggle': { fr: 'Langue', en: 'Language', es: 'Idioma', ht: 'Lang' },
        'h1-accueil': { fr: 'Bienvenue chez PAULYON', en: 'Welcome to PAULYON', es: 'Bienvenido a PAULYON', ht: 'Byenvini nan PAULYON' },
        'p-slogan': { fr: 'Nous offrons des produits et services de haute qualité.', en: 'We offer high-quality products and services.', es: 'Ofrecemos productos y servicios de alta calidad.', ht: 'Nou ofri pwodwi ak sèvis gwo kalite.' },
        'h2-produits': { fr: 'Nos Produits', en: 'Our Products', es: 'Nuestros Productos', ht: 'Pwodwi nou yo' },
        'produit-1': { fr: 'Produit 1', en: 'Product 1', es: 'Producto 1', ht: 'Pwodwi 1' },
        'produit-2': { fr: 'Produit 2', en: 'Product 2', es: 'Producto 2', ht: 'Pwodwi 2' },
        'produit-3': { fr: 'Produit 3', en: 'Product 3', es: 'Producto 3', ht: 'Pwodwi 3' },
        'h2-services': { fr: 'Nos Services', en: 'Our Services', es: 'Nuestros Servicios', ht: 'Sèvis nou yo' },
        'service-1': { fr: 'Service 1', en: 'Service 1', es: 'Servicio 1', ht: 'Sèvis 1' },
        'service-2': { fr: 'Service 2', en: 'Service 2', es: 'Servicio 2', ht: 'Sèvis 2' },
        'service-3': { fr: 'Service 3', en: 'Service 3', es: 'Servicio 3', ht: 'Sèvis 3' },
        'h2-contact': { fr: 'Contactez-nous', en: 'Contact Us', es: 'Contáctanos', ht: 'Kontakte nou' },
        'p-contact-email': { fr: 'Envoyez-nous un message à ', en: 'Send us a message at ', es: 'Envíanos un mensaje a ', ht: 'Voye yon mesaj pou nou nan ' },
        'p-contact-whatsapp': { fr: 'Vous pouvez également nous contacter directement via ', en: 'You can also contact us directly via ', es: 'También puede contactarnos directamente a través de ', ht: 'Ou ka kontakte nou dirèktement via ' },
        'input-name': { fr: 'Nom', en: 'Name', es: 'Nombre', ht: 'Non' },
        'input-email': { fr: 'Email', en: 'Email', es: 'Correo', ht: 'Imèl' },
        'input-message': { fr: 'Message', en: 'Message', es: 'Mensaje', ht: 'Mesaj' },
        'btn-submit': { fr: 'Envoyer', en: 'Send', es: 'Enviar', ht: 'Voye' },
        'footer-copyright': { fr: '© 2025 PAULYON. Tous droits réservés.', en: '© 2025 PAULYON. All rights reserved.', es: '© 2025 PAULYON. Todos los derechos reservados.', ht: '© 2025 PAULYON. Tout dwa rezève.' },
        'footer-email': { fr: 'Email', en: 'Email', es: 'Correo', ht: 'Imèl' },
        'footer-address': { fr: 'Adresse : Ruelle Flora, Madeline, Cap-Haïtien, Nord, Haïti, W.I', en: 'Address: Ruelle Flora, Madeline, Cap-Haïtien, Nord, Haïti, W.I', es: 'Dirección: Ruelle Flora, Madeline, Cap-Haïtien, Nord, Haïti, W.I', ht: 'Adrès : Ruelle Flora, Madeline, Cap-Haïtien, Nord, Haïti, W.I' }
    };

    // B. Fonction de Traduction Principale (Adaptée aux nouveaux éléments HTML)
    function translatePage(lang) {
        
        // 1. Traduction des éléments par ID
        for (const id in translations) {
            const element = document.getElementById(id);
            if (element && translations[id][lang]) {
                
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.setAttribute('placeholder', translations[id][lang]);
                } else if (element.tagName === 'BUTTON') {
                     element.textContent = translations[id][lang];
                } else {
                    element.textContent = translations[id][lang];
                }
            }
        }
        
        // [MODIFICATION CLÉ] : Traduction des cartes Produits et Services
        // Nous ne traduisons plus les <li> dans les <ul>, mais le texte dans les cartes <h3> et <p>.
        
        // 2. Traduction des CARTES
        const allCards = document.querySelectorAll('.product-card, .service-card');
        
        allCards.forEach(card => {
            const h3 = card.querySelector('h3');
            const p = card.querySelector('p:not(.status-online, .status-offline)'); // Slogan du produit/service
            
            // Utilisez la logique de traduction réelle pour les titres (si vous avez des clés spécifiques)
            // Pour l'instant, on utilise des clés génériques qui étaient dans les anciennes <li>
            
            if (h3 && h3.textContent.includes('Flyer Design')) {
                h3.textContent = translations['produit-1'][lang] || 'Produit 1';
                p.textContent = (lang === 'fr' ? 'Conception de flyers promotionnels percutants.' : lang === 'en' ? 'Design of impactful promotional flyers.' : '...')
            }
            // NOTE: Une logique plus robuste nécessiterait d'ajouter des `data-key` aux `h3` et `p` dans le HTML.
        });
        
        
        // 3. Cas spécial pour le lien email (INCHANGÉ)
        const pContactEmail = document.getElementById('p-contact-email');
        if (pContactEmail) {
            const emailLink = pContactEmail.querySelector('a');
            const email = emailLink ? emailLink.href : 'mailto:contact.paulyon@gmail.com'; 
            const emailText = emailLink ? emailLink.textContent : 'contact.paulyon@gmail.com'; 
            
            pContactEmail.innerHTML = translations['p-contact-email'][lang] + `<a href="${email}">${emailText}</a> !`;
        }
        
        // 4. Sauvegarde la langue dans le stockage local (INCHANGÉ)
        localStorage.setItem('paulyonLang', lang);
    }
    
    // C. Initialisation (INCHANGÉ)
    const defaultLang = localStorage.getItem('paulyonLang') || 'fr';
    translatePage(defaultLang);


    // D. Gérer les Clics sur les Options de Langue (INCHANGÉ)
    langOptions.forEach(option => {
        option.addEventListener('click', (event) => {
            event.preventDefault();
            
            const newLang = event.target.getAttribute('data-lang');
            
            if (newLang) {
                translatePage(newLang); 
                
                // Ferme les menus après la sélection
                if (settingsMenu) settingsMenu.classList.remove('show');
                if (languageDropdown) languageDropdown.classList.remove('show');
            }
        });
    });

});
