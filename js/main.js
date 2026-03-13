import { state } from './state.js';
import { attachNavigationListeners } from './ui.js';
import { setLanguage } from './i18n.js';
import { renderProductCards } from './produits.js';
import { renderServiceCards } from './services.js';
import { applyGeneralSettings } from './parametres.js';
import { addToCart } from './cart.js';

document.addEventListener("DOMContentLoaded", async () => {

    const body = document.body;
    body.classList.add("preload");

    try {

        /* =========================
        1️⃣ Charger le header
        ========================= */

        const headerHTML = await fetch("header.html").then(res => res.text());
        document.getElementById("header-container").innerHTML = headerHTML;


        /* =========================
        2️⃣ Charger les données JSON
        ========================= */

        const [translations, config] = await Promise.all([
            fetch("traduction.json").then(res => res.json()),
            fetch("data.json").then(res => res.json())
        ]);

        state.translations = translations;
        state.dataConfig = config;


        /* =========================
        3️⃣ Initialisation du site
        ========================= */

        applyGeneralSettings();
        setLanguage(state.currentLanguage);

        renderProductCards();
        renderServiceCards();

        attachNavigationListeners();


        /* =========================
        4️⃣ Gestion du panier
        ========================= */

        document.addEventListener("click", (e) => {

            const btn = e.target.closest(".btn-add-cart");
            if (!btn) return;

            const name = btn.dataset.name;
            const price = Number(btn.dataset.price) || 0;

            addToCart(name, price);

        });


    } catch (error) {

        console.error("Erreur d'initialisation du site :", error);

    }

    body.classList.remove("preload");

});
