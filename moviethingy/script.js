const baseUrlMovies = "http://www.omdbapi.com/";
const accessKey = "206d082e";

const baseUrlBin = "https://api.jsonbin.io/v3/b/";
const ourBinUrl = baseUrlBin + "63aedf5501a72b59f23c67b4";
const masterKeyBin = "$2b$10$re8BCarS2TJ3.fYpy2KSd.d.Gya4h9xv/Kkmio4GmMjsYxCzTFvtu";

const App = {
    listOfMovies: [],
    listOfFavourites: [],
    movieDetails: {},
    elements: {
        container: document.getElementById("movieContainer"),
        favouriteContainer: document.getElementById("favouriteContainer")
    },

    fetchMovies(searchInput) {
        fetch(`${baseUrlMovies}?s=${searchInput}&apikey=${accessKey}`)
            .then(response => response.json()).then(data => {
                console.log(data);
                if (data.Response === "True") {
                    console.log("Sparar resultat i listOfMovies array");
                    App.listOfMovies = data.Search;
                    console.log("Rendera sidan");
                    App.render();
                }
            })
            .catch(error => {
                console.error(error);
            });
    },

    fetchMoviesDetails(selectedMovie) {
        fetch(`${baseUrlMovies}?t=${selectedMovie}&apikey=${accessKey}`)
            .then(response => response.json()).then(data => {
                console.log(data);
                return data;
            })
            .catch(error => {
                console.log("error: " + error);
            });
    },

    createFavourite() {
    },


    removeFavourite() {
    },

    render() {
        this.elements.container.innerHTML = ''
        resetForm()

        App.listOfMovies.forEach(movie => {
            const searchedMovies = document.createElement("div")
            const poster = document.createElement("img");
            const heartButton = document.createElement("button")
            const movieTitle = document.createElement("section");
            const removeHeartButton = document.createElement("button")

            movieTitle.innerHTML = "<h2>" + movie.Title + "</h2>" + "<br>" + "Released: " + movie.Year + "<br>" + "Media type: " + movie.Type;

            poster.src = movie.Poster;
            poster.alt = "Movie Poster";

            poster.classList.add("poster__main")
            movieTitle.classList.add("movie__title")
            searchedMovies.classList.add("movie__container")
            heartButton.classList.add("heart__button")
            removeHeartButton.classList.add("remove__heart")

            poster.onclick = function () {
                window.location.href = "moviedetails.html?parameter=" + movie.imdbID;
            }

            removeHeartButton.style.display = "none";

            let indexToRemove = App.listOfFavourites.findIndex(object => object.imdbID === movie.imdbID);

            console.log("FilmID", movie.imdbID, "Index att ta bort", indexToRemove);


            console.log("Har vi hittat ett film att ta bort?", indexToRemove !== -1);

            if (indexToRemove !== -1) {
                removeHeartButton.style.display = "inline";
                removeHeartButton.style.backgroundColor = "crimson"
                heartButton.style.display = "none";
            }


            heartButton.onclick = function () {
                console.log("Favorites list innan borttagning: ", App.listOfFavourites);
                console.log("borttagna items:", App.listOfFavourites.splice(indexToRemove));
                console.log("Favorites list efter borttagning: ", App.listOfFavourites);
                updateBin({ FavoriteMovies: App.listOfFavourites }).then(x => {
                    heartButton.style.display = "none";
                    console.log("show add button");
                    heartButton.style.display = "inline";
                });
            }

            heartButton.onclick = function () {
                console.log("Före push", App.listOfFavourites);
                App.listOfFavourites.push(movie);
                console.log("Efter push", App.listOfFavourites);
                console.log("Kör PUT mot bin för att lägga in movie");
                updateBin({ FavoriteMovies: App.listOfFavourites })
                heartButton.style.display = "none";
                removeHeartButton.style.display = "inline";
                removeHeartButton.style.color = "crimson"

            }

            console.log("inheållet i favoriter:", App.listOfFavourites);

            searchedMovies.append(
                poster, 
                movieTitle,
                heartButton,
                removeHeartButton

            )
            this.elements.container.appendChild(searchedMovies)
        });
    }

}



async function getFavoritesAsync() {
    //Ladda in favoriter i arrayn
    console.log("App.listOfFavorites är tom: ", App.listOfFavourites);
    getBinData().then(data => {
        console.log("Returned data from fetch then: ", data);
        const tempOfFavorites = data;
        console.log("Nu ser temparrayn ut såhär: ", tempOfFavorites);
        App.listOfFavourites = tempOfFavorites.record.FavoriteMovies;
        console.log("Innehållet i App.listOfFavorites:", App.listOfFavourites);
    });
}


function search() {
    const inputValue = document.getElementById("inputField").value;
    console.log("Kolla här är det du sökte efter: " + inputValue);
    App.fetchMovies(inputValue);
    btnAnimation()
    // App.createFavourite()
}


function resetForm() {
    document.querySelector("#movieContainer").value = ''

}

async function fetchMoviesDetailsAsync(selectedMovie) {
    const response = await fetch(baseUrlMovies + "?i=" + selectedMovie + "&apikey=" + accessKey);
    const data = await response.json();
    return data;
}

async function updateBin(data) {
    // Set the options for the PATCH request
    const options = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "X-Master-Key": masterKeyBin  // Use "X-Master-Key" or "X-Access-Key" depending on the API
        },
        body: JSON.stringify(data)
    };
    // Make the request to the API
    const response = await fetch(ourBinUrl, options);
    // Get the response as a JSON object
    const json = await response.json();
    // Print the response
    console.log(json);
}


async function getBinData() {
    // Set the options for the PATCH request
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-Master-Key": masterKeyBin  // Use "X-Master-Key" or "X-Access-Key" depending on the API
        }
    };
    // Make the request to the API
    const response = await fetch(ourBinUrl, options);
    // Get the response as a JSON object
    const json = await response.json();
    // Print the response
    console.log(json);
    return json;
}


function btnAnimation() {
    let activeButton = document.querySelector(".button__search");
    activeButton.classList.add("pressed");
    setTimeout(function () {
        activeButton.classList.remove("pressed");
    }, 200);
}



const matches = document.querySelectorAll("div.note, div.alert")

console.log("these are the divs:" + matches)