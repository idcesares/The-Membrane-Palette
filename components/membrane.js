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

  /* Wiring -------------------------------------------------------- */

  document.addEventListener("click", (event) => {
    const tab = event.target.closest?.('.mp-tabs [role="tab"]');
    if (tab && !tab.disabled) selectTab(tab);

    if (!nativeInvokers) {
      const invoker = event.target.closest?.("button[commandfor]");
      if (invoker) runInvoker(invoker);
    }

    if (!nativeClosedBy) lightDismiss(event);
  });

  document.addEventListener("keydown", (event) => {
    const tab = event.target.closest?.('.mp-tabs [role="tab"]');
    if (tab) onTabKey(event, tab);
    if (event.key === "Escape") dismissTooltips();
  });

  document.addEventListener("pointerout", restoreTooltip);
  document.addEventListener("focusout", restoreTooltip);
})();
