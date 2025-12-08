// ==============================
// SCRIPT.JS OPTIMISÉ — PAULYON 2025
// ==============================

document.addEventListener("DOMContentLoaded", () => {
    // ==============================
    // 1. SELECTEURS PRINCIPAUX
    // ==============================
    const nav = document.getElementById("main-nav");
    const menuToggle = document.querySelector(".menu-toggle");
    const searchToggleBtn = document.getElementById("search-toggle-btn");
    const searchContainer = document.getElementById("search-container");
    const searchInput = document.getElementById("search-input");
    const backdrop = createBackdrop();
    const dropdowns = document.querySelectorAll(".dropdown");

    // ==============================
    // 2. BACKDROP MOBILE
    // ==============================
    function createBackdrop() {
        const b = document.createElement("div");
        b.classList.add("mobile-backdrop");
        document.body.appendChild(b);
        return b;
    }
    function showBackdrop() { backdrop.classList.add("visible"); }
    function hideBackdrop() { backdrop.classList.remove("visible"); }

    // ==============================
    // 3. MENU MOBILE
    // ==============================
    menuToggle?.addEventListener("click", () => {
        const expanded = menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute("aria-expanded", !expanded);
        nav?.classList.toggle("active");
        if (!expanded) showBackdrop(); else hideBackdrop();
    });

    backdrop.addEventListener("click", closeAllMenus);

    // ==============================
    // 4. DROPDOWNS MOBILE & DESKTOP
    // ==============================
    dropdowns.forEach(drop => {
        const toggle = drop.querySelector(".dropdown-toggle");
        const content = drop.querySelector(".dropdown-content");

        // Mobile click
        toggle?.addEventListener("click", e => {
            if (window.innerWidth > 900) return;
            e.preventDefault();
            e.stopPropagation();
            closeAllMenus(drop);
            content?.classList.toggle("show");
        });

        // Desktop hover
        drop.addEventListener("mouseenter", () => {
            if (window.innerWidth <= 900) return;
            content?.classList.add("show");
        });
        drop.addEventListener("mouseleave", () => {
            if (window.innerWidth <= 900) return;
            content?.classList.remove("show");
        });
    });

    function closeAllMenus(exception = null) {
        dropdowns.forEach(d => {
            if (d !== exception) d.querySelector(".dropdown-content")?.classList.remove("show");
        });
        nav?.classList.remove("active");
        menuToggle?.setAttribute("aria-expanded", "false");
        hideBackdrop();
    }

    document.addEventListener("click", e => {
        if (!e.target.closest("header")) closeAllMenus();
    });

    // ==============================
    // 5. BARRE DE RECHERCHE
    // ==============================
    searchToggleBtn?.addEventListener("click", () => {
        const expanded = searchToggleBtn.getAttribute("aria-expanded") === "true";
        searchToggleBtn.setAttribute("aria-expanded", !expanded);
        searchContainer?.classList.toggle("active");
        if (!expanded) searchInput?.focus();
    });

    // ==============================
    // 6. TRADUCTIONS MULTILINGUES
    // ==============================
    let translations = {};
    let currentLanguage = "fr";

    fetch("traduction.json")
        .then(res => res.json())
        .then(data => {
            translations = data;
            setLanguage(currentLanguage);
        })
        .catch(err => console.error("Erreur chargement traductions:", err));

    function setLanguage(lang) {
        currentLanguage = lang;

        // Texte
        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.getAttribute("data-i18n");
            if(translations[lang]?.[key]) el.innerHTML = translations[lang][key];
        });

        // Placeholder
        document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
            const key = el.getAttribute("data-i18n-placeholder");
            if(translations[lang]?.[key]) el.placeholder = translations[lang][key];
        });

        renderCart(); // Réaffiche le panier si nécessaire
    }

    const languageDropdown = document.querySelector(".dropdown-language .language-content");
    languageDropdown?.addEventListener("click", e => {
        if (e.target.tagName.toLowerCase() === "a") {
            e.preventDefault();
            const langCode = e.target.getAttribute("data-lang");
            setLanguage(langCode);
            closeAllMenus();
        }
    });

    // ==============================
    // 7. PANIER + WHATSAPP
    // ==============================
    let cart = [];
    const whatsappNumber = "+50912345678";

    function renderCart() {
        const zone = document.getElementById("cart-zone");
        if (!zone) return;

        if (cart.length === 0) {
            zone.innerHTML = translations[currentLanguage]?.["alert-cart-empty"] || "Votre panier est vide.";
            return;
        }

        zone.innerHTML = cart
            .map(item => `<p>${item.name} — ${item.price} HTG</p>`)
            .join("");
    }

    window.addToCart = function(name, price) {
        cart.push({ name, price });
        alert(`${name} ${translations[currentLanguage]?.["alert-cart-add"] || "a été ajouté au panier !"}`);
        renderCart();
    }

    window.orderWhatsApp = function() {
        if (cart.length === 0) return alert(translations[currentLanguage]?.["alert-cart-empty"]);

        const items = cart.map(i => `${i.name} — ${i.price} HTG`).join("\n");
        const message = (translations[currentLanguage]?.["whatsapp-msg-intro"] || "Bonjour, je souhaite commander :\n") +
                        items +
                        "\n" +
                        (translations[currentLanguage]?.["whatsapp-msg-total"] || "Total : ") +
                        cart.reduce((sum, i) => sum + i.price, 0) +
                        "\n" +
                        (translations[currentLanguage]?.["whatsapp-msg-thanks"] || "Merci !");
        const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    }

    // ==============================
    // 8. RESPONSIVE
    // ==============================
    window.addEventListener("resize", () => {
        if (window.innerWidth > 900) hideBackdrop();
        closeAllMenus();
    });
});
