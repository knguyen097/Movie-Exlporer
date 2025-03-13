const API_KEY = '75f58ed3700a7b9d37172c12ac66beed';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/500x750?text=No+Image'; // Placeholder for missing images
const movieContainer = document.getElementById('movie-container');
const searchInput = document.getElementById('search');
const sortSelect = document.getElementById('sort');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const pageNumber = document.getElementById('page-number');
let currentPage = 1;
let totalPages = 1;
const moviesPerPage = 20; // Ensuring full pages

// Fetch Movies
async function fetchMovies(page = 1, query = '', sortBy = 'release_date') {
    let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&page=${page}&sort_by=${sortBy}.desc&primary_release_date.lte=2025-12-31`;
    if (query) {
        url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&language=en-US&page=${page}&primary_release_date.lte=2025-12-31`;
    }
    const response = await fetch(url);
    if (!response.ok) {
        console.error('Error fetching data:', response.statusText);
        return;
    }
    const data = await response.json();
    totalPages = data.total_pages;
    displayMovies(data.results);
    updatePageNumber();
}

// Display Movies
function displayMovies(movies) {
    movieContainer.innerHTML = '';
    if (movies.length === 0) {
        movieContainer.innerHTML = '<p>No movies found.</p>';
        return;
    }
    let displayedMovies = movies.filter(movie => new Date(movie.release_date).getFullYear() <= 2025).slice(0, moviesPerPage); // Ensure full page fill
    while (displayedMovies.length < moviesPerPage) {
        displayedMovies.push({ placeholder: true }); // Add placeholders if needed
    }
    displayedMovies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');
        if (movie.placeholder) {
            movieElement.innerHTML = `<div class='placeholder'>No Movie</div>`;
        } else {
            const moviePoster = movie.poster_path ? IMAGE_URL + movie.poster_path : PLACEHOLDER_IMAGE;
            movieElement.innerHTML = `
                <img src="${moviePoster}" alt="${movie.title}">
                <h3>${movie.title}</h3>
                <p>Release: ${movie.release_date}</p>
                <p>Rating: ${movie.vote_average}</p>
            `;
        }
        movieContainer.appendChild(movieElement);
    });
}

// Update Page Number
function updatePageNumber() {
    pageNumber.textContent = `Page ${currentPage} of ${totalPages}`;
}

// Event Listeners
searchInput.addEventListener('input', () => {
    fetchMovies(1, searchInput.value, sortSelect.value);
});

sortSelect.addEventListener('change', () => {
    fetchMovies(currentPage, searchInput.value, sortSelect.value);
});

prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchMovies(currentPage, searchInput.value, sortSelect.value);
    }
});

nextButton.addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        fetchMovies(currentPage, searchInput.value, sortSelect.value);
    }
});

// Initial Fetch
fetchMovies();
