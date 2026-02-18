import { state } from './state.js';
import * as ui from './ui.js';
import * as i18n from './i18n.js';
import * as prod from './produits.js';
import * as serv from './services.js';

document.addEventListener("DOMContentLoaded", () => {
    // 1. Injection du Header
    fetch("header.html")
        .then(res => res.text())
        .then(html => {
            document.getElementById("header-container").innerHTML = html;
            return Promise.all([
                fetch("traduction.json").then(res => res.json()),
                fetch("data.json").then(res => res.json())
            ]);
        })
        .then(([trans, data]) => {
            state.translations = trans;
            state.dataConfig = data;

            // 2. Initialisation
            i18n.setLanguage(state.currentLanguage);
            prod.renderProductCards();
            serv.renderServiceCards();
            ui.attachNavigationListeners();
            
            document.body.classList.remove('preload');
        });
});
