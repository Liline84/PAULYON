export function initCart(DOMElements, translations, dataConfig, currentLanguage, renderCart) {
    let cart = [];

    // Ajoute un produit au panier
    function addToCart(name, price) {
        cart.push({ name, price });
        const currentTranslation = translations[currentLanguage] || translations["fr"];
        console.log(`name{currentTranslation["alert-cart-add"] || "a été ajouté au panier !"}`);
        renderCartUI();
    }

    // Rend le panier dans la zone dédiée
    function renderCartUI() {
        if (!DOMElements.cartZone) return;
        const currentTranslation = translations[currentLanguage] || translations["fr"];
        const currency = dataConfig.generalSettings.currentCurrency || '';

        if (cart.length === 0) {
            DOMElements.cartZone.innerHTML = `<p>currentTranslation["alert-cart-empty"] || "Votre panier est vide."</p>`;
            return;
        

        DOMElements.cartZone.innerHTML = cart
            .map(item => `<p>{item.name} — item.price{currency}</p>`)
            .join("");
    }

    // Passe la commande via WhatsApp
    function orderWhatsApp() {const currentTranslation = translations[currentLanguage] || translations["fr"];
        const currency = dataConfig.generalSettings.currentCurrency;
        const whatsappNumber = dataConfig.generalSettings.whatsappNumber.replace('+', '');

        if (cart.length === 0) return alert(currentTranslation["alert-cart-empty"]);

        const items = cart.map(i => `i.name —{i.price} currency`).join("");
        const totalAmount = cart.reduce((sum, i) => sum + i.price, 0);

        const message = (currentTranslation["whatsapp-msg-intro"] || "Bonjour, je souhaite commander :") +
            items +
            "" +
            (currentTranslation["whatsapp-msg-total"] || "Total : ") +
            totalAmount.toFixed(2) + " " + currency +
            "" +
            (currentTranslation["whatsapp-msg-thanks"] || "Merci !");

        const url = `https://wa.me/{whatsappNumber}?text=${encodeURIComponent(message)}`;
        const windowRef = window.open(url, "_blank", "noopener,noreferrer");

        if (windowRef) {
            cart.length = 0;
            renderCartUI();
        } else {
            alert("Veuillez autoriser les pop-ups pour finaliser la commande via WhatsApp.");
        }
    }

    return {
        addToCart,
        renderCart: renderCartUI,
