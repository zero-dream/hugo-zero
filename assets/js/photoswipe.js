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
  });

  if (params.enableDownload) {
    lightbox.on("uiRegister", () => {
      lightbox.pswp.ui.registerElement({
        name: "download-button",
        order: 8,
        isButton: true,
        tagName: "a",
        html: {
          isCustomSVG: true,
          inner: '<path d="M20.5 14.3 17.1 18V10h-2.2v7.9l-3.4-3.6L10 16l6 6.1 6-6.1ZM23 23H9v2h14Z" id="pswp__icn-download"/>',
          outlineID: "pswp__icn-download",
        },
        onInit: (el, pswp) => {
          el.setAttribute("download", "");
          el.setAttribute("target", "_blank");
          el.setAttribute("rel", "noopener");
          el.setAttribute("title", params.downloadTitle || "Download");
          pswp.on("change", () => {
            el.href = pswp.currSlide.data.element.href;
          });
        },
      });
    });
  }

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

  lightbox.on("uiRegister", () => {
    const pswp = lightbox.pswp;
    pswp.ui.registerElement({
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
