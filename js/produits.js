export function initProducts(DOMElements, dataConfig, renderCart, addToCart) 

    function renderProductCards() 
        const container = DOMElements.productCardsContainer;
        if (!container || !dataConfig.products) return;

        container.innerHTML = dataConfig.products.map(product => `
            <div class="card product-card" id="product-{product.id}">
                <div class="card-icon product.colorClass">
                    <i class="{product.iconClass}"></i>
                </div>
                
                <img src="product.imagePath" alt="{product.name}" class="card-img" loading="lazy">
                
                <div class="card-body">
                    <h3>product.name</h3>
                    <p class="card-description">{product.description}</p>
                    
                    <div class="card-footer">
                        <span class="card-price">product.price{dataConfig.generalSettings.currentCurrency}</span>
                        <button class="btn btn-primary btn-add-cart"
data-i18n="btn-order"
                            data-product-name="product.name"
                            data-product-price="{product.price}">
                            Commander
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function attachProductCardListeners() {
        container = DOMElements.productCardsContainer;
        container?.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-add-cart');
            if (btn) {
                const name = btn.getAttribute('data-product-name');
                const price = parseFloat(btn.getAttribute('data-product-price'));
                if (name && !isNaN(price)) {
                    addToCart(name, price);
                }
            }
        });
    }

    return {
        renderProductCards,
        attachProductCardListeners
    };
}
