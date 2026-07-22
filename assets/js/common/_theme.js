const zeroGallery = window.zeroGallery;
const htmlEl = document.documentElement;
const toggleEl = document.getElementById("theme-toggle");
const darkMedia = window.matchMedia("(prefers-color-scheme: dark)");
const themeList = zeroGallery.themeList;

if (toggleEl) {
  toggleEl.addEventListener("click", (event) => {
    const currTheme = zeroGallery.currTheme;
    const nextIndex = (themeList.indexOf(currTheme) + 1) % themeList.length;
    const nextTheme = themeList[nextIndex];
    toggleEl.setAttribute("theme", nextTheme);
    zeroGallery.setTheme(nextTheme);
    zeroGallery.invertProseAll(nextTheme);
  });

  darkMedia.addEventListener("change", (event) => {
    if (htmlEl.classList.contains("auto")) zeroGallery.invertProseAll("auto");
  });
}
