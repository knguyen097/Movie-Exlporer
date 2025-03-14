const API_KEY = '75f58ed3700a7b9d37172c12ac66beed';
const BASE_URL = 'https://api.themoviedb.org/3';
let currentPage = 1;
let totalPages = 1;
const maxDate = '2025-03-01';

// Fetch movies from API
async function fetchMovies(page = 1, query = '', sortBy = 'popularity.desc') {
    let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${page}&sort_by=${sortBy}`;

    if (query) {
        url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&page=${page}`;
    }

    try {
        const res = await fetch(url);
        const data = await res.json();
        totalPages = data.total_pages;

        displayMovies(data.results.slice(0, 20)); // Display first 20 movies
        updatePaginationText();
    } catch (error) {
        console.error("Error fetching movies:", error);
    }
}

// Display movies on the page
function displayMovies(movies) {
    const moviesContainer = document.getElementById('movies');
    moviesContainer.innerHTML = '';

    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie-card');
        movieElement.innerHTML = `
            <img src="${movie.poster_path 
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
                : 'https://via.placeholder.com/200x300?text=No+Image'}" 
                alt="${movie.title}">
            <h2>${movie.title}</h2>
            <p>Rating: ${movie.vote_average}</p>
            <p>Release Date: ${movie.release_date ? movie.release_date : 'Unknown'}</p>
        `;
        moviesContainer.appendChild(movieElement);
    });
}

// Update pagination text
function updatePaginationText() {
    document.getElementById('totalPages').textContent = `Page ${currentPage} of ${totalPages}`;
}

// Handle search input
function handleSearch() {
    const query = document.getElementById('search').value;
    const sortBy = document.getElementById('sort').value;
    currentPage = 1; // Reset to first page
    fetchMovies(currentPage, query, sortBy);
}

// Go to previous page
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        fetchMovies(currentPage);
    }
}

// Go to next page
function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        fetchMovies(currentPage);
    }
}

// Event listeners
document.getElementById('search').addEventListener('input', handleSearch);
document.getElementById('prevPage').addEventListener('click', prevPage);
document.getElementById('nextPage').addEventListener('click', nextPage);

// Initial fetch
fetchMovies();
