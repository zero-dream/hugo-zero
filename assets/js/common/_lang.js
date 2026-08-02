const modal = window.zeroGallery.modal;
const toggleEl = document.getElementById("lang-toggle");

if (toggleEl) {
  toggleEl.addEventListener("click", (event) => {
    const langToggleModal = modal.get("lang-toggle");
    langToggleModal.open();
  });
}
