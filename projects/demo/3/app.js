/* Cairn / iteration 03 interactions: drifting constellation, typed queries, capture */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ————— constellation ————— */

const canvas = document.getElementById("drift");
const stage = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const palette = ["rgba(25,22,16,0.22)", "rgba(25,22,16,0.22)", "rgba(106,77,255,0.5)", "rgba(255,90,54,0.45)", "rgba(95,207,136,0.5)"];
let points = [];
let width = 0;
let height = 0;
let frame = null;
let visible = true;

function seed() {
  const count = Math.max(14, Math.min(34, Math.round(width / 40)));
  points = Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.08 + Math.random() * 0.12;
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: 0.9 + Math.random() * 1.6,
      color: palette[Math.floor(Math.random() * palette.length)],
    };
  });
}

function sizeCanvas() {
  const rect = stage.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = rect.width;
  height = rect.height;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  seed();
  if (reduceMotion) draw();
}

function draw() {
  ctx.clearRect(0, 0, width, height);
  for (let i = 0; i < points.length; i += 1) {
    const a = points[i];
    for (let j = i + 1; j < points.length; j += 1) {
      const b = points[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 128) {
        ctx.strokeStyle = `rgba(25,22,16,${0.1 * (1 - distance / 128)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }
  for (const point of points) {
    ctx.fillStyle = point.color;
    ctx.beginPath();
    ctx.arc(point.x, point.y, point.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function step() {
  for (const point of points) {
    point.x += point.vx;
    point.y += point.vy;
    if (point.x < -20) point.x = width + 20;
    if (point.x > width + 20) point.x = -20;
    if (point.y < -20) point.y = height + 20;
    if (point.y > height + 20) point.y = -20;
  }
  draw();
  frame = requestAnimationFrame(step);
}

function start() {
  if (reduceMotion || frame || !visible) return;
  frame = requestAnimationFrame(step);
}
function stop() {
  if (frame) cancelAnimationFrame(frame);
  frame = null;
}

sizeCanvas();
start();

const resizeObserver = new ResizeObserver(() => {
  const changed = canvas.clientWidth !== width;
  if (changed) {
    stop();
    sizeCanvas();
    start();
  }
});
resizeObserver.observe(stage);

if ("IntersectionObserver" in window) {
  const stageObserver = new IntersectionObserver(
    (entries) => {
      visible = entries[0].isIntersecting;
      if (visible) start();
      else stop();
    },
    { threshold: 0 }
  );
  stageObserver.observe(stage);
}

/* soft parallax on the floating cards */

const cardLayer = document.querySelector(".stage-cards");
if (cardLayer && window.matchMedia("(pointer: fine)").matches && !reduceMotion) {
  stage.addEventListener("pointermove", (event) => {
    const rect = stage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    cardLayer.style.transform = `translate3d(${x * 16}px, ${y * 12}px, 0)`;
  });
  stage.addEventListener("pointerleave", () => {
    cardLayer.style.transform = "";
  });
}

/* ————— typed queries ————— */

const queryEl = document.getElementById("hero-query");
const queries = [
  "why did we drop monthly pricing",
  "sennett on repetition",
  "the idea I had on the train",
  "what did Dana say about scope",
];

if (queryEl) {
  if (reduceMotion) {
    queryEl.textContent = queries[0];
  } else {
    let index = 0;
    let chars = queries[0].length;
    let deleting = true;
    let timer = null;

    const tick = () => {
      const query = queries[index];
      if (deleting) {
        chars -= 1;
        if (chars <= 0) {
          chars = 0;
          deleting = false;
          index = (index + 1) % queries.length;
          timer = setTimeout(tick, 420);
          queryEl.textContent = "";
          return;
        }
        timer = setTimeout(tick, 18);
      } else {
        chars += 1;
        if (chars >= query.length) {
          chars = query.length;
          deleting = true;
          timer = setTimeout(tick, 2200);
          queryEl.textContent = query;
          return;
        }
        timer = setTimeout(tick, 46);
      }
      queryEl.textContent = queries[index].slice(0, chars);
    };

    queryEl.textContent = queries[0];
    timer = setTimeout(tick, 3800);

    document.addEventListener("visibilitychange", () => {
      clearTimeout(timer);
      if (!document.hidden) timer = setTimeout(tick, 900);
    });
  }
}

/* ————— quick capture ————— */

const catchForm = document.getElementById("catch-form");
const catchInput = document.getElementById("catch-input");
const catchList = document.getElementById("catch-list");

catchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = catchInput.value.trim();
  if (!value) {
    catchInput.focus();
    return;
  }

  const item = document.createElement("li");
  item.className = "fresh";
  const text = document.createElement("span");
  text.textContent = value;
  const time = document.createElement("em");
  time.textContent = "now";
  item.append(text, time);
  catchList.prepend(item);

  while (catchList.children.length > 4) catchList.lastElementChild.remove();

  catchInput.value = "";
  catchInput.focus();
});

/* ————— waitlist ————— */

const form = document.getElementById("access-form");
const note = document.getElementById("form-note");
const email = document.getElementById("email");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = email.value.trim();
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  if (!valid) {
    email.setAttribute("aria-invalid", "true");
    note.textContent = "Add an email we can reach you at.";
    note.classList.remove("ok");
    email.focus();
    return;
  }

  email.removeAttribute("aria-invalid");
  note.textContent = `You are on the list. We will write to ${value}.`;
  note.classList.add("ok");
  const button = form.querySelector("button");
  button.textContent = "Requested";
  button.disabled = true;
  button.style.opacity = "0.55";
});

/* ————— header state + reveal ————— */

const head = document.querySelector(".site-head");
const setHead = () => head.classList.toggle("scrolled", window.scrollY > 8);
setHead();
window.addEventListener("scroll", setHead, { passive: true });

const items = [...document.querySelectorAll(".reveal")];
if ("IntersectionObserver" in window && !reduceMotion) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -6% 0px", threshold: 0.06 }
  );
  items.forEach((item) => observer.observe(item));
} else {
  items.forEach((item) => item.classList.add("in"));
}
