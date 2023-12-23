// API Key
const API_KEY = "35a13243cc51617756240cd4b86cae9d";
const baseURL = "https://image.tmdb.org/t/p/w500";

// API Path
const apiPaths = {
    searchMovie: (query) => `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${API_KEY}`,
    findGenres: `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`
}

const searchInput = document.querySelector('.input-field input');
const searchMovieListContainer = document.querySelector('.search-movie-list-container');
const movieContainer = document.querySelector('.movie-container');

const findGenres = (genre_ids) => {
    const genres = [];

    const res = fetch(apiPaths.findGenres);
    
    return res
    .then(res => res.json())
    .then(res => {
        genre_ids.forEach(genre_id => {
            for(let obj of res.genres) {
                if(genre_id == obj.id) {
                    genres.push(obj.name);
                    break;
                }
            }
        });
        return genres;
    })
    .catch(error => {
        console.log(error);
    })
};

const clearGenresList = (genresList) => {
    Array.from(genresList.children).forEach(children => {
        children.remove();
    });
};

const showMovieDetails = (movieObj) => {
    return (e) => {
        const movieImageURL = baseURL + movieObj.poster_path;
        const movieName = movieObj.title;
        const releaseYear = "(" + movieObj.release_date.substring(0,4) + ")";
        const originalTitle = movieObj.original_title;
        const ratings = movieObj.vote_average.toFixed(1);
        const movieDescription = movieObj.overview;

        const movieImageElement = document.querySelector('.movie-details-container .movie-image img');
        const movieNameElement = document.querySelector('.movie-details-container .movie-details .movie-name');
        const releaseYearElement = document.querySelector('.movie-details-container .movie-details .movie-year');
        const originalTitleElement = document.querySelector('.movie-details-container .movie-details .movie-original-name span');
        const ratingsElement = document.querySelector('.movie-details-container .movie-details .ratings span');
        const movieDescriptionElement = document.querySelector('.movie-details-container .movie-details .description');
        const genresList = document.querySelector('.movie-details-container .movie-details .genres .genres-list');

        movieImageElement.src = movieImageURL;
        movieNameElement.textContent = movieName;
        releaseYearElement.textContent = releaseYear;
        originalTitleElement.textContent = originalTitle;
        ratingsElement.textContent = ratings;
        movieDescriptionElement.textContent = movieDescription;
        const res = findGenres(movieObj.genre_ids.slice(0,5));
        res
        .then(genres => {
            clearGenresList(genresList);
            genres.forEach(genre => {
                const li = document.createElement('li');
                li.textContent = genre;
                genresList.appendChild(li);
            });
        })
        .catch(error => {
            console.log(error);
        })

        movieContainer.style.display = "block";
        searchMovieListContainer.style.display = "none";
        clearSearchMovieListContainer();
        searchInput.value = "";
    }
};

const clearSearchMovieListContainer = () => {
    Array.from(searchMovieListContainer.children).forEach(children => {
        children.remove();
    });
};

const buildSearchMovieList = (moviesList) => {
    if(searchInput.value !== "") {
        searchMovieListContainer.style.display = "block";
    }
    else {
        searchMovieListContainer.style.display = "none";
    }

    clearSearchMovieListContainer();

    moviesList.forEach(movie => {
        const p = document.createElement('p');
        p.textContent = movie.title;
        searchMovieListContainer.appendChild(p);

        p.addEventListener('click', showMovieDetails(movie));
    });
}

const searchMovie = (e) => {
    const res = fetch(apiPaths.searchMovie(searchInput.value));

    res
    .then(res => res.json())
    .then(res => {
        buildSearchMovieList(res.results.slice(0,10));
    })
    .catch(error => {
        console.log(error);
    });
};

searchInput.addEventListener('input', searchMovie);