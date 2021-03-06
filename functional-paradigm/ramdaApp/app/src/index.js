const apiKey = require('./apiKey');
const userMoviesService = require('./userMoviesService');
const favoriteMovies = userMoviesService.loadSavedMovies();

function clearMovies() {
  document.getElementById('foundMovies').innerHTML = '';
}

function appendElementToParent(parent, el) {
  document.getElementById(parent).appendChild(el.content.firstElementChild);
}

function createMovieElement(createMovieDetailsTemplate, createElement, movie) {
  const movieDetailTemplate = createMovieDetailsTemplate(movie);
  return createElement(movieDetailTemplate);
}

function displayMovies(createMovieElement,createElement, appendElementToParent, clearMovies, movies, totalResults) {
  clearMovies();
  const moviesWithPoster = movies
    .filter(m => m.poster_path !== null && m.poster_path !== undefined);
  const moviesTemplates = moviesWithPoster.map(createMovieTemplate);
  moviesTemplates.forEach(movie => {
    appendElementToParent('foundMovies', createElement(template));
  });
}

function createMovieTemplate(movie) {
  return `
    <div class="movie" data-movie-id="${movie.id}">
      <p><strong>${movie.original_title}</strong></p>
      <img src="https://image.tmdb.org/t/p/w185${movie.poster_path}" />
      <p>
        <em>Year</em>: ${movie.release_date.substring(0, 4)}
      </p>
    </div>
  `;
}

function movieNotFound(clearMovies) {
  clearMovies();
  const template = `<strong>I'm sorry, we could not found the movie you were looking for<strong>`;
  appendElementToParent('foundMovies', createElement(template));
}

function processSearchResponse(response) {
  if(response.total_results > 0) {
    displayMovies(createMovieTemplate, createElement, appendElementToParent, 
      clearMovies, response.results, response.total_results);
  } else {
    movieNotFound(clearMovies);
  }
}

function createMovieDetailsTemplate(movie) {
  return `
    <div class="movie-detail" data-movie-id="${movie.id}">
      <p><strong>${movie.original_title}</strong></p>
      <img src="https://image.tmdb.org/t/p/w185${movie.poster_path}" />
      <p>
        <em>Genres:</em>
        <ul>
          ${displayGenres(movie.id, movie.genres)}
        </ul>
      </p>
      <p>
        <em>Year</em>: ${movie.release_date.substring(0, 4)}
      </p>
      <p>
        <em>Rating:</em> ${movie.vote_average}
      </p>
      <p>
        <button class="btn-close">Close</button> 
        <button class="btn-favorite" data-movie-title="${movie.title}" data-movie-id="${movie.id}">Add to favorites</button>
      </p>
    </div>
  `;
}

function createElement(template) {
  const el = document.createElement('template');
  el.innerHTML = template;
  return el;
}

function addElementToBody(isElementOnPage, removeElement, el) {
  if (isElementOnPage('movie-detail')) {
    removeElement('movie-detail');
  }

  document.body.appendChild(el.content.firstElementChild);
  $('.movie-detail').animate({
    opacity: 1
  }, 300);
}

function removeElement(className) {
  document.getElementsByClassName(className)[0].remove();
}

function isElementOnPage(className) {
  return document.getElementsByClassName(className).length > 0;
}

function displayGenres(id, genres) {
  let genresList = '';
  genres.forEach(genre => genresList += `<li>${genre.name}</li>`);
  return genresList;
}

function ratingsOptions(r) {
  let ratings = '<option>Rate this movie</option>';
  for(let i = 10; i > 0; i--) {
    ratings += `<option ${i == r ? 'selected' : ''}>${i}</option>`;
  }
  return ratings;
}

function displayFavoriteMovies() {
  document.getElementById('favorites').innerHTML = '';
  for(let movieId of Object.keys(favoriteMovies)) {
    appendElement('favorites', `<li><span>${favoriteMovies[movieId].title}</span> <select class="movie-rating" data-movie-id="${movieId}">${ratingsOptions(favoriteMovies[movieId].rating)}</select> <a href="#" class="remove-favorite" data-movie-id="${movieId}">Remove</a></li>`)
  }
}

$(document).on('click', '.movie img, .movie p', (e) => {
  e.preventDefault();
  const movieDetailsUrl = `https://api.themoviedb.org/3/movie/${$(e.target).closest('.movie').data('movie-id')}?api_key=${apiKey}`;
  $.getJSON(movieDetailsUrl, response => {
    addElementToBody(isElementOnPage, removeElement,
      createMovieElement(createMovieDetailsTemplate, createElement, response));
  });
});

$(document).on('click', 'button[type=submit]', (e) => {
  e.preventDefault();
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${$("#search").val()}`;
  $.getJSON(url, response => {
    processSearchResponse(response);
  });
});

$(document).on('click', '.btn-close', function() {
  $(this).closest('div').animate({ opacity: 0 }, 300, function() {
    $(this).remove();
  });
});

$(document).on('click', '.btn-favorite', function() {
  const movieKey = $(this).data('movie-id');
  if(!favoriteMovies[movieKey]) {
    const title = $(this).data('movie-title');
    favoriteMovies[movieKey] = { title };
    userMoviesService.addFavorite(movieKey, title);
    displayFavoriteMovies();
  }
  $(this).closest('div').animate({ opacity: 0 }, 300, function() {
    $(this).remove();
  });
});

$(document).on('click', '.remove-favorite', function(e) {
  e.preventDefault();
  const movieId = $(this).data('movie-id');
  delete favoriteMovies[movieId];
  userMoviesService.removeFavorite(movieId);
  displayFavoriteMovies();
});

$(document).on('change', '.movie-rating', function() {
  const movieId = $(this).data('movie-id');
  var rating = $(this).val();
  userMoviesService.rateMovie(movieId, rating);
});

window.onload = function() {
  displayFavoriteMovies();
}