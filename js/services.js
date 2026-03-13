import { state } from './state.js';

export function renderServiceCards() {
    const container = document.querySelector('#services-section .cards-container');
    if (!container || !state.dataConfig.services) return;

    container.innerHTML = state.dataConfig.services.map(service => `
        <div class="data-card service-card">
            <i class="${service.iconClass} ${service.colorClass} icon" style="font-size: 2.5rem; margin-bottom:15px;"></i>
            <h3>${service.title}</h3>
            <p style="font-size: 0.9rem; margin-bottom:15px;">${service.details}</p>
            <span class="badge version-badge">${service.price} ${state.dataConfig.generalSettings.currentCurrency}</span>
            <button class="btn btn-primary btn-add-cart" data-name="${service.title}" data-price="${service.price}" style="margin-top:15px;">
                Réserver via WhatsApp
            </button>
        </div>
    `).join('');
}
