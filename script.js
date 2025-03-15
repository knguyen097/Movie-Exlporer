const API_KEY = '75f58ed3700a7b9d37172c12ac66beed';
const BASE_URL = 'https://api.themoviedb.org/3';

// Pagination and search variables
let currentPage = 1;
let totalPages = 0;
let searchQuery = '';
let sortBy = 'popularity.desc';

document.addEventListener('DOMContentLoaded', () => {
    // Attachment of event listeners
    document.getElementById('search').addEventListener('input', handleSearch);
    document.getElementById('sort').addEventListener('change', handleSearch);
    document.getElementById('prevPage').addEventListener('click', prevPage);
    document.getElementById('nextPage').addEventListener('click', nextPage);
    
    // Loads movies initially
    fetchMovies(true);
});

async function fetchMovies(isNewQuery = false, page = currentPage) {
    let endpoint;
    
    // Determine if the user is searching or just browsing
    if (searchQuery) {
        endpoint = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}&page=${page}`;
    } else {
        endpoint = `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=${sortBy}&page=${page}`;
    }

    try {
        const response = await fetch(endpoint);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();

        // This will make sure the total pages stays consistent no matter which sorting option
        if (totalPages === 1 || currentPage === 1) {
            totalPages = totalPages > 1 ? totalPages : (data.total_pages || 1);
        }

        renderMovies(data.results);
        updatePaginationText();
    } catch (error) {
        console.error("Failed to fetch movies:", error);
        displayError("Could not fetch movie data. Please try again later.");
    }
}

function renderMovies(movies) {
    const moviesContainer = document.getElementById('movies');
    moviesContainer.innerHTML = ''; // This clears previous results

    if (movies.length === 0) {
        moviesContainer.innerHTML = '<p>No movies found.</p>';
        return;
    }

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');

        // Displays Movie Poster Images
        let posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

        // Ensure release date and rating are displayed correctly
        let releaseDate = movie.release_date ? movie.release_date : 'Unknown';
        let rating = movie.vote_average !== null ? movie.vote_average : 'N/A';

        movieCard.innerHTML = `
            <img src="${posterUrl}" alt="${movie.title}">
            <h2>${movie.title}</h2>
            <p>Release Date: ${releaseDate}</p>
            <p>Rating: ${rating}</p>
        `;

        moviesContainer.appendChild(movieCard);
    });
}

function updatePaginationText() {
    document.getElementById('totalPages').textContent = `Page ${currentPage} of ${totalPages}`;
}

function handleSearch() {
    // Handles Search and Sort Options
    searchQuery = document.getElementById('search').value.trim();
    sortBy = document.getElementById('sort').value;
    currentPage = 1; // Resets the webpage to first page when searching

    fetchMovies(true, currentPage); // Mark as a new search query
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        fetchMovies(false, currentPage); // This is in place so that when a user goes to the previous page, it does not change the total number of pages
    }
}

function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        fetchMovies(false, currentPage); // This is in place so that when a user goes to the next page, it does not change the total number of pages
    }
}

function displayError(message) {
    const moviesContainer = document.getElementById('movies');
    moviesContainer.innerHTML = `<p class='error-message'>${message}</p>`;
}
