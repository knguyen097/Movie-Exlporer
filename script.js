const API_KEY = '75f58ed3700a7b9d37172c12ac66beed';
const BASE_URL = 'https://api.themoviedb.org/3';

let currentPage = 1;
let totalPages = 1;
let searchQuery = '';
let sortBy = 'popularity.desc';

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('search').addEventListener('input', handleSearch);
    document.getElementById('sort').addEventListener('change', handleSearch);
    document.getElementById('prevPage').addEventListener('click', prevPage);
    document.getElementById('nextPage').addEventListener('click', nextPage);
    fetchMovies();
});

async function fetchMovies(page = 1) {
    const endpoint = searchQuery 
        ? `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}&page=${page}`
        : `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=${sortBy}&page=${page}`;

    try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
        const data = await response.json();
        totalPages = data.total_pages || 1;
        
        renderMovies(data.results);
        updatePaginationText();
    } catch (error) {
        console.error("Failed to fetch movies:", error);
        displayError("Could not fetch movie data. Please try again later.");
    }
}

function renderMovies(movies) {
    const moviesContainer = document.getElementById('movies');
    moviesContainer.innerHTML = '';
    
    if (!movies.length) {
        moviesContainer.innerHTML = '<p>No movies found.</p>';
        return;
    }
    
    movies.forEach(({ title, poster_path, release_date, vote_average }) => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        
        movieCard.innerHTML = `
            <img src="${poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : 
                'https://via.placeholder.com/200x300?text=No+Image'}" alt="${title}">
            <h2>${title}</h2>
            <p>Release Date: ${release_date || 'Unknown'}</p>
            <p>Rating: ${vote_average ?? 'N/A'}</p>
        `;
        
        moviesContainer.appendChild(movieCard);
    });
}

function updatePaginationText() {
    document.getElementById('totalPages').textContent = `Page ${currentPage} of ${totalPages}`;
}

function handleSearch() {
    searchQuery = document.getElementById('search').value.trim();
    sortBy = document.getElementById('sort').value;
    currentPage = 1;
    fetchMovies();
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        fetchMovies(currentPage);
    }
}

function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        fetchMovies(currentPage);
    }
}

function displayError(message) {
    const moviesContainer = document.getElementById('movies');
    moviesContainer.innerHTML = `<p class='error-message'>${message}</p>`;
}
