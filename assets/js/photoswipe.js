import params from "@params";
import PhotoSwipeLightbox from "../lib/photoswipe/photoswipe-lightbox.esm.js";
import PhotoSwipe from "../lib/photoswipe/photoswipe.esm.js";

const galleryEl = document.getElementById("gallery");

if (galleryEl) {
  const lightbox = new PhotoSwipeLightbox({
    pswpModule: PhotoSwipe,
    gallery: galleryEl,
    children: ".fj-gallery-item",
    bgOpacity: 1,
    showHideAnimationType: "zoom",

    imageClickAction: "",
    bgClickAction: "",
    tapAction: "toggle-controls",
    doubleTapAction: "zoom",

    zoomTitle: params.zoomTitle,
    closeTitle: params.closeTitle,
    arrowPrevTitle: params.arrowPrevTitle,
    arrowNextTitle: params.arrowNextTitle,
    errorMsg: params.errorMsg,

    closeSVG: '<svg class="pswp__icn" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>',
    arrowPrevSVG: '<svg class="pswp__icn" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>',
    arrowNextSVG: '<svg class="pswp__icn" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>',
  });

  lightbox.on("uiRegister", () => {
    if (params.enableDownload) {
      lightbox.pswp.ui.registerElement({
        name: "download-button",
        title: params.downloadTitle || "Download",
        order: 8,
        isButton: true,
        tagName: "a",
        html: {
          isCustomSVG: true,
          size: 24,
          inner: '<path id="pswp__icn-download" stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />',
          outlineID: "pswp__icn-download",
        },
        onInit: (el, pswp) => {
          el.setAttribute("download", "");
          el.setAttribute("target", "_blank");
          el.setAttribute("rel", "noopener");
          pswp.on("change", () => {
            el.href = pswp.currSlide.data.element.href;
          });
        },
      });
    }

    if (params.enableCaption) {
      lightbox.pswp.ui.registerElement({
        name: "pswp-caption",
        order: 21,
        isButton: false,
        appendTo: "root",
        html: "",
        onInit: (el, pswp) => {
          lightbox.pswp.on("change", () => {
            const currSlideElement = lightbox.pswp.currSlide.data.element;
            if (!currSlideElement) return;
            const pswpCaption = currSlideElement.querySelector(".pswp-caption");
            if (!pswpCaption) return;
            const captionHTML = pswpCaption.innerHTML;
            if (!captionHTML) return;
            el.innerHTML = captionHTML;
          });
        },
      });
    }
  });

  lightbox.on("uiRegister", () => {
    const pswp = lightbox.pswp;
    pswp.ui.uiElementsData = pswp.ui.uiElementsData.filter((el) => {
      if (el.name === "zoom") return false;
      else return true;
    });
  });

  lightbox.on("uiRegister", () => {
    let clickTimer = null;
    const pswp = lightbox.pswp;
    if (!pswp.container) return;

    let clickHandler = {
      startX: 0,
      startY: 0,
      clicked: false,
      moveThreshold: 5,
    };

    pswp.container.addEventListener("pointerdown", (e) => {
      clickHandler.startX = e.clientX;
      clickHandler.startY = e.clientY;
      clickHandler.clicked = true;
    });

    pswp.container.addEventListener("pointermove", (e) => {
      if (!clickHandler.clicked) return;
      const dx = e.clientX - clickHandler.startX;
      const dy = e.clientY - clickHandler.startY;
      if (Math.sqrt(dx * dx + dy * dy) > clickHandler.moveThreshold) {
        clickHandler.clicked = false;
      }
    });

    pswp.container.addEventListener("click", (e) => {
      if (!clickHandler.clicked) return;
      clickHandler.clicked = false;

      const isMousePointer = e.type === "mousedown" || e.pointerType === "mouse";
      if (!isMousePointer) return;

      if (clickTimer) {
        clearTimeout(clickTimer);
        clickTimer = null;
      }
      clickTimer = setTimeout(() => {
        if (!pswp.template) return;
        pswp.template.classList.toggle("pswp--ui-visible");
        clickTimer = null;
      }, 300);
    });

    pswp.container.addEventListener("dblclick", (e) => {
      if (clickTimer) {
        clearTimeout(clickTimer);
        clickTimer = null;
      }

      const currSlide = pswp.currSlide;
      if (!currSlide) return;
      const rect = currSlide.container.getBoundingClientRect();
      const point = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      currSlide.toggleZoom(point);
    });
  });

  lightbox.on("change", () => {
    const target = lightbox.pswp.currSlide?.data?.element?.dataset["pswpTarget"];
    history.replaceState("", document.title, "#" + target);
  });

  lightbox.on("close", () => {
    history.replaceState("", document.title, window.location.pathname);
  });

  lightbox.init();

  if (window.location.hash.substring(1).length > 1) {
    const target = window.location.hash.substring(1);
    const items = galleryEl.querySelectorAll("a");
    for (let i = 0; i < items.length; i++) {
      if (items[i].dataset["pswpTarget"] === target) {
        lightbox.loadAndOpen(i, { gallery: galleryEl });
        break;
      }
    }
  }
}
