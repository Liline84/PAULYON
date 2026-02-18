import { state } from './state.js';

export function addToCart(name, price) {
    state.cart.push({ name, price });
    updateCartUI();
}

export function orderWhatsApp() {
    const settings = state.dataConfig.generalSettings;
    const items = state.cart.map(i => `${i.name} (${i.price})`).join("\n");
    const message = encodeURIComponent(`Bonjour, je souhaite commander :\n${items}`);
    window.open(`https://wa.me/${settings.whatsappNumber.replace('+', '')}?text=${message}`);
}
