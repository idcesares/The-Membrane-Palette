/* ============================================================
   The Membrane Palette — optional component behaviors

   Hand-written, dependency-free, ~1.7 KB gzipped. Every component renders
   correctly without this file; it only adds keyboard behavior that
   CSS cannot express. Uses document-level event delegation, so it
   needs no init call and works for markup added later.

   - Tabs     click + Arrow/Home/End keys (WAI-ARIA tabs pattern,
              automatic activation, RTL-aware).
   - Tooltip  Escape dismisses an open tooltip (WCAG 1.4.13).
   - Dialog   fallback for invoker commands (commandfor/command)
              and closedby="any" light dismiss in browsers that
              lack them natively.
   - Menu     WAI-ARIA menu keys (arrows, Home/End, Tab), focus on
              open and return on close, aria-expanded sync, and
              positioning where CSS anchor positioning is missing.
   - Toast    MembranePalette.toast({ title, body, tone, timeout })
              and declarative <button data-mp-toast="…">.

   Load with: <script src=".../components/membrane.js" defer></script>
   ============================================================ */

(() => {
  if (window.__membranePalette) return;
  window.__membranePalette = true;

  /* Tabs ---------------------------------------------------------- */

  function tabsOf(tab) {
    const list = tab.closest('[role="tablist"]');
    return list ? Array.from(list.querySelectorAll('[role="tab"]')) : [tab];
  }

  function selectTab(tab, { focus = false } = {}) {
    for (const t of tabsOf(tab)) {
      const selected = t === tab;
      t.setAttribute("aria-selected", String(selected));
      t.tabIndex = selected ? 0 : -1;
      const panel = document.getElementById(t.getAttribute("aria-controls"));
      if (panel) panel.hidden = !selected;
    }
    if (focus) tab.focus();
  }

  function onTabKey(event, tab) {
    const tabs = tabsOf(tab).filter((t) => !t.disabled);
    const list = tab.closest('[role="tablist"]');
    const vertical = list?.getAttribute("aria-orientation") === "vertical";
    const rtl = list && getComputedStyle(list).direction === "rtl";
    const i = tabs.indexOf(tab);
    const next = vertical ? "ArrowDown" : rtl ? "ArrowLeft" : "ArrowRight";
    const prev = vertical ? "ArrowUp" : rtl ? "ArrowRight" : "ArrowLeft";
    let target = null;
    if (event.key === next) target = tabs[(i + 1) % tabs.length];
    else if (event.key === prev) target = tabs[(i - 1 + tabs.length) % tabs.length];
    else if (event.key === "Home") target = tabs[0];
    else if (event.key === "End") target = tabs[tabs.length - 1];
    if (!target) return;
    event.preventDefault();
    selectTab(target, { focus: true });
  }

  /* Tooltip ------------------------------------------------------- */

  function dismissTooltips() {
    document
      .querySelectorAll(".mp-tooltip:hover, .mp-tooltip:has(:focus-visible)")
      .forEach((t) => t.setAttribute("data-dismissed", ""));
  }

  function restoreTooltip(event) {
    const tooltip = event.target.closest?.(".mp-tooltip[data-dismissed]");
    if (tooltip && !tooltip.contains(event.relatedTarget)) tooltip.removeAttribute("data-dismissed");
  }

  /* Dialog fallbacks ---------------------------------------------- */

  const nativeInvokers = "commandForElement" in HTMLButtonElement.prototype;
  const nativeClosedBy = "closedBy" in HTMLDialogElement.prototype;

  function runInvoker(button) {
    const target = document.getElementById(button.getAttribute("commandfor"));
    if (!(target instanceof HTMLDialogElement)) return;
    const command = button.getAttribute("command");
    if (command === "show-modal" && !target.open) target.showModal();
    else if (command === "close") target.close(button.value || undefined);
    else if (command === "request-close") (target.requestClose ?? target.close).call(target);
  }

  function lightDismiss(event) {
    const dialog = event.target;
    if (!(dialog instanceof HTMLDialogElement) || dialog.getAttribute("closedby") !== "any") return;
    const r = dialog.getBoundingClientRect();
    const inside = event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom;
    if (!inside) dialog.close();
  }

  /* Menu ---------------------------------------------------------- */

  const nativeAnchoring = window.CSS?.supports?.("position-area: block-end") ?? false;
  const menuItems = (menu) => Array.from(menu.querySelectorAll('[role="menuitem"]'));
  const triggerOf = (menu) => document.querySelector(`[popovertarget="${CSS.escape(menu.id)}"]`);

  function placeMenu(menu, trigger) {
    const gap = 4;
    const r = trigger.getBoundingClientRect();
    const m = menu.getBoundingClientRect();
    const below = r.bottom + gap + m.height <= window.innerHeight;
    menu.style.inset = "auto";
    menu.style.margin = "0";
    menu.style.top = `${below ? r.bottom + gap : Math.max(gap, r.top - gap - m.height)}px`;
    menu.style.left = `${Math.min(r.left, window.innerWidth - m.width - gap)}px`;
  }

  function onMenuToggle(event) {
    const menu = event.target;
    if (!(menu instanceof HTMLElement) || !menu.classList.contains("mp-menu")) return;
    const trigger = triggerOf(menu);
    const open = event.newState === "open";
    trigger?.setAttribute("aria-expanded", String(open));
    if (open) {
      if (!nativeAnchoring && trigger) placeMenu(menu, trigger);
      menuItems(menu)[0]?.focus();
    } else if (trigger && (document.activeElement === document.body || menu.contains(document.activeElement))) {
      trigger.focus();
    }
  }

  function onMenuKey(event, menu) {
    const items = menuItems(menu);
    const i = items.indexOf(document.activeElement);
    let target = null;
    if (event.key === "ArrowDown") target = items[(i + 1) % items.length];
    else if (event.key === "ArrowUp") target = items[(i - 1 + items.length) % items.length];
    else if (event.key === "Home") target = items[0];
    else if (event.key === "End") target = items[items.length - 1];
    else if (event.key === "Tab") menu.hidePopover();
    if (!target) return;
    event.preventDefault();
    target.focus();
  }

  /* Toast --------------------------------------------------------- */

  function toastRegion() {
    let region = document.querySelector('.mp-toast-region:not([data-placement="inline"])');
    let fresh = false;
    if (!region) {
      region = document.createElement("div");
      region.className = "mp-toast-region";
      region.setAttribute("aria-live", "polite");
      document.body.append(region);
      fresh = true;
    }
    return { region, fresh };
  }

  /** Play the exit transition (0ms under reduced motion), then remove. */
  function leaveToast(el) {
    if (el.hasAttribute("data-leaving")) return;
    el.setAttribute("data-leaving", "");
    const seconds = parseFloat(getComputedStyle(el).transitionDuration) || 0;
    setTimeout(() => el.remove(), seconds * 1000);
  }

  function toast({ title, body, tone = "info", timeout } = {}) {
    if (!title) throw new Error("MembranePalette.toast: a title is required");
    const el = document.createElement("div");
    el.className = "mp-toast";
    if (tone !== "info") el.dataset.tone = tone;
    if (tone === "error") el.setAttribute("role", "alert");

    const content = document.createElement("div");
    content.className = "mp-toast__content";
    const heading = document.createElement("p");
    heading.className = "mp-toast__title";
    heading.textContent = title; // textContent, never innerHTML: toast text is data
    content.append(heading);
    if (body) {
      const text = document.createElement("p");
      text.textContent = body;
      content.append(text);
    }
    const close = document.createElement("button");
    close.className = "mp-toast__close";
    close.type = "button";
    close.setAttribute("aria-label", "Dismiss");
    close.textContent = "×";
    el.append(content, close);

    const dismiss = () => leaveToast(el);
    const { region, fresh } = toastRegion();
    // A live region must exist before content lands in it to be announced.
    setTimeout(() => region.append(el), fresh ? 150 : 0);

    // Errors stay until dismissed; everything else leaves, but never while
    // the person is hovering or focused on it (WCAG 2.2.1).
    const ms = timeout ?? (tone === "error" ? 0 : 6000);
    if (ms > 0) {
      let timer = setTimeout(dismiss, ms);
      const pause = () => clearTimeout(timer);
      const resume = () => { clearTimeout(timer); timer = setTimeout(dismiss, ms / 2); };
      el.addEventListener("pointerenter", pause);
      el.addEventListener("focusin", pause);
      el.addEventListener("pointerleave", resume);
      el.addEventListener("focusout", resume);
    }
    return { element: el, dismiss };
  }

  window.MembranePalette = Object.assign(window.MembranePalette || {}, { toast });

  /* Wiring -------------------------------------------------------- */

  document.addEventListener("click", (event) => {
    const tab = event.target.closest?.('.mp-tabs [role="tab"]');
    if (tab && !tab.disabled) selectTab(tab);

    if (!nativeInvokers) {
      const invoker = event.target.closest?.("button[commandfor]");
      if (invoker) runInvoker(invoker);
    }

    if (!nativeClosedBy) lightDismiss(event);

    const item = event.target.closest?.('.mp-menu [role="menuitem"]');
    if (item && item.getAttribute("aria-disabled") !== "true") {
      const menu = item.closest(".mp-menu");
      setTimeout(() => menu.hidePopover?.(), 0); // let the item's own handler run first
    }

    const close = event.target.closest?.(".mp-toast__close");
    const closing = close?.closest(".mp-toast");
    if (closing) leaveToast(closing);

    const trigger = event.target.closest?.("[data-mp-toast]");
    if (trigger) {
      toast({ title: trigger.dataset.mpToast, body: trigger.dataset.mpToastBody, tone: trigger.dataset.mpToastTone });
    }
  });

  // "toggle" doesn't bubble; listen in the capture phase.
  document.addEventListener("toggle", onMenuToggle, true);

  document.addEventListener("keydown", (event) => {
    const tab = event.target.closest?.('.mp-tabs [role="tab"]');
    if (tab) onTabKey(event, tab);
    const menu = event.target.closest?.(".mp-menu");
    if (menu) onMenuKey(event, menu);
    if (event.key === "Escape") dismissTooltips();
  });

  document.addEventListener("pointerout", restoreTooltip);
  document.addEventListener("focusout", restoreTooltip);
})();
