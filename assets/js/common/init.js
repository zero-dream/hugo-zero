/*! hugo-gallery | https://github.com/zero-dream/hugo-gallery */

import params from "@params";

// Params

const themeList = ["auto", "light", "dark"];

const buildTime = params.buildTime;
const defaultTheme = params.defaultTheme;

// Window

zeroGallery = window.zeroGallery = {};
zeroGallery.buildTime = buildTime;
zeroGallery.defaultTheme = defaultTheme;
zeroGallery.themeList = themeList;

// ZeroTmp

window.zeroTmp = {};
window.zeroTmp.var = {};

window.zeroTmp.modal = {};
window.zeroTmp.modal.list = {};

// ClearLocalStorage

const prevBuildTime = localStorage.getItem("buildTime") || 0;
if (prevBuildTime < buildTime) {
  localStorage.clear();
  localStorage.setItem("buildTime", buildTime);
}

// SetTheme

const htmlEl = document.documentElement;
const setTheme = (theme) => {
  zeroGallery.currTheme = theme;
  localStorage.setItem("currTheme", theme);
  htmlEl.classList.remove(...themeList);
  htmlEl.classList.add(theme);
};
zeroGallery.setTheme = setTheme;

const currTheme = localStorage.getItem("currTheme") || defaultTheme;
setTheme(currTheme);

// InvertProse

const darkMedia = window.matchMedia("(prefers-color-scheme: dark)");
const isInvertProse = (theme) => {
  if (theme === "light") return false;
  if (theme === "dark") return true;
  return darkMedia.matches;
};

const invertProse = (proseEl, theme) => {
  const isInvert = isInvertProse(theme);
  proseEl.classList.toggle("prose-invert", isInvert);
};
zeroGallery.invertProse = invertProse;

const invertProseAll = (theme) => {
  const proseEls = document.querySelectorAll(".prose");
  proseEls.forEach((el) => invertProse(el, theme));
};
zeroGallery.invertProseAll = invertProseAll;
