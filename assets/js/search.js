'use strict';

import { api_key, fetchDataFromServer } from "./api.js";
import { createMovieCard } from "./movie-card.js";

export function search() {

      const searchWrapper = document.querySelector("[search-wrapper]");

      const searchField = document.querySelector("[search-field]");

      const searchResultModel = document.createElement("div");
      searchResultModel.classList.add("search-model");
      document.querySelector("main").appendChild(searchResultModel);

      let searchTimeOut;

      searchField.addEventListener("input", function() {

            if(!searchField.value.trim()) {
                  searchResultModel.classList.remove("active");
                  searchWrapper.classList.remove("searching");
                  clearTimeout(searchTimeOut);
                  return;
            }

            // searchWrapper.classList.add("searching");
            clearTimeout(searchTimeOut);

            searchTimeOut = setTimeout( function() {
                  fetchDataFromServer( 
                        `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${searchField.value}&page=1&include_adult=false`,
                        function ({ results : movieList }) {

                              searchWrapper.classList.remove("searching");
                              searchResultModel.classList.add("active");
                              searchResultModel.innerHTML = "" ; // remove previous search...

                              searchResultModel.innerHTML = `
                                    <img src="./assets/images/shape-3.png" class="shape-1 shape-list" alt="shape">

                                                      
                                    <img src="./assets/images/shape-1.png" class="mob-shape-1 mob-shape-list-1" alt="">
                                    <img src="./assets/images/shape-2.png" class="mob-shape-1 mob-shape-2 mob-shape-list-2" alt="">

                                    <p class="label label-1" style="color: white;" >Results for...</p> <br/>

                                    <div class="title-wrapper contain">
                                          <h1 class="heading"> ${searchField.value} </h1>

                                          <h1 class="heading"> ${searchField.value} </h1>
                                    </div>

                                    <div class="movie-list">
                                          <div class="grid-list"></div>
                                    </div>
                              `;

                              for (const movie of movieList) {
                                    const movieCard = createMovieCard(movie);

                                    searchResultModel.querySelector(".grid-list").appendChild(movieCard);
                              }

                        }
                  )
            }, 500)

      });

}



