import { state } from './state.js';

export function setLanguage(lang) {
    state.currentLanguage = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.setAttribute('lang', lang); 

    const currentTrans = state.translations[lang] || state.translations["fr"];

    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (currentTrans[key]) {
            let text = currentTrans[key];
            const settings = state.dataConfig.generalSettings;
            // Remplacements dynamiques
            text = text.replace('[YEAR]', settings.copyrightYear || new Date().getFullYear())
                       .replace('[SITE_NAME]', settings.siteName || 'PAULYON')
                       .replace('[EMAIL]', settings.emailContact || 'contact@example.com');
            element.innerHTML = text;
        }
    });
}
