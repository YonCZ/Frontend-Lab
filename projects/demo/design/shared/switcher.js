// Keyboard switching for the prototype: 1, 2, 3 (unless typing), and left/right arrows.
(function () {
  const links = Array.from(document.querySelectorAll(".it-switch a"));
  if (!links.length) return;

  const go = (link) => {
    if (link) window.location.href = link.getAttribute("href");
  };

  document.addEventListener("keydown", (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const tag = (event.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select" || event.target.isContentEditable) return;

    const index = links.findIndex((link) => link.getAttribute("aria-current") === "page");
    if (event.key >= "1" && event.key <= String(links.length)) {
      go(links[Number(event.key) - 1]);
    } else if (event.key === "ArrowRight") {
      go(links[(index + 1 + links.length) % links.length]);
    } else if (event.key === "ArrowLeft") {
      go(links[(index - 1 + links.length) % links.length]);
    }
  });
})();
