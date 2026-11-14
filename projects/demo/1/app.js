const notes = [
  {
    title: "Pricing decision, March",
    date: "12 Mar 2026",
    tags: ["pricing"],
    body: "We drop the monthly plan because the flat fee made the decision easier for small teams. Dana's line, which I keep coming back to: two prices, one question.",
  },
  {
    title: "Call with Dana",
    date: "9 Mar 2026",
    tags: ["pricing", "calls"],
    body: "Dana asked what the monthly plan was for. I did not have an answer that survived being said out loud. The flat fee reads as a commitment, not a subscription.",
  },
  {
    title: "The Craftsman, ch. 4",
    date: "2 Feb 2026",
    tags: ["reading", "craft"],
    body: "Sennett on repetition: the hand learns what the head forgets. A workshop keeps its own memory in the tools and the benches.",
  },
  {
    title: "Why I write at night",
    date: "18 Jan 2026",
    tags: ["journal"],
    body: "By night the house is quiet enough to hear a sentence before I commit to it. Night writing is slower and less clever, and the notes are better for it.",
  },
  {
    title: "A note is a promise",
    date: "4 Dec 2025",
    tags: ["philosophy"],
    body: "A note is a promise to your future self. Most of mine are overdue. The archive only pays out if the promise is easy to keep.",
  },
  {
    title: "Substack or own site",
    date: "22 Nov 2025",
    tags: ["distribution"],
    body: "Mailing lists belong to whoever owns the domain. A newsletter is a place to publish, not a place to keep the work. Keep the archive local.",
  },
];

const list = document.getElementById("recall-results");
const empty = document.getElementById("recall-empty");
const input = document.getElementById("recall-input");
const count = document.getElementById("recall-count");
const chips = [...document.querySelectorAll(".chip")];

const escapeHTML = (value) =>
  value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

function markTerms(text, terms) {
  let html = escapeHTML(text);
  for (const term of terms) {
    if (term.length < 2) continue;
    const safe = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    html = html.replace(new RegExp(`(${safe})`, "gi"), "<mark>$1</mark>");
  }
  return html;
}

function render() {
  const query = input.value.trim();
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const matches = terms.length
    ? notes.filter((note) => {
        const haystack = `${note.title} ${note.body} ${note.tags.join(" ")}`.toLowerCase();
        return terms.every((term) => haystack.includes(term));
      })
    : notes;

  count.textContent = query
    ? `${matches.length} of 4,182`
    : "6 recent";

  list.innerHTML = matches
    .map(
      (note) => `
      <li class="result">
        <div class="result-top">
          <h3>${markTerms(note.title, terms)}</h3>
          <span class="mono">${note.date}</span>
        </div>
        <p class="snippet">${markTerms(note.body, terms)}</p>
        <div class="result-tags">${note.tags.map((tag) => `#${tag}`).join(" ")}</div>
      </li>`
    )
    .join("");

  list.hidden = matches.length === 0;
  empty.hidden = matches.length !== 0;
}

input.addEventListener("input", render);

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    input.value = chip.dataset.q;
    input.focus();
    render();
  });
});

render();

/* early access form */

const form = document.getElementById("access-form");
const formNote = document.getElementById("form-note");
const email = document.getElementById("email");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = email.value.trim();
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  if (!valid) {
    email.setAttribute("aria-invalid", "true");
    formNote.textContent = "Add an email we can reach you at.";
    formNote.classList.remove("ok");
    email.focus();
    return;
  }

  email.removeAttribute("aria-invalid");
  formNote.textContent = `You are on the list. We will write to ${value}.`;
  formNote.classList.add("ok");
  form.querySelector("button").textContent = "Requested";
  form.querySelector("button").disabled = true;
  form.querySelector("button").style.opacity = "0.6";
});

/* scroll reveal */

const items = [...document.querySelectorAll(".reveal")];
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );
  items.forEach((item) => observer.observe(item));
} else {
  items.forEach((item) => item.classList.add("in"));
}
