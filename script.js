let currentIndex = 0;
const movies = document.querySelectorAll('.movie');
const totalMovies = movies.length;
const carouselInner = document.querySelector('.carousel-inner');

function showMovie(index) {
    const offset = -index * 320; // Ajuste si la largeur des films change
    carouselInner.style.transform = `translateX(${offset}px)`;
}

// Gestion des boutons "next" et "prev"
document.querySelector('.next').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % totalMovies;
    showMovie(currentIndex);
});

document.querySelector('.prev').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + totalMovies) % totalMovies;
    showMovie(currentIndex);
});

// Gestion des boutons "Détails"
const detailsButtons = document.querySelectorAll('.details-btn');
const detailsText = document.getElementById('details-text');

detailsButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        const movieDetails = movies[index].getAttribute('data-details');
        detailsText.textContent = movieDetails;
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const movieList = document.getElementById("movie-list");
    const detailsText = document.getElementById("details-text");
    const reservationForm = document.getElementById("reservation-form");
    let selectedFilmId = null;

    // Charger les films depuis le serveur
    fetch("films.php")
        .then(response => response.json())
        .then(data => {
            data.forEach(film => {
                const movieDiv = document.createElement("div");
                movieDiv.className = "movie";
                movieDiv.innerHTML = `
                    <img src="${film.image}" alt="${film.titre}">
                    <h3>${film.titre}</h3>
                    <div class="button-container">
                        <button class="details-btn" data-id="${film.id}">Détails</button>
                        <button class="reserve-btn" data-id="${film.id}">Réserver</button>
                    </div>
                `;
                movieList.appendChild(movieDiv);
            });
        });

    // Afficher les détails du film
    movieList.addEventListener("click", (e) => {
        if (e.target.classList.contains("details-btn")) {
            const filmId = e.target.dataset.id;
            const filmDiv = e.target.closest(".movie");
            detailsText.innerText = `Détails : ${filmDiv.querySelector('h3').innerText}`; // Détails à ajouter ici
            selectedFilmId = filmId;
            reservationForm.style.display = "block";
        }

        // Réserver le film
        if (e.target.classList.contains("reserve-btn")) {
            const filmId = e.target.dataset.id;
            selectedFilmId = filmId;
            reservationForm.style.display = "block";
        }
    });

    // Soumettre le formulaire de réservation
    reservationForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;

        fetch("reserve.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `film_id=${selectedFilmId}&nom=${name}&email=${email}`,
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            reservationForm.reset();
            reservationForm.style.display = "none";
        });
    });
});
// Gestion des boutons "Réserver"
const reserveButtons = document.querySelectorAll('.reserve-btn');

reserveButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        const movieTitle = button.getAttribute('data-movie-title');
        const movieImage = button.getAttribute('data-movie-image');
        const movieDetails = button.getAttribute('data-movie-details');
        
        // Redirection vers la page de réservation avec les détails du film
        window.location.href = `reservation.html?title=${encodeURIComponent(movieTitle)}&image=${encodeURIComponent(movieImage)}&details=${encodeURIComponent(movieDetails)}`;
    });
});
document.querySelector('.carousel-inner').addEventListener('click', function(event) {
    if (event.target.classList.contains('reserve-btn')) {
        const filmId = event.target.getAttribute('data-movie-id');
        localStorage.setItem('selectedFilmId', filmId);
        window.location.href = 'reservation.html';
    }
});
