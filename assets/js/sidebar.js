'use strict'

import { api_key , fetchDataFromServer } from "./api.js";


export function sidebar () {

      // fetch all genres eg: [ { "id" : "123" , "name" : "action" }]
      //  then  genre formate eg : { 123 : "action" }

      const genreList = {} ;

      fetchDataFromServer(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`, function({ genres }) {

            for(const { id, name } of genres ) {
                  genreList[id] = name;
            }

            genreLink();

      });

      const sidebarInner = document.createElement("div");
      sidebarInner.classList.add("sidebar-inner");

      sidebarInner.innerHTML = `
            <div class="sidebar-list">

                  <p class="title">Genre</p>

            </div>

            <div class="sidebar-list">

                  <p class="title">Language</p>

                  <a href="./movie-list.html" onclick='getMovieList("with_original_language=en", "English")'  class="sidebar-link" menu-close >English</a>
                  
                  <a href="./movie-list.html" onclick='getMovieList("with_original_language=hi", "Hindi")' class="sidebar-link" menu-close >Hindi</a>

                  <a href="./movie-list.html" onclick='getMovieList("with_original_language=te", "Telugu")'  class="sidebar-link" menu-close >Telugu</a>

                  <a href="./movie-list.html" onclick='getMovieList("with_original_language=ta", "Tamil")'  class="sidebar-link" menu-close >Tamil</a>

                  <a href="./movie-list.html" onclick='getMovieList("with_original_language=ja", "Japanese")'  class="sidebar-link" menu-close >Japanese</a>
                  
                  <a href="./movie-list.html" onclick='getMovieList("with_original_language=pa", "Punjabi")'  class="sidebar-link" menu-close >Punjabi</a>
                  
                  <a href="./movie-list.html" onclick='getMovieList("with_original_language=bn", "Bengali")'  class="sidebar-link" menu-close >Bengali</a>


            </div>

            <div class="sidebar-footer">
                  <p class="copyright">
                        Made By <i class="fa-solid fa-copyright"></i> PRAKHAR-KATIYAR
                        <a href="https://github.com/Prakhar-002">
                              <i class="fa-brands fa-github"></i> Prakhar-002
                        </a>
                  </p>

                  <img src="./assets/images/tmdb-logo.png" width="130" height="17" alt="the movie database logo">
            </div>
      `;

      const genreLink = function() {
            for(const [genreId, genreName] of Object.entries(genreList)) {

                  const link = document.createElement("a");
                  link.classList.add("sidebar-link");
                  link.setAttribute("href", "./movie-list.html");
                  link.setAttribute("menu-close", "");
                  link.setAttribute("onclick" , `getMovieList("with_genres=${genreId}" , "${genreName}")`);

                  link.textContent = genreName;

                  sidebarInner.querySelectorAll(".sidebar-list")[0].appendChild(link);

            }

            const sidebar = document.querySelector("[sidebar]");
            sidebar.appendChild(sidebarInner);

            toggleSidebar(sidebar);

      }


      const toggleSidebar = function(sidebar) {

            // TOGGLE sidebar in mobile screen

            const sidebarBtn = document.querySelector("[menu-btn]");

            const sidebarTogglers = document.querySelectorAll("[menu-toggler]");

            const sidebarClose = document.querySelectorAll("[menu-close]");

            const overlay = document.querySelector("[overlay]");

            addEventOnElements(sidebarTogglers, "click", function() {
                  sidebar.classList.toggle("active");
                  sidebarBtn.classList.toggle("active");
                  overlay.classList.toggle("active");
            });

            addEventOnElements(sidebarClose, "click", function() {
                  sidebar.classList.remove("active");
                  sidebarBtn.classList.remove("active");
                  overlay.classList.remove("active");
            });
      }

}