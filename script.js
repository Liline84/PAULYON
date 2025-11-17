document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================
    // 1. SÉLECTION DES ÉLÉMENTS DU MENU
    // ==========================================================
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.getElementById('main-nav');
    // Vérifier l'existence de mainNav avant de l'interroger
    const navLinks = mainNav ? mainNav.querySelectorAll('a') : [];
    
    // Menu Niveau 1 : Paramètres
    const settingsMenu = document.getElementById('settings-menu');
    // Vérifier l'existence de settingsMenu avant de l'interroger
    const dropdownToggle = settingsMenu ? settingsMenu.querySelector('.dropdown-toggle') : null;
    
    // Menu Niveau 2 : Langue
    const languageDropdown = document.querySelector('.dropdown-language');
    const languageToggle = document.querySelector('.language-toggle');
    const langOptions = document.querySelectorAll('.lang-option');


    // ==========================================================
    // 2. GESTION DU MENU HAMBURGER (MOBILE)
    // ==========================================================
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');

            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            
            // Met à jour l'icône 
            menuToggle.textContent = mainNav.classList.contains('active') ? '✖' : '☰';

            // Ferme tous les sous-menus si le menu principal est fermé
            if (!mainNav.classList.contains('active')) {
                 if (settingsMenu) settingsMenu.classList.remove('show');
                 if (languageDropdown) languageDropdown.classList.remove('show');
            }
        });
    }
    
    // 3. FERMER LE MENU APRÈS AVOIR CLIQUÉ SUR UN LIEN PRINCIPAL
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Ferme le menu principal si on clique sur un lien (sauf dans les menus déroulants)
            if (mainNav && mainNav.classList.contains('active') && !link.closest('.dropdown')) {
                mainNav.classList.remove('active');
                if (menuToggle) {
                    menuToggle.setAttribute('aria-expanded', 'false');
                    menuToggle.textContent = '☰';
                }
                if (languageDropdown) languageDropdown.classList.remove('show');
                if (settingsMenu) settingsMenu.classList.remove('show');
            }
        });
    });

    // ==========================================================
    // 4. GESTION DU SOUS-MENU PARAMÈTRES (Niveau 1) - LE CORRECTIF PRINCIPAL
    // ==========================================================
    if (dropdownToggle && settingsMenu && languageDropdown) {
        dropdownToggle.addEventListener('click', (event) => {
            event.preventDefault(); 
            event.stopPropagation();
            
            // Ajoute/enlève la classe 'show' sur l'élément parent, ce qui ouvre le menu.
            settingsMenu.classList.toggle('show'); 
            
            // S'assure que le sous-menu Langue est fermé si Paramètres se ferme.
            if (!settingsMenu.classList.contains('show')) {
                languageDropdown.classList.remove('show');
            }
        });
    }

    // ==========================================================
    // 5. GESTION DU SOUS-MENU LANGUE (Niveau 2)
    // ==========================================================
    if (languageToggle && languageDropdown) {
        languageToggle.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            
            // Ajoute/enlève la classe 'show' sur l'élément parent
            languageDropdown.classList.toggle('show');
        });
    }

    // ==========================================================
    // 6. FERMER LES MENUS SI L'UTILISATEUR CLIQUE EN DEHORS
    // ==========================================================
    document.addEventListener('click', (event) => {
        // Ferme le menu Paramètres (et par conséquent Langue) s'il est ouvert et que le clic est en dehors.
        if (settingsMenu && !settingsMenu.contains(event.target)) {
            settingsMenu.classList.remove('show');
            if (languageDropdown) {
                 languageDropdown.classList.remove('show'); 
            }
        }
    });


    // ==========================================================
    // 7. LOGIQUE DE TRADUCTION
    // ==========================================================

    // A. Le Dictionnaire de Traduction
    const translations = {
        // ... (Le dictionnaire reste le même)
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
        'p-contact-whatsapp': { fr: 'Vous pouvez également nous contacter directement via ', en: 'You can also contact us directly via ', es: 'También puede contactarnos directamente a través de ', ht: 'Ou ka kontakte nou dirèkteman via ' },
        'input-name': { fr: 'Nom', en: 'Name', es: 'Nombre', ht: 'Non' },
        'input-email': { fr: 'Email', en: 'Email', es: 'Correo', ht: 'Imèl' },
        'input-message': { fr: 'Message', en: 'Message', es: 'Mensaje', ht: 'Mesaj' },
        'btn-submit': { fr: 'Envoyer', en: 'Send', es: 'Enviar', ht: 'Voye' },

        'footer-copyright': { fr: '© 2025 PAULYON. Tous droits réservés.', en: '© 2025 PAULYON. All rights reserved.', es: '© 2025 PAULYON. Todos los derechos reservados.', ht: '© 2025 PAULYON. Tout dwa rezève.' },
        'footer-email': { fr: 'Email', en: 'Email', es: 'Correo', ht: 'Imèl' },
        'footer-address': { fr: 'Adresse : [Votre Adresse ici si applicable]', en: 'Address: [Your Address here if applicable]', es: 'Dirección: [Su Dirección aquí si corresponde]', ht: 'Adrès : [Adrès ou isit la si aplikab]' }
    };

    // B. Fonction de Traduction Principale
    function translatePage(lang) {
        
        // 1. Traduction des éléments par ID
        for (const id in translations) {
            const element = document.getElementById(id);
            if (element && translations[id][lang]) {
                
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    // Traduction du placeholder
                    element.setAttribute('placeholder', translations[id][lang]);
                } else if (element.tagName === 'BUTTON') {
                     element.textContent = translations[id][lang];
                } else {
                    // Traduction du contenu textuel (h1, p, a, title, etc.)
                    element.textContent = translations[id][lang];
                }
            }
        }
        
        // 2. Traduction des listes Produits et Services (via l'attribut data-key)
        const productsList = document.querySelector('#produits ul');
        const servicesList = document.querySelector('#services ul');
        
        // Traduction des produits
        if (productsList) {
            productsList.querySelectorAll('li').forEach(li => {
                const key = li.getAttribute('data-key');
                if (key && translations[key] && translations[key][lang]) {
                    li.textContent = translations[key][lang];
                }
            });
        }
        
        // Traduction des services
        if (servicesList) {
            servicesList.querySelectorAll('li').forEach(li => {
                const key = li.getAttribute('data-key');
                if (key && translations[key] && translations[key][lang]) {
                    li.textContent = translations[key][lang];
                }
            });
        }
        
        // 3. Cas spécial pour le lien de contact par email (pour ne pas casser le lien <a>)
        const pContactEmail = document.getElementById('p-contact-email');
        if (pContactEmail) {
            const emailLink = pContactEmail.querySelector('a');
            const email = emailLink ? emailLink.href : 'mailto:contact.paulyon@gmail.com'; 
            const emailText = emailLink ? emailLink.textContent : 'contact.paulyon@gmail.com'; 
            
            pContactEmail.innerHTML = translations['p-contact-email'][lang] + `<a href="${email}">${emailText}</a> !`;
        }
        
        // 4. Mettre à jour la langue dans le stockage local
        localStorage.setItem('paulyonLang', lang);
    }
    
    // C. Initialisation de la Langue au Chargement
    // Récupère la langue sauvegardée ou utilise le français 'fr' par défaut
    const defaultLang = localStorage.getItem('paulyonLang') || 'fr';
    translatePage(defaultLang);


    // D. Gérer les Clics sur les Options de Langue
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

    // FIN DU DOMContentLoaded
});
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.textContent = '☰';
                languageDropdown.classList.remove('show');
                settingsMenu.classList.remove('show');
            }
        });
    });

    // 4. GESTION DU SOUS-MENU PARAMÈTRES (Niveau 1)
    dropdownToggle.addEventListener('click', (event) => {
        event.preventDefault(); 
        event.stopPropagation();
        
        settingsMenu.classList.toggle('show');
        // Ferme le sous-menu Langue si le menu Paramètres se ferme
        if (!settingsMenu.classList.contains('show')) {
            languageDropdown.classList.remove('show');
        }
    });

    // 5. GESTION DU SOUS-MENU LANGUE (Niveau 2)
    languageToggle.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        
        languageDropdown.classList.toggle('show');
    });

    // 6. FERMER LES MENUS SI L'UTILISATEUR CLIQUE EN DEHORS
    document.addEventListener('click', (event) => {
        // Ferme le menu Paramètres et Langue
        if (!settingsMenu.contains(event.target)) {
            settingsMenu.classList.remove('show');
            languageDropdown.classList.remove('show'); // Sécurité supplémentaire
        }
    });


    // ==========================================================
    // 7. LOGIQUE DE TRADUCTION (DÉFINITION ET APPLICATION)
    // ==========================================================

    // A. Le Dictionnaire de Traduction (Exemple initial)
    const translations = {
        // Titres de page
        'title-tag': { fr: 'PAULYON', en: 'PAULYON', es: 'PAULYON', ht: 'PAULYON' },
        
        // Navigation (Menus)
        'nav-accueil': { fr: 'Accueil', en: 'Home', es: 'Inicio', ht: 'Akèy' },
        'nav-produits': { fr: 'Produits', en: 'Products', es: 'Productos', ht: 'Pwodwi' },
        'nav-services': { fr: 'Services', en: 'Services', es: 'Servicios', ht: 'Sèvis' },
        'nav-contact': { fr: 'Contact', en: 'Contact', es: 'Contacto', ht: 'Kontak' },
        'nav-settings': { fr: 'Paramètres', en: 'Settings', es: 'Ajustes', ht: 'Anviwònman' },
        'nav-language-toggle': { fr: 'Langue', en: 'Language', es: 'Idioma', ht: 'Lang' },

        // Section ACCUEIL
        'h1-accueil': { fr: 'Bienvenue chez PAULYON', en: 'Welcome to PAULYON', es: 'Bienvenido a PAULYON', ht: 'Byenvini nan PAULYON' },
        'p-slogan': { fr: 'Nous offrons des produits et services de haute qualité.', en: 'We offer high-quality products and services.', es: 'Ofrecemos productos y servicios de alta calidad.', ht: 'Nou ofri pwodwi ak sèvis mèyè kalite.' },
        
        // Section PRODUITS
        'h2-produits': { fr: 'Nos Produits', en: 'Our Products', es: 'Nuestros Productos', ht: 'Pwodwi nou yo' },
        'produit-1': { fr: 'Produit 1', en: 'Product 1', es: 'Producto 1', ht: 'Pwodwi 1' },
        'produit-2': { fr: 'Produit 2', en: 'Product 2', es: 'Producto 2', ht: 'Pwodwi 2' },
        'produit-3': { fr: 'Produit 3', en: 'Product 3', es: 'Producto 3', ht: 'Pwodwi 3' },
        
        // Section SERVICES
        'h2-services': { fr: 'Nos Services', en: 'Our Services', es: 'Nuestros Servicios', ht: 'Sèvis nou yo' },
        'service-1': { fr: 'Service 1', en: 'Service 1', es: 'Servicio 1', ht: 'Sèvis 1' },
        'service-2': { fr: 'Service 2', en: 'Service 2', es: 'Servicio 2', ht: 'Sèvis 2' },
        'service-3': { fr: 'Service 3', en: 'Service 3', es: 'Servicio 3', ht: 'Sèvis 3' },

        // Section CONTACT
        'h2-contact': { fr: 'Contactez-nous', en: 'Contact Us', es: 'Contáctanos', ht: 'Kontakte nou' },
        'p-contact-email': { fr: 'Envoyez-nous un message à ', en: 'Send us a message at ', es: 'Envíanos un mensaje a ', ht: 'Voye yon mesaj pou nou nan ' },
        'p-contact-whatsapp': { fr: 'Vous pouvez également nous contacter directement via ', en: 'You can also contact us directly via ', es: 'También puede contactarnos directamente a través de ', ht: 'Ou ka kontakte nou dirèkteman pa ' },
        'input-name': { fr: 'Nom', en: 'Name', es: 'Nombre', ht: 'Non' },
        'input-email': { fr: 'Email', en: 'Email', es: 'Correo', ht: 'Imèl' },
        'input-message': { fr: 'Message', en: 'Message', es: 'Mensaje', ht: 'Mesaj' },
        'btn-submit': { fr: 'Envoyer', en: 'Send', es: 'Enviar', ht: 'Voye' },

        // Pied de page
        'footer-copyright': { fr: '© 2025 PAULYON. Tous droits réservés.', en: '© 2025 PAULYON. All rights reserved.', es: '© 2025 PAULYON. Todos los derechos reservados.', ht: '© 2025 PAULYON. Tout dwa rezève.' },
        'footer-email': { fr: 'Email', en: 'Email', es: 'Correo', ht: 'Imèl' },
        'footer-address': { fr: 'Adresse : [Votre Adresse ici si applicable]', en: 'Address: [Your Address here if applicable]', es: 'Dirección: [Su Dirección aquí si corresponde]', ht: 'Adrès : [Adrès ou isit la si aplikab]' }
    };

    // B. Fonction de Traduction Principale
    function translatePage(lang) {
        // Traduit les éléments avec
