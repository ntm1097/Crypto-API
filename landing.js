document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search__bar--text');
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

    
    
});