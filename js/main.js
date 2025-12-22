document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const headerContainer = document.getElementById("header-container");

    // 0. Ajout de la classe 'preload' pour désactiver les transitions au démarrage
    body.classList.add('preload');

    // Variables globales à charger plus tard
    window.translations = {};
    window.dataConfig = {};
    window.currentLanguage = localStorage.getItem('lang') || "fr";
    window.cart = [];

    // 2. BACKDROP
    const backdrop = document.createElement("div");
    backdrop.classList.add("mobile-backdrop");
    body.appendChild(backdrop);

    window.showBackdrop = () => backdrop.classList.add("visible");
    window.hideBackdrop = () => backdrop.classList.remove("visible");

    // 1. INJECTION DU HEADER : Charger header.html dans le DOM en premier
    fetch("header.html")
        .then(response => {
            if (!response.ok) throw new Error("Erreur de chargement de header.html");
            return response.text();
        })
        .then(headerHtml => {
            headerContainer.innerHTML = headerHtml;
            // Une fois le header injecté, on charge les JSON
return Promise.all([
                fetch("traduction.json").then(res => res.json()),
                fetch("data.json").then(res => res.json())
            ]);
        })
        .then(([translationData, configData]) => {
            window.translations = translationData;
            window.dataConfig = configData;

            // Appel à la fonction d'initialisation principale (à définir dans un autre fichier)
            if (typeof startAppInitialization === "function") {
                startAppInitialization();
            }

            // Retirer la classe 'preload' pour activer les transitions après le chargement
            body.classList.remove('preload');
        })
        .catch(err => console.error("Erreur critique lors du chargement:", err));
});
