let allCoins = [];
let filteredCoins = [];
let selectedMaxPrice = 150000;

async function fetchAllCoins() {
    const response = await fetch('https://corsproxy.io/?https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false');
    allCoins = await response.json();
    filteredCoins = allCoins;
    handleInitialSearch();
    displayCoins();
}

function displayCoins() {
    const container = document.getElementById('coin-projects');
    if (!container) return;
    container.innerHTML = '';
    filteredCoins.forEach(coin => {
        const coinDiv = document.createElement('div');
        coinDiv.className = 'coin';
        coinDiv.innerHTML = `
            <figure class="img__wrapper">
                <img class="coin__img" src="${coin.image}" alt="${coin.name}">
            </figure>
            <div class="coin__info">
                <div class="coin__row">
                    <span class="coin__label">Name:</span>
                    <span class="coin__id">${coin.name}</span>
                </div>
                <div class="coin__row">
                    <span class="coin__label">Marketcap:</span>
                    <span class="coin__market--cap">$${coin.market_cap.toLocaleString()}</span>
                </div>
                <div class="coin__row">
                    <span class="coin__label">Current Price:</span>
                    <span class="coin__current--price">$${coin.current_price.toLocaleString()}</span>
                </div>
                <div class="coin__row">
                    <span class="coin__label">24H High:</span>
                    <span class="coin__high">$${coin.high_24h.toLocaleString()}</span>
                </div>
                <div class="coin__row">
                    <span class="coin__label">24H Low:</span>
                    <span class="coin__low">$${coin.low_24h.toLocaleString()}</span>
                </div>
                <div class="coin__row">
                    <span class="coin__label">All Time High:</span>
                    <span class="coin__all-time--high">$${coin.ath.toLocaleString()}</span>
                </div>
            </div>
        `;
        container.appendChild(coinDiv);
    });
}

function filterByPrice(maxPrice) {
    filteredCoins = allCoins.filter(coin => coin.current_price <= maxPrice);
    displayCoins();
}

// Handle search from URL (for landing page redirect)
function handleInitialSearch() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    const searchInput = document.querySelector('.search__bar--text');
    if (searchInput && searchQuery) {
        searchInput.value = searchQuery;
        filteredCoins = allCoins.filter(coin =>
            coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
        );
    } else {
        filteredCoins = allCoins;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchAllCoins();

    // Price range filter
    const priceRange = document.querySelector('.price__range');
    const priceLabel = document.getElementById('price-range-label');
    if (priceRange && priceLabel) {
        priceRange.min = 0;
        priceRange.max = 150000;
        priceRange.value = 150000;

        priceRange.addEventListener('input', (e) => {
            const value = Number(e.target.value);
            priceLabel.textContent = `Price range $0 to $${value.toLocaleString()}`;
            filterByPrice(value);
        });
    }

    // Search bar functionality (works for both direct and redirected search)
    const searchInput = document.querySelector('.search__bar--text');
     searchInput.addEventListener('keydown', (e) => {
     if (e.key === 'Enter') {
        showSpinner();
        setTimeout(() => { // Simulate loading for UX
            const query = searchInput.value.trim().toLowerCase();
            if (query === '') {
                filteredCoins = allCoins;
            } else {
                filteredCoins = allCoins.filter(coin =>
                    coin.name.toLowerCase().includes(query) ||
                    coin.symbol.toLowerCase().includes(query)
                );
            }
            displayCoins();
            hideSpinner();
        }, 500); // 0.5s spinner for effect
    }
});
});