const YOUTUBE_API_KEY = 'AIzaSyDTtnOK5mwYMHxjN6kiy1bGMeqGXdSvCnU'; 
const omdb_key = '99d467c6';
let movieNameRef = document.getElementById("movie-name");
let movieYearRef = document.getElementById("movie-year");
let searchBtn = document.getElementById("search-btn");
let result = document.getElementById("result");

// Function to get the movie trailer from YouTube Data API
async function getMovieTrailer(movieTitle) {
  const youtubeSearchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(movieTitle + ' trailer')}&key=${YOUTUBE_API_KEY}&maxResults=1&type=video`;
  
  try {
    const response = await fetch(youtubeSearchUrl);
    const searchResults = await response.json();
    
    if (searchResults.items && searchResults.items.length > 0) {
      const trailer = searchResults.items[0];
      return `https://www.youtube.com/embed/${trailer.id.videoId}`;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching trailer:', error);
    return null;
  }
}
const getRatingColor = (rating) => {
    if (rating > 8) return 'green';
    if (rating >= 7 && rating < 8) return 'yellow';
    if (rating >= 5 && rating < 7) return 'orange';
    if (rating < 4) return 'red';
    return ''; 
  };

// Function to handle movie search and display
let getMovie = async () => {
  let movieName = movieNameRef.value.trim();
  let movieYear = movieYearRef.value.trim();
  
  if (movieName.length === 0) {
    result.innerHTML = `<h3 class="msg">Please enter a movie name</h3>`;
    return;
  }
  
  searchBtn.textContent = "Searching..."; 
  
  let url = `https://www.omdbapi.com/?t=${encodeURIComponent(movieName)}&y=${movieYear}&plot=full&apikey=${omdb_key}`;
  
  try {
    let response = await fetch(url);
    let data = await response.json();
    
    if (data.Response === "True") {
      let trailerUrl = await getMovieTrailer(movieName);
      let ratingColor = getRatingColor(parseFloat(data.imdbRating));
      
      result.innerHTML = `
        <div class="info">
          <img src="${data.Poster}" class="poster" alt="${data.Title} Poster">
          <div>
            <h2>${data.Title}</h2>
            <div class="rating"style="color: ${ratingColor}">
              <img src="star-yellow-image.png" alt="Star Icon">
              <h4>${data.imdbRating}</h4>
            </div>
            <div class="details"> 
              <span>${data.Released}</span>
              <span>${data.Runtime}</span>
            </div>
            <div class="genre">
              <div>${data.Genre.split(",").join("</div><div>")}</div>
            </div>
            <div class="additional-info">
              <p><strong>Director:</strong> ${data.Director}</p>
              <p><strong>Writer:</strong> ${data.Writer}</p>
              <p><strong>Language:</strong> ${data.Language}</p>
              <p><strong>Country:</strong> ${data.Country}</p>
            </div>
          </div>
        </div>
        <h3>Plot:</h3>
        <p>${data.Plot}</p>
        <h3>Cast:</h3>
        <p>${data.Actors}</p>
        ${trailerUrl ? `<h3>Trailer:</h3><iframe width="550" height="315" src="${trailerUrl}" frameborder="0" allowfullscreen></iframe>` : '<h3>No trailer found</h3>'}
     `;
    } else {
      let trailerUrl = await getMovieTrailer(movieName);
      if (trailerUrl) {
        result.innerHTML = `<h3>No movie details found</h3>
                            <h3>Trailer:</h3>
                            <iframe width="550" height="315" src="${trailerUrl}" frameborder="0" allowfullscreen></iframe>
                            <div style="text-align: center;"><span style="color:green; font-size: 16px;">Click watch on youtube if it also shows Video unavailable</span></div>`; 
      } else {
        result.innerHTML = `<div style="color:red; font-size: 20px;"><h3 class="msg">Movie and trailer not available</h3></div>`;
      }
    }
  } catch (error) {
    console.error('Error fetching movie details:', error);
    result.innerHTML = `<h3 class="msg">Error Occurred. Please try again later.</h3>`;
  } finally {
    searchBtn.textContent = "Search"; 
  }
};

// JavaScript to set background image based on time of day
document.addEventListener("DOMContentLoaded", () => {
  function setBgImage() {
    const now = new Date();
    const hours = now.getHours();
    let bgImage = '';

    if (hours >= 6 && hours < 10) {
      bgImage = './bg_image/morning-image4.jpg'; 
    } else if (hours >= 10 && hours < 17) {
      bgImage ='./bg_image/afternoon-image2.jpg' ;  
    } else if (hours >= 17 && hours < 19) {
      bgImage = './bg_image/evening-image2.gif';  
    } else if (hours >= 19 && hours < 21) {
      bgImage = './bg_image/night-image.jpg';  
    } else {
      bgImage = './bg_image/night-image2.jpg';  
    }

    document.body.style.backgroundImage = `url(${bgImage})`;
  }

  setBgImage();
});

searchBtn.addEventListener("click", getMovie);