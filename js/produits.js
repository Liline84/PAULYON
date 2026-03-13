import { state } from './state.js';

export function renderProductCards() {
    const container = document.querySelector('#products-section .cards-container');
    if (!container || !state.dataConfig.products) return;

    container.innerHTML = state.dataConfig.products.map(product => `
        <div class="data-card product-card">
            <i class="${product.iconClass} ${product.colorClass} icon"></i>
            <img src="${product.imagePath}" alt="${product.name}" style="width:100%; border-radius:8px; margin-bottom:15px;">
            <h3>${product.name}</h3>
            <span class="badge version-badge">${product.price || 'À confirmer'} ${state.dataConfig.generalSettings.currentCurrency}</span>
            <button class="btn btn-primary btn-add-cart" data-name="${product.name}" data-price="${product.price || 0}" style="margin-top:15px;">
                <i class="fa-solid fa-cart-plus"></i> Ajouter
            </button>
        </div>
    `).join('');
}
