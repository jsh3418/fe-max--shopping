import { $ } from "../../utils/domUtils";
import { dimMain, undimMain } from "../../utils/dimming";
import { hideElement, showElement } from "../../utils/elementVisibility";

export const showLoginModalOnLoad = () => {
  const $modal = $("#login-modal");
  const $loginContainer = $(".nav-bar__login-container");

  const setTimeoutId = setTimeout(() => {
    showElement($modal);
  }, 1000);

  $loginContainer.addEventListener(
    "mouseenter",
    () => {
      clearTimeout(setTimeoutId);
      hideElement($modal);
    },
    { once: true }
  );
};

export const addLoginEventListeners = () => {
  const $loginContainer = $(".nav-bar__login-container");
  const $modal = $("#extend-login-modal");

  $loginContainer.addEventListener("mouseenter", () => handleLoginContainerMouseEnter($modal));
  $modal.addEventListener("mouseleave", () => handleModalMouseLeave($modal));
};

const handleLoginContainerMouseEnter = ($modal: Element) => {
  showElement($modal);
  dimMain();
};

const handleModalMouseLeave = ($modal: Element) => {
  hideElement($modal);
  undimMain();
};