const films = [
  {
    title: "Life Underground",
    description: "A documentary exploring hidden urban spaces.",
    videoSrc: "https://www.youtube.com/embed/Wr0sThI1xys?si=FEwpwpIEHo8pijbf",
    poster: "poster.png"
  },
  
];

function loadFilms() {
  const filmRoll = document.getElementById("filmRoll");
  filmRoll.innerHTML = "";
  
  films.forEach((film) => {
    const card = document.createElement("div");
    card.classList.add("film-card");

    card.innerHTML = `<img src="${film.poster}" alt="${film.title}"><h3>${film.title}</h3>`;

    // Show video modal on click
    card.addEventListener("click", () => {
      showFilm(film);
    });

    filmRoll.appendChild(card);
  });
}

function showFilm(film) {
  document.getElementById("filmTitle").textContent = film.title;
  document.getElementById("filmDescription").textContent = film.description;

  // Embed YouTube video
  const videoContainer = document.getElementById("filmVideoContainer");
  videoContainer.innerHTML = `
    <iframe width="100%" height="400px" src="${film.videoSrc}" frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
  `;

  // Show the modal
  const modal = document.getElementById("filmModal");
  modal.classList.add("active");
}

document.getElementById("closeModal").addEventListener("click", () => {
  const modal = document.getElementById("filmModal");
  modal.classList.remove("active");

  // Remove the iframe when closing to stop playback
  document.getElementById("filmVideoContainer").innerHTML = "";
});

document.addEventListener("DOMContentLoaded", loadFilms);


document.addEventListener("DOMContentLoaded", () => {
  typeText("Welcome to My Film Showcase", "typedTitle", 50, () => {
    typeText("Explore some of my short films and creative works.", "typedDescription", 30);
  });
});

function typeText(text, elementId, speed, callback = null) {
  let i = 0;
  const element = document.getElementById(elementId);
  element.innerHTML = ""; // Clear existing text

  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else if (callback) {
      setTimeout(callback, 500); // Delay before typing next text
    }
  }
  
  type();
}
