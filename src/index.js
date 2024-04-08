function getDetails() {
  // Here we fetch film data from server
  fetch("http://localhost:3000/films")
    .then((res) => res.json())
    .then((data) => loadDetails(data)) // Here we load film details once data is fetched
    .catch((error) => console.error("Error fetching films:", error)); // Handle fetch errors
}

function loadDetails(data) {
  const container = document.getElementById("films");
  container.innerHTML = "";

  // We loop through each movie and create list items for them
  data.forEach((movie) => {
    const list = document.createElement("li");
    list.innerText = movie.title;
    container.appendChild(list);

    // We add click event listener to each list item to display movie details
    list.addEventListener("click", () => {
      displayMovieDetails(movie);
    });
  });
}

function displayMovieDetails(movie) {
  // We display movie details in the UI
  const poster = document.getElementById("poster");
  const filmInfo = document.getElementById("film-info");
  const title = document.getElementById("title");
  const runtime = document.getElementById("runtime");
  const showTime = document.getElementById("showtime");
  const ticketsRemaining = document.getElementById("ticket-num");

  // we update the UI with movie details
  poster.src = movie.poster;
  filmInfo.innerText = movie.description;
  title.innerText = movie.title;
  runtime.innerText = `${movie.runtime} minutes`;
  showTime.innerText = `${movie.showtime}`;
  const remainingTickets = movie.capacity - movie.tickets_sold;
  ticketsRemaining.innerText = remainingTickets;

  // Enable or disable buy button based on ticket availability
  buyButton(movie);
  // Set up delete button functionality
  deleteButton(movie);
}

function buyButton(movie) {
  // Set up buy ticket button functionality
  const button = document.getElementById("buy-ticket");

  // Check if tickets are available
  if (movie.tickets_sold >= movie.capacity) {
    button.setAttribute("disabled", "true");
    button.innerText = "Sold Out";
  } else {
    button.removeAttribute("disabled");
    button.innerText = "Buy Ticket";

    // We add an event listener to handle ticket purchase
    button.addEventListener("click", () => {
      // Update ticket count and database
      const ticketsRemaining = document.getElementById("ticket-num");
      let remainingTickets = parseInt(ticketsRemaining.innerText);
      remainingTickets -= 1;
      ticketsRemaining.innerText = remainingTickets;

      //we update the movie database
      movie.tickets_sold += 1;
      //we update the api from this function
      updateDb(movie);
      //we update the movie database to ensure its up to date
      buyButton(movie);
    });
  }
}

function updateDb(movie) {
  // UWe use the put method to update movie data in the database
  fetch(`http://localhost:3000/films/${movie.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(movie), //we convert the object to a json string
  })
    .then((res) => res.json())
    .then((data) => console.log("Movie updated successfully:", data))
    .catch((error) => console.error("Error updating movie:", error)); //we catch any errors that may arise
}

function deleteButton(movie) {
  // Set up delete button functionality
  const delButton = document.getElementById("delete-movie-button");
  delButton.removeAttribute("disabled");
  delButton.addEventListener("click", () => {
    // Delete movie from the database
    fetch(`http://localhost:3000/films/${movie.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => console.log("Movie deleted successfully:", data));

    // Clear movie details from UI
    const poster = document.getElementById("poster");
    const filmInfo = document.getElementById("film-info");
    const title = document.getElementById("title");
    const runtime = document.getElementById("runtime");
    const showTime = document.getElementById("showtime");
    const ticketsRemaining = document.getElementById("ticket-num");

    poster.src = "";
    filmInfo.innerText = "";
    title.innerText = "";
    runtime.innerText = "";
    showTime.innerText = "";
    ticketsRemaining.innerText = "";
  });
}

// Here we fetch film details once the DOM is loaded
document.addEventListener("DOMContentLoaded", getDetails);
