let movieNameRef = document.getElementById("movie-name");
let searchBtn = document.getElementById("search-btn");
let result = document.getElementById("result");
let loader = document.getElementById("loader");
let sliding_img=document.getElementById("slidee");

//function to fetch data from api

let getMovie = () => {
    let movieName = movieNameRef.value;
    let url = `http://www.omdbapi.com/?t=${movieName}&apikey=${key}&plot=full`;


    //if input field is empty

    if (movieName.length <= 0) {
        result.innerHTML = `<h3 class="msg">Please enter a movie name </h3>`;
    }

    else {
        
        loader.style.display = "block"; 
         result.innerHTML = "";// Show the loader animation
        fetch(url).then((resp) => resp.json()).then((data) => {
            //if movie exist in database
            if (data.Response == "True") {
               console.log(data);
               let imdbID = data.imdbID;
               console.log(imdbID);
               let tmdbApiKey = tmdb_key;
               let tmdbMovieID = data.imdbID;
                let tmdbUrl = `https://api.themoviedb.org/3/movie/${tmdbMovieID}/similar?api_key=${tmdbApiKey}`;


                result.innerHTML = `
                    <div class="info">
                        <img src=${data.Poster} class="poster">
                        <div>
                            <h2>${data.Title}</h2>
                            <div class="rating">
                                <img src="star-icon.svg">
                                <h4>${data.imdbRating}</h4>
                            </div>
                            <div class="details">
                                <span>${data.Rated}</span>
                                <span>${data.Year}</span>
                                <span>${data.Runtime}</span>
                            </div>
                            <div class="genre">
                                <div>${data.Genre.split(",").join("</div><div>")}</div>
                            </div>
                        </div>
                    </div>
                    <h3>Plot:</h3>
                    <p>${data.Plot}</p>
                    <h3>Cast:</h3>
                    <p>${data.Actors}</p>`;

                fetch(tmdbUrl).then((resp) => resp.json()).then((data) => {
    // Process the response and display similar movies
    if (data.results && data.results.length > 0) {
        sliding_img.innerHTML = "<h3>Similar Movies:</h3>";
      data.results.forEach((movie) => {
        sliding_img.innerHTML += `
        <div class="carousel-item">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" 
                class="poster d-block w-100">
            <h4>${movie.title}</h4>
        </div>
    `;
      });
    }
  })
  .catch(() => {
    console.log("Error fetching similar movies from TMDb.");
  })
  .finally(() => {
    loader.style.display = "none";
  });

            }

            //if movie doesn't exist in database
            else {
                result.innerHTML = `<h3 class="msg">${data.Error}</h3>`;
            }
        })
            //if error occurs
            .catch(() => {
                result.innerHTML = `<h3 class="msg">Error Occured</h3>`;
            })
            .finally(() => {
                loader.style.display = "none"; // Hide the loader animation
            });
    }
};

searchBtn.addEventListener("click", getMovie);
movieNameRef.addEventListener("keypress",function(event)
{
    if(event.key==="Enter")
    {
        event.preventDefault();

        searchBtn.click();
    }
});
window.addEventListener("load", getMovie);