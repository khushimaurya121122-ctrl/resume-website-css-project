// script.js: small enhancements. The page still works without this file.

const navbar = document.querySelector(".navbar");
const button = document.getElementById("menu-button");
const menu = document.getElementById("nav-menu");
const links = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("main section[id]");

// 1. Mobile menu: open, close, close on link tap, close with Escape
function setMenu(open) {
  menu.classList.toggle("open", open);
  button.setAttribute("aria-expanded", String(open));
  button.textContent = open ? "Close" : "Menu";
}
button.addEventListener("click", function () {
  setMenu(!menu.classList.contains("open"));
});
links.forEach(function (link) {
  link.addEventListener("click", function () { setMenu(false); });
});
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") { setMenu(false); }
});

// 2. Navbar shadow + active link highlighting (runs while scrolling)
function updateNav() {
  navbar.classList.toggle("scrolled", window.scrollY > 10);

  // The current section is the last one whose top has passed the line under the navbar
  let currentId = sections[0].id;
  sections.forEach(function (section) {
    if (section.getBoundingClientRect().top <= 140) { currentId = section.id; }
  });
  // At the very bottom of the page, the last section (Contact) is active
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
    currentId = sections[sections.length - 1].id;
  }

  links.forEach(function (link) {
    const isActive = link.getAttribute("href") === "#" + currentId;
    link.classList.toggle("active", isActive);
    if (isActive) { link.setAttribute("aria-current", "true"); }
    else { link.removeAttribute("aria-current"); }
  });
}
let ticking = false;
window.addEventListener("scroll", function () {
  if (!ticking) {
    window.requestAnimationFrame(function () { updateNav(); ticking = false; });
    ticking = true;
  }
});
window.addEventListener("resize", updateNav);
updateNav();

// 3. Fade items in as they scroll into view (skipped if the user prefers reduced motion)
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduceMotion && "IntersectionObserver" in window) {
  const items = document.querySelectorAll(".skill-card, .lesson, .approach-card, .school-card, .edu-card, .learn-list li, .tag, .prose p");
  const revealObserver = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(function (item) {
    item.classList.add("reveal");
    revealObserver.observe(item);
  });
}
