const bodyEl = document.body;
const navbarEl = document.getElementById("main-navbar");
const toggleEl = document.getElementById("menu-toggle");
const menuEl = document.getElementById("main-menu");

if (toggleEl) {
  let savedBodyOverflow;
  let closeTransitionHandler;

  const removeCloseTransitionHandler = () => {
    if (closeTransitionHandler) {
      menuEl.removeEventListener("transitionend", closeTransitionHandler);
      closeTransitionHandler = null;
    }
  };

  const openMenu = () => {
    removeCloseTransitionHandler();
    savedBodyOverflow = bodyEl.style.overflow;
    bodyEl.style.overflow = "hidden";
    navbarEl.classList.remove("blur-01");
    menuEl.classList.add("visible");
    menuEl.style.display = "flex";
    menuEl.style.opacity = "0";
    menuEl.style.transform = "translateY(-10%)";
    menuEl.style.visibility = "hidden";
    void menuEl.offsetHeight;
    menuEl.style.opacity = "1";
    menuEl.style.transform = "translateY(0%)";
    menuEl.style.visibility = "visible";
  };

  const closeMenu = () => {
    removeCloseTransitionHandler();
    bodyEl.style.overflow = savedBodyOverflow;
    navbarEl.classList.add("blur-01");
    menuEl.classList.remove("visible");
    menuEl.style.opacity = "0";
    menuEl.style.transform = "translateY(-10%)";
    menuEl.style.visibility = "hidden";
    closeTransitionHandler = (event) => {
      if (event.target !== menuEl || event.propertyName !== "opacity") return;
      removeCloseTransitionHandler();
      menuEl.style.display = "none";
    };
    menuEl.addEventListener("transitionend", closeTransitionHandler);
  };

  toggleEl.addEventListener("click", (event) => {
    toggleEl.ariaExpanded = !menuEl.classList.contains("visible");
    if (menuEl.classList.contains("visible")) closeMenu();
    else openMenu();
  });
}
