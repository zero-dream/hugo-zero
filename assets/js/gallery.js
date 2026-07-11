import params from "@params";
import fjGallery from "lib/flickr-justified-gallery/fjGallery.esm.js";

const galleryEl = document.getElementById("gallery");
if (galleryEl) {
  fjGallery(document.querySelectorAll(".fj-gallery"), {
    itemSelector: ".fj-gallery-item",
    gutter: { horizontal: params.gutterH, vertical: params.gutterV },
    rowHeight: params.rowHeight,
    rowHeightTolerance: params.rowHeightTolerance,
  });
  galleryEl.classList.remove("hidden");
}
