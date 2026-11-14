(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduce = () => window.NoemaMotion.reduce();

  /* ---------------- nav + reveals ---------------- */

  const top = $(".top");
  let ticking = false;
  function onScroll() {
    top.classList.toggle("is-scrolled", window.scrollY > 8);
    ticking = false;
  }
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(onScroll);
      }
    },
    { passive: true }
  );
  onScroll();

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          el.style.transitionDelay = `${Number(el.dataset.delay || 0)}ms`;
          el.classList.add("is-in");
          observer.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    $$(".reveal").forEach((el) => observer.observe(el));
  } else {
    $$(".reveal").forEach((el) => el.classList.add("is-in"));
  }

  /* ---------------- sticky story ---------------- */

  const stage = $("#stage");
  const stageNum = $("#stageNum");
  const stageName = $("#stageName");
  const steps = $$(".step");

  if ("IntersectionObserver" in window) {
    const storyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const step = entry.target;
          steps.forEach((item) => item.classList.toggle("is-active", item === step));
          stage.dataset.state = step.dataset.state;
          stageNum.textContent = step.dataset.num;
          stageName.textContent = step.dataset.name;
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    steps.forEach((step) => storyObserver.observe(step));
  }

  /* ---------------- command bar ---------------- */

  const items = [
    { group: "Go to", label: "Overview", hint: "Top of page", href: "#top" },
    { group: "Go to", label: "The three moves", hint: "Capture, connect, recall", href: "#story" },
    { group: "Go to", label: "Specs", hint: "The numbers and platforms", href: "#specs" },
    { group: "Go to", label: "Available everywhere", hint: "Mac, iPhone, iPad, web", href: "#available" },
    { group: "Go to", label: "Privacy", hint: "Encrypted, offline, exportable", href: "#privacy" },
    { group: "Action", label: "Download Noema", hint: "Free for 500 notes", href: "#download" },
    { group: "Action", label: "Copy link to this page", hint: "Share the prototype", action: "copy" },
  ];

  const palette = $("#palette");
  const paletteBox = $(".palette__box", palette);
  const paletteInput = $("#paletteInput");
  const paletteList = $("#paletteList");
  const triggers = $$("#openPalette, #heroPalette, #panelPalette");
  let lastTrigger = null;
  let hideTimer = 0;
  let filtered = [];
  let activeIndex = 0;
  let optionEls = [];

  function renderPalette(query) {
    const q = query.trim().toLowerCase();
    filtered = items.filter((item) => {
      if (!q) return true;
      return `${item.group} ${item.label} ${item.hint}`.toLowerCase().includes(q);
    });

    paletteList.textContent = "";
    optionEls = [];
    activeIndex = 0;

    if (!filtered.length) {
      const empty = document.createElement("li");
      empty.className = "palette__empty";
      empty.textContent = "Nothing matches that. Try 'specs', 'privacy' or 'download'.";
      paletteList.appendChild(empty);
      paletteInput.setAttribute("aria-activedescendant", "");
      return;
    }

    let lastGroup = "";
    filtered.forEach((item, index) => {
      if (item.group !== lastGroup) {
        const group = document.createElement("li");
        group.className = "palette__group";
        group.setAttribute("role", "presentation");
        group.textContent = item.group;
        paletteList.appendChild(group);
        lastGroup = item.group;
      }

      const li = document.createElement("li");
      li.className = "palette__item";
      li.id = `palette-opt-${index}`;
      li.setAttribute("role", "option");
      li.setAttribute("aria-selected", String(index === activeIndex));

      const label = document.createElement("span");
      label.className = "palette__label";
      label.textContent = item.label;
      const hint = document.createElement("span");
      hint.className = "palette__hint";
      hint.textContent = item.hint;
      label.appendChild(hint);

      const go = document.createElement("span");
      go.className = "palette__go";
      go.textContent = "↵";

      li.append(label, go);
      li.addEventListener("mouseenter", () => setActive(index));
      li.addEventListener("click", () => runItem(index));
      paletteList.appendChild(li);
      optionEls.push(li);
    });

    setActive(0, false);
  }

  function setActive(index, scroll) {
    if (!filtered.length) return;
    activeIndex = (index + filtered.length) % filtered.length;
    optionEls.forEach((el, i) => el.setAttribute("aria-selected", String(i === activeIndex)));
    const active = optionEls[activeIndex];
    if (!active) return;
    paletteInput.setAttribute("aria-activedescendant", active.id);
    if (scroll !== false) active.scrollIntoView({ block: "nearest" });
  }

  function openPalette(trigger) {
    window.clearTimeout(hideTimer);
    lastTrigger = trigger || document.activeElement;
    palette.hidden = false;
    document.body.classList.add("is-locked");
    paletteInput.value = "";
    renderPalette("");
    requestAnimationFrame(() => palette.classList.add("is-open"));
    window.setTimeout(() => paletteInput.focus({ preventScroll: true }), 20);
  }

  function closePalette(restore) {
    if (palette.hidden) return;
    palette.classList.remove("is-open");
    document.body.classList.remove("is-locked");
    const delay = reduce() ? 0 : 230;
    window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(() => {
      palette.hidden = true;
      if (restore !== false && lastTrigger && typeof lastTrigger.focus === "function") {
        lastTrigger.focus({ preventScroll: true });
      }
    }, delay);
  }

  function showToast(text) {
    const toast = $("#toast");
    const toastText = $("#toastText");
    toastText.textContent = text;
    toast.hidden = false;
    requestAnimationFrame(() => toast.classList.add("is-on"));
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => {
      toast.classList.remove("is-on");
      window.setTimeout(() => {
        toast.hidden = true;
      }, reduce() ? 0 : 240);
    }, 1900);
  }

  function runItem(index) {
    const item = filtered[index];
    if (!item) return;
    closePalette(false);

    if (item.action === "copy") {
      const url = window.location.href;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(url)
          .then(() => showToast("Link copied"))
          .catch(() => showToast("Copy the URL from the address bar."));
      } else {
        showToast("Copy the URL from the address bar.");
      }
      return;
    }

    if (!item.href) return;
    const target = document.querySelector(item.href);
    if (!target) return;
    window.setTimeout(() => {
      target.scrollIntoView({ behavior: reduce() ? "auto" : "smooth", block: "start" });
      try {
        history.replaceState(null, "", item.href);
      } catch (error) {
        /* file URLs can refuse history updates; the scroll still works */
      }
    }, 40);
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => openPalette(trigger));
  });

  $$("[data-palette-close]", palette).forEach((el) => el.addEventListener("click", () => closePalette()));

  paletteInput.addEventListener("input", () => renderPalette(paletteInput.value));

  paletteInput.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive(activeIndex + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive(activeIndex - 1);
    } else if (event.key === "Enter") {
      event.preventDefault();
      runItem(activeIndex);
    } else if (event.key === "Escape") {
      event.preventDefault();
      closePalette();
    } else if (event.key === "Tab") {
      event.preventDefault();
    }
  });

  document.addEventListener("keydown", (event) => {
    const meta = event.metaKey || event.ctrlKey;
    if (meta && event.key.toLowerCase() === "k") {
      event.preventDefault();
      if (palette.hidden) openPalette(document.activeElement);
      else closePalette();
      return;
    }
    if (event.key === "Escape" && !palette.hidden) {
      event.preventDefault();
      closePalette();
    }
  });

  /* keep the focus inside the dialog if it is open and something tries to leave */
  document.addEventListener("focusin", (event) => {
    if (palette.hidden) return;
    if (!paletteBox.contains(event.target)) {
      paletteInput.focus({ preventScroll: true });
    }
  });
})();
