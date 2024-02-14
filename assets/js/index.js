'use strict'

// import all components and function

import { sidebar } from "./sidebar.js";
import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";

const pageContent = document.querySelector("[page-content]");



sidebar();


// HOME PAGE SECTION ( top rated , upcoming, Trending movie )

const fetchUrlPageInfo = `?api_key=${api_key}&page=1&include_adult=false`;

const fetchUrlLangInfo = `&sort_by=popularity.desc&with_original_language=`;

const homePageSections = [
      {
            title: "Week Trending Movies...",
            path: `/trending/movie/week${fetchUrlPageInfo}`,
      },
      {
            title: "Telegu Movies...",
            path: `/discover/movie${fetchUrlPageInfo}${fetchUrlLangInfo}te`,
      },
      {
            title: "Tamil Movies...",
            path: `/discover/movie${fetchUrlPageInfo}${fetchUrlLangInfo}ta`,
      },
      {
            title: "Upcoming Movies...",
            path: `/movie/upcoming${fetchUrlPageInfo}`,
      },
      {
            title: "Bollywood Movies...",
            path: `/discover/movie${fetchUrlPageInfo}${fetchUrlLangInfo}hi`,
      },
      {
            title: "Top Rated Movies...",
            path: `/movie/top_rated${fetchUrlPageInfo}`,
      },
];



// fetch all genres eg: [ { "id" : "123" , "name" : "action" }]
//  then  genre formate eg : { 123 : "action" }

const genreList = {
      // create genre string from genre_id eg: [23, 43] -> "Action, Romance".
      asString(genreIdList) {
            let newGenreList = [];

            for (const genreId of genreIdList) {
                  this[genreId] && newGenreList.push(this[genreId]);
                  // this.genreList;
            }
            return newGenreList.join(", ");
      },
};


fetchDataFromServer(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}&include_adult=false`, function ({ genres }) {
      for (const { id, name } of genres) {
            genreList[id] = name;
      }

      fetchDataFromServer(
            `https://api.themoviedb.org/3/movie/popular${fetchUrlPageInfo}`,
            heroBanner
      );

});

const heroBanner = function ({ results: movieList }) {

      const banner = document.createElement("section");
      banner.classList.add("banner");

      banner.ariaLabel = "Popular Movies";

      banner.innerHTML = `
            <div class="banner-slider"></div>

            <div class="slider-control">
                  <div class="control-inner">
                  </div>
            </div>
      `;

      let controlItemIndex = 0;

      for (const [index, movie] of movieList.entries()) {

            const {
                  backdrop_path,
                  title,
                  release_date,
                  genre_ids,
                  overview,
                  poster_path,
                  vote_average,
                  id
            } = movie;

            const sliderItem = document.createElement("div");
            sliderItem.classList.add("slider-item");
            sliderItem.setAttribute("slider-item", "");

            sliderItem.innerHTML = `
                  <img src="${imageBaseURL}w1280${backdrop_path}" loading=${index === 0 ? "eager" : "lazy"}
                  alt="${title}" class="img-cover">

                  <div class="banner-content">

                        <h2 class="heading">${title}</h2>

                        <div class="meta-list">
                              <div class="meta-item">${release_date.split("-")[0]}</div>

                              <div class="meta-item card-badge">${vote_average.toFixed(1)}</div>
                        </div>

                        <p class="genre">${genreList.asString(genre_ids)}</p>

                        <p class="banner-text">
                              ${overview}
                        </p>

                        <a href="./detail.html" class="btn" onclick ="getMovieDetail(${id})">
                              <img src="./assets/images/play_circle.png" width="24" height="24"
                              aria-hidden="true" alt="play circle">

                              <span class="span">Watch Now</span>
                        </a>

                  </div>
            `;

            banner.querySelector(".banner-slider").appendChild(sliderItem);


            const controlItem = document.createElement("button");
            controlItem.classList.add("poster-box", "slider-item");
            controlItem.setAttribute("slider-control", `${controlItemIndex}`);

            controlItemIndex++;

            controlItem.innerHTML = `
                  <img src="${imageBaseURL}w154${poster_path}" loading="lazy" class="img-cover img-zoom"
                  alt=${title} draggable="false">
            `;

            banner.querySelector(".control-inner").appendChild(controlItem);

      }

      pageContent.appendChild(banner);

      addHeroSLide();

      // fetch data from home page sections (top rated, upcoming,trending).

      for (const { title, path } of homePageSections) {
            fetchDataFromServer(
                  `https://api.themoviedb.org/3${path}`,
                  createMovieList,
                  title
            );
      }

}

// HERO slider functionality

const addHeroSLide = function () {

      const sliderItems = document.querySelectorAll("[slider-item]");
      const sliderControls = document.querySelectorAll("[slider-control]");

      let lastSliderItem = sliderItems[0];
      let lastSliderControl = sliderControls[0];

      lastSliderItem.classList.add("active");
      lastSliderControl.classList.add("active");

      const sliderStart = function () {
            lastSliderItem.classList.remove("active");
            lastSliderControl.classList.remove("active");

            // `this` ==> slider-control
            sliderItems[Number(this.getAttribute("slider-control"))].classList.add("active");
            this.classList.add("active");

            lastSliderItem = sliderItems[Number(this.getAttribute("slider-control"))];
            lastSliderControl = this;
      }

      addEventOnElements(sliderControls, "click", sliderStart);

}

const createMovieList = function ({ results: movieList }, title) {

      const movieListElem = document.createElement("section");
      movieListElem.classList.add("movie-list");
      movieListElem.ariaLabel = `${title}`;

      movieListElem.innerHTML = `
            <div class="title-wrapper">
                  <h3 class="title-large">${title}</h3>
            </div>

            <div class="slider-list">
                  <div class="slider-inner"></div>
            </div>
      `;

      for (const movie of movieList) {
            const movieCard = createMovieCard(movie); // Called from movie_card.js

            movieListElem.querySelector(".slider-inner").appendChild(movieCard);
      }

      pageContent.appendChild(movieListElem);

}


search();