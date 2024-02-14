'use strict'

import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js";
import { sidebar } from "./sidebar.js";
import { createMovieCard } from "./movie-card.js";
import { movieListTopRated } from "./sampleData.js";
import { search } from "./search.js";

const movieId = window.localStorage.getItem("movieId");

const pageContent = document.querySelector("[page-content]");


sidebar();


const getGenres = function (genreList) {
      const newGenreList = [];

      for (const { name } of genreList) {
            newGenreList.push(name);
      }

      return newGenreList.join(", ");
}

const getCasts = function (castList) {
      const newCastList = [];

      for (let i = 0, len = castList.length; i < len && i < 10; i++) {
            const { name } = castList[i];

            newCastList.push(name);
      }

      return newCastList.join(", ");
}

const getLang = function (langList) {
      const newLangList = [];

      for ( let i = 0, len = langList.length; i < len ; i++ ) {
            const { english_name } = langList[i];

            newLangList.push(english_name);
      }

      return newLangList.join(", ");
}

const getDirectors = function (crewList) {
      const directors = crewList.filter(({ job }) => job === "Director");

      const directorList = [];

      for (const { name } of directors) {
            directorList.push(name);
      }

      return directorList.join(", ");
}

// Return only trailers and teasers as array...
const filterVideos = function (videoList) {
      return videoList.filter(({ type, site }) => (type === "Trailer" || type === "Teaser") && (site === "YouTube"));
}

const filterInLang = function({ translations }) {
      return translations.filter(({iso_3166_1}) => (iso_3166_1 == "IN" || iso_3166_1 == "US"));
}



fetchDataFromServer(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}&append_to_response=releases,images,videos,casts,translations&include_adult=false`, function (movie) {

      const {
            backdrop_path,
            poster_path,
            title,
            vote_average,
            release_date,
            runtime,
            releases: {
                  countries: [{ certification }],
            },
            genres,
            overview,
            casts: { cast, crew },
            videos: { results: videos },
            translations
      } = movie;

      let date = release_date.split("-");

      document.title = `${title} - Tvflix`;

      const movieDetail = document.createElement("div");
      movieDetail.classList.add("movie-detail");

      movieDetail.innerHTML = `
                  <div class="backdrop-image " 
                  style="background-image: url('${imageBaseURL}${"w1280" || "original"}${backdrop_path || poster_path}');">
                  </div>

                  <figure class="poster-box movie-poster">
                        <img src="${imageBaseURL}w342${poster_path}" alt="${title}" class="img-cover">
                  </figure>

                  <div class="detail-box">

                        <div class="detail-content">

                              <h1 class="heading">${title}</h1>

                              <div class="meta-list">

                                    <div class="meta-item">
                                          <img src="./assets/images/star.png" width="20" height="20"
                                          alt="rating">

                                          <span class="span">${vote_average.toFixed(1)}</span>
                                    </div>

                                    <div class="separator"></div>

                                    <div class="meta-item"><i class="fa-regular fa-hourglass-half "></i> ${runtime}m</div>

                                    <div class="separator"></div>

                                    <div class="meta-item">${date[0]}</div>

                                    <div class="separator"></div>

                                    <div class="meta-item"><i class="fa-solid fa-stamp"></i></div>

                                    <div class="meta-item card-badge">${certification}</div>

                              </div>

                              <p class="genre">${getGenres(genres)}</p>

                              <p class="overview">
                                    ${overview}
                              </p>

                              <ul class="detail-list">

                                    <div class="list-item">
                                          <p class="list-name">Starring</p>

                                          <p class="detail-para">
                                                ${getCasts(cast)}
                                          </p>
                                    </div>

                                    <div class="list-item">
                                          <p class="list-name">Released on</p>

                                          <p class="detail-para">
                                                ${date[2]}-${date[1]}-${date[0]}
                                          </p>
                                    </div>

                                    <div class="list-item" providers >
                                          <p class="list-name">Watch On </p>

                                          <p class="detail-para" providers-p>
                                                Not Available
                                          </p>
                                    </div>

                                    <div class="list-item" providers >
                                          <p class="list-name">In Language </p>

                                          <p class="detail-para" providers-p>
                                                ${getLang(filterInLang(translations))}
                                          </p>
                                    </div>

                                    <div class="list-item">
                                          <p class="list-name">Directed By</p>

                                          <p class="detail-para">
                                                ${getDirectors(crew)}
                                          </p>
                                    </div>

                              </ul>
                        </div>

                        <div class="title-wrapper">
                              <h3 class="title-large">Trailers and Clips...</h3>
                        </div>

                        <div class="slider-list">
                              <div class="slider-inner"></div>
                        </div>
                  </div>
            `;


      for (const { key, name } of filterVideos(videos)) {
            
            const videoCard = document.createElement("div");
            videoCard.classList.add("video-card");

            videoCard.innerHTML = `
                  <iframe src="https://www.youtube.com/embed/${key}" 
                  frameborder="0" 
                  allowfullscreen="1" 
                  title="${name}" 
                  class="img-cover" 
                  loading="lazy"
                  width="500" 
                  height="294" >
                  </iframe>
                  `;

            movieDetail.querySelector(".slider-inner").appendChild(videoCard);
      }

      pageContent.appendChild(movieDetail);

      fetchDataFromServer(
            `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${api_key}&page=1&include_adult=false`,
            addSuggestedMovies
      );

      fetchDataFromServer (
            `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${api_key}`, 
            getProviderDetails
      );
});

const addSuggestedMovies = function ({ results: movieList }, title) {

      if (movieList.length == 0) {
            movieList = movieListTopRated();
      }

      const movieListElem = document.createElement("section");
      movieListElem.classList.add("movie-list");
      movieListElem.ariaLabel = "You May Also Like";

      movieListElem.innerHTML = `
            <div class="title-wrapper">
                  <h3 class="title-large">You May Also Like...</h3>
            </div>

            <div class="slider-list">
                  <div class="slider-inner"></div>
            </div>
      `;

      for (const movie of movieList) {
            // Called from movie_card.js
            const movieCard = createMovieCard(movie);

            movieListElem.querySelector(".slider-inner").appendChild(movieCard);
      }
      pageContent.appendChild(movieListElem);
};

const getProviderDetails = function ( { results } ) {

      const  {
            flatrate : [
                  {
                        logo_path,
                        provider_name
                  }
            ]
      } = results.IN;

      const p = document.querySelector("[providers-p]");

      p.innerHTML = `
            ${provider_name}
      `;
}


search();