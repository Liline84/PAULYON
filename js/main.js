import { state } from './state.js';
import { attachNavigationListeners } from './ui.js';
import { setLanguage } from './i18n.js';
import { renderProductCards } from './produits.js';
import { renderServiceCards } from './services.js';
import { applyGeneralSettings } from './parametres.js';
import { addToCart } from './cart.js';

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const headerHTML = await fetch("/header.html").then(res => res.text());
        document.getElementById("header-container").innerHTML = headerHTML;

        const footerHTML = await fetch("/footer.html").then(res => res.text());
        document.getElementById("footer-container").innerHTML = footerHTML;

        const [translations, config] = await Promise.all([
            fetch("/traduction.json").then(res => res.json()),
            fetch("/data.json").then(res => res.json())
        ]);

        state.translations = translations;
        state.dataConfig = config;

        applyGeneralSettings();
        setLanguage(state.currentLanguage);

        renderProductCards();
        renderServiceCards();

        attachNavigationListeners();

    } catch (error) {
        console.error("🔥 ERREUR :", error);
    }
});
