import { state } from './state.js';
import { attachNavigationListeners, closeAllMenus } from './ui.js';
import { setLanguage } from './i18n.js';
import { renderProductCards } from './produits.js';
import { renderServiceCards } from './services.js';
import { applyGeneralSettings } from './parametres.js';

document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    body.classList.add('preload');

    // 1. Injection du Header
    fetch("header.html")
        .then(response => response.text())
        .then(headerHtml => {
            document.getElementById("header-container").innerHTML = headerHtml;
            
            // 2. Chargement des données JSON
            return Promise.all([
                fetch("traduction.json").then(res => res.json()),
                fetch("data.json").then(res => res.json())
            ]);
        })
        .then(([translationData, configData]) => {
            state.translations = translationData;
            state.dataConfig = configData;

            // 3. Initialisation des composants
            applyGeneralSettings();
            setLanguage(state.currentLanguage);
            renderProductCards();
            renderServiceCards();
            attachNavigationListeners();

            body.classList.remove('preload');
        })
        .catch(err => console.error("Erreur d'initialisation :", err));
});
