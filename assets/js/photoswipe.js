import params from "@params";
import PhotoSwipeLightbox from "lib/photoswipe/photoswipe-lightbox.esm.js";
import PhotoSwipe from "lib/photoswipe/photoswipe.esm.js";

const bodyEl = document.body;
const prevBodyOverflow = document.body.style.overflow;
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
    arrowNextSVG: '<svg class="pswp__icn" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>',
  });

  let bottomBarEl;
  lightbox.on("uiRegister", () => {
    const pswp = lightbox.pswp;
    bodyEl.style.overflow = "hidden";

    pswp.ui.uiElementsData = pswp.ui.uiElementsData.filter((el) => {
      if (el.name === "zoom") return false;
      else return true;
    });

    pswp.ui.registerElement({
      name: "bottom-bar",
      order: 21,
      isButton: false,
      appendTo: "root",
      html: "",
      onInit: (el, pswp) => {
        bottomBarEl = el;
      },
    });

    let captionEl;
    pswp.on("change", () => {
      const currSlideEl = pswp.currSlide.data.element;
      if (params.enableCaption) {
        bottomBarEl.style.display = "flex";
        if (captionEl) {
          captionEl.remove();
        }
        const pswpCaptionEl = currSlideEl.querySelector(".pswp-caption");
        if (!pswpCaptionEl) return;
        const captionHTML = pswpCaptionEl.innerHTML;
        if (!captionHTML) return;
        const temp = document.createElement("div");
        temp.innerHTML = captionHTML;
        captionEl = temp.firstElementChild;
        bottomBarEl.append(captionEl);
      }
    });
  });

  if (params.enableDownload) {
    lightbox.on("uiRegister", () => {
      const pswp = lightbox.pswp;
      pswp.ui.registerElement({
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
    });
  }

  if (params.enableFileInfo) {
    let fileInfoEl;
    const fileInfoToggle = (isChange) => {
      if (fileInfoEl.classList.contains("visible")) {
        fileInfoEl.classList.remove("visible");
        const realHeight = fileInfoEl.scrollHeight;
        fileInfoEl.style.opacity = "1";
        fileInfoEl.style.visibility = "visible";
        fileInfoEl.style.maxHeight = realHeight + "px";
        fileInfoEl.offsetHeight;
        fileInfoEl.style.opacity = "0";
        fileInfoEl.style.visibility = "hidden";
        fileInfoEl.style.maxHeight = "0";
        fileInfoEl.addEventListener("transitionend", function handler(event) {
          const computed = getComputedStyle(fileInfoEl).maxHeight;
          if (computed === "0px") {
            if (!params.enableCaption) bottomBarEl.style.display = "none";
            fileInfoEl.removeEventListener("transitionend", handler);
            fileInfoEl.style.display = "none";
          }
        });
      } else {
        if (!params.enableCaption) bottomBarEl.style.display = "flex";
        fileInfoEl.classList.add("visible");
        fileInfoEl.style.display = "flex";
        if (isChange) return;
        fileInfoEl.style.opacity = "0";
        fileInfoEl.style.visibility = "hidden";
        fileInfoEl.style.maxHeight = "none";
        const realHeight = fileInfoEl.scrollHeight;
        fileInfoEl.style.maxHeight = "0";
        fileInfoEl.offsetHeight;
        fileInfoEl.style.opacity = "1";
        fileInfoEl.style.visibility = "visible";
        fileInfoEl.style.maxHeight = realHeight + "px";
      }
    };
    lightbox.on("uiRegister", () => {
      const pswp = lightbox.pswp;
      pswp.ui.registerElement({
        name: "fileinfo-button",
        title: params.fileInfoTitle || "File Info",
        order: 9,
        isButton: true,
        tagName: "button",
        html: {
          isCustomSVG: true,
          size: 24,
          inner: '<path id="pswp__icn-fileinfo" stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />',
          outlineID: "pswp__icn-fileinfo",
        },
        onInit: (el, pswp) => {
          el.ariaExpanded = false;
        },
        onClick: (event, el) => {
          el.ariaExpanded = !fileInfoEl.classList.contains("visible");
          fileInfoToggle(false);
        },
      });
      pswp.on("change", () => {
        const currSlideEl = pswp.currSlide.data.element;
        let visible = false;
        if (fileInfoEl) {
          visible = fileInfoEl.classList.contains("visible");
          fileInfoEl.remove();
        }
        const pswpFileInfoEl = currSlideEl.querySelector(".pswp-fileinfo");
        if (!pswpFileInfoEl) return;
        const fileInfoHTML = pswpFileInfoEl.innerHTML;
        if (!fileInfoHTML) return;
        const temp = document.createElement("div");
        temp.innerHTML = fileInfoHTML;
        fileInfoEl = temp.firstElementChild;
        bottomBarEl.prepend(fileInfoEl);
        if (visible) fileInfoToggle(true);
      });
    });
  }

  lightbox.on("uiRegister", () => {
    const pswp = lightbox.pswp;
    let clickTimer = null;
    let clickHandler = {
      startX: 0,
      startY: 0,
      clicked: false,
      moveThreshold: 5,
    };

    pswp.container.addEventListener("pointerdown", (event) => {
      clickHandler.startX = event.clientX;
      clickHandler.startY = event.clientY;
      clickHandler.clicked = true;
    });

    pswp.container.addEventListener("pointermove", (event) => {
      if (!clickHandler.clicked) return;
      const dx = event.clientX - clickHandler.startX;
      const dy = event.clientY - clickHandler.startY;
      if (Math.sqrt(dx * dx + dy * dy) > clickHandler.moveThreshold) {
        clickHandler.clicked = false;
      }
    });

    pswp.container.addEventListener("click", (event) => {
      if (!clickHandler.clicked) return;
      clickHandler.clicked = false;
      const isMousePointer = event.type === "mousedown" || event.pointerType === "mouse";
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

    pswp.container.addEventListener("dblclick", (event) => {
      if (clickTimer) {
        clearTimeout(clickTimer);
        clickTimer = null;
      }
      const currSlide = pswp.currSlide;
      if (!currSlide) return;
      const rect = currSlide.container.getBoundingClientRect();
      const point = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
      currSlide.toggleZoom(point);
    });
  });

  lightbox.on("close", () => {
    bodyEl.style.overflow = prevBodyOverflow;
    history.replaceState("", document.title, window.location.pathname);
  });

  lightbox.on("change", () => {
    const target = lightbox.pswp.currSlide?.data?.element?.dataset["pswpTarget"];
    history.replaceState("", document.title, "#" + target);
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
