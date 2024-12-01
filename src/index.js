import { fetchImages } from "./pixabay-api";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from "notiflix";
import "regenerator-runtime/runtime";

// Elemente DOM
const form = document.querySelector("#search-form");
const gallery = document.querySelector(".gallery");
const loadMoreButton = document.querySelector(".load-more");

fetchImages("cat")
  .then(data => console.log(data))
  .catch(error => console.error("Error:", error));


// Variabile globale
let currentPage = 1;
let currentQuery = "";
let totalHits = 0;

const lightbox = new SimpleLightbox(".gallery a");

// Funcție pentru afișarea imaginilor
function renderGallery(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
        <div class="photo-card">
          <a href="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
          </a>
          <div class="info">
            <p><b>Likes:</b> ${likes}</p>
            <p><b>Views:</b> ${views}</p>
            <p><b>Comments:</b> ${comments}</p>
            <p><b>Downloads:</b> ${downloads}</p>
          </div>
        </div>`
    )
    .join("");

  gallery.insertAdjacentHTML("beforeend", markup);
  lightbox.refresh();
}

// Resetare galerie
function clearGallery() {
  gallery.innerHTML = "";
}

// Gestionarea formularului de căutare
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  currentQuery = event.target.searchQuery.value.trim();
  currentPage = 1;
  clearGallery();
  loadMoreButton.style.display = "none";

  if (!currentQuery) {
    Notiflix.Notify.failure("Please enter a search query.");
    return;
  }

  try {
    const { hits, totalHits: hitsCount } = await fetchImages(
      currentQuery,
      currentPage
    );
    totalHits = hitsCount;

    if (hits.length === 0) {
      Notiflix.Notify.failure(
        "Sorry, there are no images matching your search query."
      );
      return;
    }

    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    renderGallery(hits);
    if (totalHits > hits.length) {
      loadMoreButton.style.display = "block";
    }
  } catch (error) {
    Notiflix.Notify.failure("Something went wrong. Please try again later.");
  }
});

// Gestionarea butonului "Load More"
loadMoreButton.addEventListener("click", async () => {
  currentPage += 1;

  try {
    const { hits } = await fetchImages(currentQuery, currentPage);
    renderGallery(hits);

    if (currentPage * 40 >= totalHits) {
      loadMoreButton.style.display = "none";
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }

    // Scroll lin
    const { height: cardHeight } = document
      .querySelector(".gallery")
      .firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: "smooth",
    });
  } catch (error) {
    Notiflix.Notify.failure("Something went wrong. Please try again later.");
  }
});
