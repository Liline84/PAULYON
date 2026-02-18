import { state } from './state.js';

export function applyGeneralSettings() {
    const settings = state.dataConfig.generalSettings;
    if (!settings) return;

    // Exemple : Mettre à jour le titre de l'onglet si nécessaire
    if (settings.siteName) {
        document.title = settings.siteName + " - Lab Hub";
    }

    // On peut ici appliquer des variables CSS dynamiquement si besoin
    // document.documentElement.style.setProperty('--primary-color', settings.themeColor);
}
