// produits.js
import { state } from './state.js';

export function renderProductCards() {
    const container = document.querySelector('#products-section .cards-container');
    if (!container || !state.dataConfig.products) return;

    container.innerHTML = state.dataConfig.products.map(product => `
        <div class="card product-card">
            <img src="${product.imagePath}" alt="${product.name}">
            <h3>${product.name}</h3>
            <button class="btn-add-cart" data-name="${product.name}" data-price="${product.price}">
                Commander
            </button>
        </div>
    `).join('');
}
