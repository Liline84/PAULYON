import { state } from './state.js';

export function addToCart(name, price) {
    state.cart.push({ name, price });
    updateCartUI();
}

export function orderWhatsApp() {
    const settings = state.dataConfig.generalSettings;
    const devise = settings.currentCurrency; // Récupère le "HTG" automatiquement
    
    // Calcule le total (et évite les erreurs si un prix n'est pas un nombre)
    const total = state.cart.reduce((somme, item) => somme + (Number(item.price) || 0), 0);
    
    // Liste les articles avec la devise
    const items = state.cart.map(i => {
        const prixAffiche = i.price ? `${i.price} ${devise}` : "Prix à confirmer";
        return `▪️ ${i.name} - ${prixAffiche}`;
    }).join("\n");
    
    const messageTexte = `Bonjour PAULYON ! 👋\nJe souhaite commander les articles/services suivants :\n\n${items}\n\n*Total estimé : ${total} ${devise}*\n\nMerci d'avance !`;
    const message = encodeURIComponent(messageTexte);
    
    // Nettoie le numéro (+509... devient 509...)
    const cleanNumber = settings.whatsappNumber.replace(/[\s+-]/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${message}`);
}
