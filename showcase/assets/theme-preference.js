(() => {
  const root = document.documentElement;
  if (root.hasAttribute("data-theme")) return;

  try {
    const theme = localStorage.getItem("idcesares-theme");
    if (theme === "dark" || theme === "light") root.setAttribute("data-theme", theme);
  } catch {
    // Follow the system preference when storage is unavailable.
  }
})();
