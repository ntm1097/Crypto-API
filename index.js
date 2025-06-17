let allCoins = [];
let filteredCoins = [];
let selectedMaxPrice = 150000;

document.addEventListener('DOMContentLoaded', () => {
    const top6Link = document.getElementById('top6-link');
    if (top6Link) {
        top6Link.addEventListener('click', (e) => {
            e.preventDefault();
            filteredCoins = allCoins.slice(0, 6); // Assumes allCoins is sorted by market cap
            displayCoins();
        });
    }
});

// Spinner creation (run once on page load)
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('loading-spinner')) {
        const spinner = document.createElement('div');
        spinner.id = 'loading-spinner';
        spinner.innerHTML = '<i class="fa-solid fa-spinner fa-spin"</i>';
        document.body.appendChild(spinner);
    }

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

    // Search bar functionality (hide magnifier and search on Enter)
    const searchInput = document.querySelector('.search__bar--text');
    const magnifier = document.querySelector('.search__bar .fa-magnifying-glass');
    if (searchInput && magnifier) {
        searchInput.addEventListener('input', () => {
            if (searchInput.value.length > 0) {
                magnifier.style.display = 'none';
            } else {
                magnifier.style.display = '';
            }
        });

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                showSpinner();
                setTimeout(() => {
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
                }, 500); // Simulate loading for UX
            }
        });
    }
});

function showSpinner() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) spinner.style.display = 'flex';
}
function hideSpinner() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) spinner.style.display = 'none';
}

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

async function fetchAllCoins() {
    showSpinner();
    try {
        const response = await fetch('https://corsproxy.io/?https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false');
        const data = await response.json();
        if (Array.isArray(data)) {
            allCoins = data;
        } else {
            allCoins = [];
            alert('Failed to load coins. Please try again later.');
        }
        filteredCoins = allCoins;
        handleInitialSearch();
        displayCoins();
    } catch (err) {
        allCoins = [];
        filteredCoins = [];
        alert('Network error. Please try again later.');
    }
    setTimeout(hideSpinner, 600);
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