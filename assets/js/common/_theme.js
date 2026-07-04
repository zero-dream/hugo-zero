const htmlEl = document.documentElement;
const toggleEl = document.getElementById("theme-toggle");
const darkMedia = window.matchMedia("(prefers-color-scheme: dark)");
const themeList = window.hugoGallery.themeList;

if (toggleEl) {
  toggleEl.addEventListener("click", (event) => {
    const currTheme = window.hugoGallery.currTheme;
    const nextIndex = (themeList.indexOf(currTheme) + 1) % themeList.length;
    const nextTheme = themeList[nextIndex];
    toggleEl.setAttribute("theme", nextTheme);
    window.hugoGallery.setTheme(nextTheme);
    window.hugoGallery.invertProseAll(nextTheme);
  });

  darkMedia.addEventListener("change", (event) => {
    if (htmlEl.classList.contains("auto")) window.hugoGallery.invertProseAll("auto");
  });
}
