const bodyEl = document.body;
const headerEl = document.getElementById("header");
const navEl = headerEl.querySelector("nav");
const toggleEl = document.getElementById("menu-toggle");
const menuEl = document.getElementById("menu");

if (toggleEl) {
  toggleEl.addEventListener("click", (event) => {
    event.preventDefault();
    toggleEl.ariaExpanded = !menuEl.classList.contains("visible");
    if (menuEl.classList.contains("visible")) {
      bodyEl.style.overflow = "";
      navEl.classList.add("blur-01");
      menuEl.classList.remove("visible");
      menuEl.style.opacity = "0";
      menuEl.style.transform = "translateY(-20%)";
      menuEl.style.visibility = "hidden";
      menuEl.addEventListener("transitionend", function handler(e) {
        menuEl.removeEventListener("transitionend", handler);
        menuEl.style.display = "none";
      });
    } else {
      bodyEl.style.overflow = "hidden";
      navEl.classList.remove("blur-01");
      menuEl.classList.add("visible");
      menuEl.style.display = "flex";
      menuEl.style.opacity = "0";
      menuEl.style.transform = "translateY(-20%)";
      menuEl.style.visibility = "hidden";
      menuEl.offsetHeight;
      menuEl.style.opacity = "1";
      menuEl.style.transform = "translateY(0%)";
      menuEl.style.visibility = "visible";
    }
  });
}

export {};
