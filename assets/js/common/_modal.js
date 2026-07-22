const bodyEl = document.body;
const prevBodyOverflow = document.body.style.overflow;

const modal = (window.zeroGallery.modal = {});
const modalList = window.zeroTmp.modal.list;

modal.openModal = (props) => {
  bodyEl.style.overflow = "hidden";
  if (props.trigger) props.trigger.elem.setAttribute("aria-expanded", "true");
  props.modalEl.showModal();
  if (props.closeBtn) props.closeBtn.elem.blur();
  if (props.confirmBtn) props.confirmBtn.elem.blur();
  if (props.cancelBtn) props.cancelBtn.elem.blur();
};

modal.closeModal = (props) => {
  bodyEl.style.overflow = prevBodyOverflow;
  if (props.trigger) props.trigger.elem.setAttribute("aria-expanded", "false");
  props.modalEl.close();
};

// ModalFuncs

const modalFuncs = {};

/*
modalFuncs.test = (id, props, param1, param2) => {
  console.log("test: " + param1 + " " + param2);
};
*/

modalFuncs.open = (id, props) => {
  modal.openModal(props);
};

modalFuncs.close = (id, props) => {
  modal.closeModal(props);
};

modal.get = (id) => {
  const props = modalList?.[id];
  if (props === undefined) return;
  const modalObj = { ...props };
  Object.entries(modalFuncs).forEach(([name, method]) => {
    modalObj[name] = (...params) => {
      return method(id, props, ...params);
    };
  });
  return modalObj;
};

// AddEventListener

const handleBtnClick = (id, props, type) => {
  const btn = props[type].elem;
  const click = props[type].click;
  btn.disabled = true;
  const [handle, ...params] = click;
  const [prefix, fnName] = handle.split(".");
  let func;
  switch (prefix) {
    case "sys":
      func = modal.sysFuncs[fnName];
      break;
    case "usr":
      func = modal.usrFuncs[fnName];
      break;
  }
  if (func === undefined) throw new Error(`undefined function: ${handle}`);
  func(id, props, ...params);
  btn.disabled = false;
};

Object.entries(modalList).forEach(([id, props]) => {
  if (props.trigger) {
    props.trigger.elem.addEventListener("click", (event) => {
      const btn = props.trigger.elem;
      btn.disabled = true;
      modal.openModal(props);
      btn.disabled = false;
    });
  }
  if (props.closeBtn) {
    props.closeBtn.elem.addEventListener("click", (event) => {
      handleBtnClick(id, props, "closeBtn");
    });
  }
  if (props.confirmBtn) {
    props.confirmBtn.elem.addEventListener("click", (event) => {
      handleBtnClick(id, props, "confirmBtn");
    });
  }
  if (props.cancelBtn) {
    props.cancelBtn.elem.addEventListener("click", (event) => {
      handleBtnClick(id, props, "cancelBtn");
    });
  }
});

// SysFuncs

modal.sysFuncs = {};
Object.entries(modalFuncs).forEach(([name, method]) => {
  modal.sysFuncs[name] = method;
});

// UsrFuncs

modal.usrFuncs = {};

/*
modal.usrFuncs.test = (id, props, param1, param2) => {
  console.log("test: " + param1 + " " + param2);
  modal.closeModal(props);
};
*/
