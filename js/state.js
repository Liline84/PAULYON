// État global de l'application
export const state = {
    translations: {},
    dataConfig: {},
    currentLanguage: localStorage.getItem('lang') || "fr",
    cart: []
};
