(function () {
  "use strict";

  if (window.DMSite) return;

  const focusableSelector = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])"
  ].join(",");

  const state = {
    activeMenu: null,
    menuTrigger: null,
    activeDialog: null,
    dialogTrigger: null
  };

  function getFocusable(root) {
    return [...root.querySelectorAll(focusableSelector)].filter((element) => {
      return !element.hidden && element.getAttribute("aria-hidden") !== "true";
    });
  }

  function setButtonLoading(button, loading, label) {
    if (!button) return;
    if (!button.dataset.idleLabel) button.dataset.idleLabel = button.textContent.trim();
    button.dataset.loading = String(Boolean(loading));
    button.disabled = Boolean(loading);
    button.setAttribute("aria-busy", String(Boolean(loading)));
    button.textContent = loading ? (label || "Working…") : button.dataset.idleLabel;
  }

  function ensureToastRegion() {
    let region = document.querySelector("[data-dm-toast-region]");
    if (region) return region;
    region = document.createElement("div");
    region.className = "dm-toast-region";
    region.dataset.dmToastRegion = "";
    region.setAttribute("aria-live", "polite");
    region.setAttribute("aria-atomic", "true");
    document.body.appendChild(region);
    return region;
  }

  function showToast(message, options = {}) {
    const region = ensureToastRegion();
    const tone = ["success", "error"].includes(options.tone) ? options.tone : "default";
    const toast = document.createElement("div");
    toast.className = "dm-toast";
    toast.dataset.tone = tone;
    toast.dataset.visible = "false";
    toast.setAttribute("role", tone === "error" ? "alert" : "status");

    const mark = document.createElement("span");
    mark.className = "dm-toast__mark";
    mark.setAttribute("aria-hidden", "true");
    mark.textContent = tone === "success" ? "✓" : tone === "error" ? "!" : "♪";

    const text = document.createElement("span");
    text.className = "dm-toast__message";
    text.textContent = String(message || "Updated");

    const close = document.createElement("button");
    close.className = "dm-toast__close";
    close.type = "button";
    close.setAttribute("aria-label", "Dismiss notification");
    close.textContent = "×";

    const remove = () => {
      toast.dataset.visible = "false";
      window.setTimeout(() => toast.remove(), 300);
    };

    close.addEventListener("click", remove, { once: true });
    toast.append(mark, text, close);
    region.appendChild(toast);
    requestAnimationFrame(() => { toast.dataset.visible = "true"; });
    window.setTimeout(remove, Math.max(2000, Number(options.duration) || 4200));
    return toast;
  }

  function openMenu(menu, trigger) {
    if (!menu || state.activeMenu === menu) return;
    closeMenu();
    state.activeMenu = menu;
    state.menuTrigger = trigger || null;
    menu.dataset.open = "true";
    menu.setAttribute("aria-hidden", "false");
    trigger?.setAttribute("aria-expanded", "true");
    document.body.classList.add("dm-scroll-locked");
    requestAnimationFrame(() => getFocusable(menu)[0]?.focus({ preventScroll: true }));
  }

  function closeMenu() {
    if (!state.activeMenu) return;
    state.activeMenu.dataset.open = "false";
    state.activeMenu.setAttribute("aria-hidden", "true");
    state.menuTrigger?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("dm-scroll-locked");
    const trigger = state.menuTrigger;
    state.activeMenu = null;
    state.menuTrigger = null;
    trigger?.focus({ preventScroll: true });
  }

  function openDialog(dialog, trigger) {
    if (!(dialog instanceof HTMLDialogElement)) return;
    if (state.activeDialog && state.activeDialog !== dialog) closeDialog(state.activeDialog);
    state.activeDialog = dialog;
    state.dialogTrigger = trigger || document.activeElement;
    dialog.showModal();
    requestAnimationFrame(() => getFocusable(dialog)[0]?.focus({ preventScroll: true }));
  }

  function closeDialog(dialog = state.activeDialog) {
    if (!(dialog instanceof HTMLDialogElement) || !dialog.open) return;
    dialog.close();
  }

  function onDialogClosed(event) {
    const dialog = event.currentTarget;
    if (state.activeDialog !== dialog) return;
    const trigger = state.dialogTrigger;
    state.activeDialog = null;
    state.dialogTrigger = null;
    trigger?.focus?.({ preventScroll: true });
  }

  function trapFocus(event, root) {
    if (event.key !== "Tab") return;
    const elements = getFocusable(root);
    if (!elements.length) return;
    const first = elements[0];
    const last = elements[elements.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function initializeDialogs(root = document) {
    root.querySelectorAll("dialog[data-dm-dialog]").forEach((dialog) => {
      if (dialog.dataset.dmReady === "true") return;
      dialog.dataset.dmReady = "true";
      dialog.addEventListener("close", onDialogClosed);
      dialog.addEventListener("cancel", (event) => {
        event.preventDefault();
        closeDialog(dialog);
      });
      dialog.addEventListener("click", (event) => {
        const bounds = dialog.getBoundingClientRect();
        const outside = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
        if (outside) closeDialog(dialog);
      });
      dialog.addEventListener("keydown", (event) => trapFocus(event, dialog));
    });
  }

  function initialize(root = document) {
    initializeDialogs(root);
    ensureToastRegion();

    if (document.documentElement.dataset.dmComponentsReady === "true") return;
    document.documentElement.dataset.dmComponentsReady = "true";

    document.addEventListener("click", (event) => {
      const menuOpen = event.target.closest("[data-dm-menu-open]");
      if (menuOpen) {
        const menu = document.getElementById(menuOpen.getAttribute("aria-controls"));
        openMenu(menu, menuOpen);
        return;
      }

      if (event.target.closest("[data-dm-menu-close], [data-dm-menu-backdrop]")) {
        closeMenu();
        return;
      }

      const dialogOpen = event.target.closest("[data-dm-dialog-open]");
      if (dialogOpen) {
        const dialog = document.getElementById(dialogOpen.dataset.dmDialogOpen);
        openDialog(dialog, dialogOpen);
        return;
      }

      const dialogClose = event.target.closest("[data-dm-dialog-close]");
      if (dialogClose) closeDialog(dialogClose.closest("dialog"));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && state.activeMenu) {
        event.preventDefault();
        closeMenu();
      } else if (state.activeMenu) {
        trapFocus(event, state.activeMenu);
      }
    });
  }

  window.DMSite = Object.freeze({
    closeDialog,
    closeMenu,
    init: initialize,
    openDialog,
    openMenu,
    setButtonLoading,
    showToast
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initialize(), { once: true });
  } else {
    initialize();
  }
})();

