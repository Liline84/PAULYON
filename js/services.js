export function generateServiceMenu(DOMElements, dataConfig) 
    if (!DOMElements.serviceMenuContent || !dataConfig.services) return;

    DOMElements.serviceMenuContent.innerHTML = dataConfig.services.map(service => `
        <li><a href="#service-{service.id}" class="nav-link">${service.title}</a></li>
    `).join('');
}

export function renderServiceCards(DOMElements, dataConfig, translations, currentLanguage) {
    const container = DOMElements.serviceCardsContainer;
    if (!container || !dataConfig.services) return;
    const currency = dataConfig.generalSettings.currentCurrency || ”;
    const currentTrans = translations[currentLanguage] || translations["fr"];

    container.innerHTML = dataConfig.services.map(service => `
        <div class="card service-card{service.status === 'online' ? 'status-online' : 'status-offline'}" id="service-service.id">
            <div class="card-icon{service.colorClass}">
                <i class="service.iconClass"></i>
            </div>
            
            <div class="card-body">
                <h3>{service.title}</h3>
                <p class="card-description">service.details</p>
                
                <div class="card-footer">
                    <span class="card-price">{service.price} currency</span>
                    <span class="card-status status-dot" data-i18n="status-{service.status}">
                        currentTrans[`status-{service.status}`] || (service.status === 'online' ? 'En Ligne' : 'Hors Ligne')}
                    </span>
                </div>
            </div>
        </div>
    `).join('');
}
