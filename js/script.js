document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    body.classList.add('preload');

    const headerContainer = document.getElementById("header");

    // Injecter le header
    fetch("header.html")
        .then(res => res.text())
        .then(data => {
            headerContainer.innerHTML = data;

            // Lancer l'app une fois le header chargé
            if (typeof runMainAppLogic === 'function') {
                runMainAppLogic();
            }
        })
        .catch(err => console.error("Erreur d'injection du header:", err));

    // Injecter le footer
    fetch("footer.html")
        .then(res => res.text())
        .then(data => {
            document.getElementById("footer").innerHTML = data;
        })
        .catch(err => console.error("Erreur d'injection du footer:", err));
});
