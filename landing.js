document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search__bar--text');
    const magnifier = document.querySelector('.search__bar .fa-magnifying-glass');
    const coin = document.getElementById('rolling-coin');
    let hasRolled = false;

    // Hide/show magnifier as user types
    if (searchInput && magnifier) {
        searchInput.addEventListener('input', () => {
            if (searchInput.value.length > 0) {
                magnifier.style.display = 'none';
            } else {
                magnifier.style.display = '';
            }
        });
    }

    // Search on Enter (redirect to pricing page)
    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    window.location.href = `pricing.html?search=${encodeURIComponent(query)}`;
                }
            }
        });
    }

    
    if (searchInput && coin) {
        searchInput.addEventListener('focus', () => {
            if (!hasRolled) {
                coin.classList.add('rolling');
                hasRolled = true;
                setTimeout(() => {
                    coin.classList.add('spinning');
                }, 2000); // 2s matches your left transition duration
            }
        });
    }
});