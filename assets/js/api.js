'use strict'

import { apiKey } from "./apiKey.js";


// Make your api key from TMDB api and paste it here in the place of (const api_key = "here");
const api_key = apiKey;
const imageBaseURL = 'https://image.tmdb.org/t/p/' ;


// fetch data from a server using the and passes
// the result in JSON data to a 'callback' function,
// along with an optional parameter tf has 'optionalParam'

const fetchDataFromServer = function(url, callback, optionalParam) {
      fetch(url)
            .then(response => response.json())
            .then(data => callback(data, optionalParam))
            .catch(err => console.error(err));
}

export { imageBaseURL, api_key, fetchDataFromServer };