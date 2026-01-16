// state.js
export const state = {
    translations: {},
    dataConfig: {},
    cart: [],
    currentLanguage: localStorage.getItem('lang') || "fr"
};

// Fonction pour mettre à jour la langue
export function updateLanguageState(lang) {
    state.currentLanguage = lang;
    localStorage.setItem('lang', lang);
}
