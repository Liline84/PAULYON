function generateServiceMenu() {
    if (!DOMElements.serviceMenuContent || !dataConfig.services) return;

    DOMElements.serviceMenuContent.innerHTML = dataConfig.services.map(service => `
        <li><a href="#service-service.id" class="nav-link">{service.title}</a></li>
    `).join('');
}

function renderServiceCards() {
    const container = DOMElements.serviceCardsContainer;
    if (!container || !dataConfig.services) return;

    container.innerHTML = dataConfig.services.map(service => `
        <div class="card service-card service.status === 'online' ? 'status-online' : 'status-offline'" id="service-{service.id}">
            <div class="card-icon service.colorClass">
                <i class="{service.iconClass}"></i>
            </div>
            
            <div class="card-body">
                <h3>service.title</h3>
                <p class="card-description">{service.details}</p>
                
                <div class="card-footer">
<span class="card-price">service.price{dataConfig.generalSettings.currentCurrency}</span>
                    <span class="card-status status-dot" data-i18n="status-service.status">{service.status === 'online' ? 'En Ligne' : 'Hors Ligne'}
                    </span>
                </div>
            </div>
        </div>
    `).join('');
}

// Exporter les fonctions si tu utilises un système de modules (optionnel)
// export { generateServiceMenu, renderServiceCards };
