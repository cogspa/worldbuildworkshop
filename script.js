// --- Helpers ---
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const topbar = document.getElementById("topbar");
const hero = document.getElementById("hero");
const layers = Array.from(document.querySelectorAll("[data-depth]"));
const year = document.getElementById("year");
year.textContent = new Date().getFullYear();

// --- Sticky nav reveal ---
const onScroll = () => {
  const y = window.scrollY || 0;
  if (y > 40) topbar.classList.add("is-visible");
  else topbar.classList.remove("is-visible");
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// --- Mobile menu ---
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
let mobileOpen = false;

hamburger.addEventListener("click", () => {
  mobileOpen = !mobileOpen;
  mobileMenu.style.display = mobileOpen ? "block" : "none";
  mobileMenu.setAttribute("aria-hidden", String(!mobileOpen));
});

// Close mobile menu on click
mobileMenu.querySelectorAll("a").forEach(a => {
  a.addEventListener("click", () => {
    mobileOpen = false;
    mobileMenu.style.display = "none";
    mobileMenu.setAttribute("aria-hidden", "true");
  });
});

// --- Parallax (mouse + scroll) ---
let mouseX = 0, mouseY = 0;
let raf = null;

function updateParallax() {
  raf = null;

  const rect = hero.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  // Mouse influence (normalized)
  const nx = clamp((mouseX - centerX) / (rect.width / 2), -1, 1);
  const ny = clamp((mouseY - centerY) / (rect.height / 2), -1, 1);

  // Scroll influence
  const scrollY = window.scrollY || 0;
  const heroTop = hero.offsetTop;
  const progress = clamp((scrollY - heroTop) / Math.max(hero.offsetHeight, 1), 0, 1);

  layers.forEach(el => {
    const depth = parseFloat(el.dataset.depth || "0.1");

    // px offsets
    const mx = nx * 22 * depth;
    const my = ny * 18 * depth;

    // scroll moves layers slightly upward
    const sy = -progress * 60 * depth;

    el.style.transform = `translate3d(${mx}px, ${my + sy}px, 0) scale(1.02)`;
  });
}

window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (!raf) raf = requestAnimationFrame(updateParallax);
}, { passive: true });

window.addEventListener("scroll", () => {
  if (!raf) raf = requestAnimationFrame(updateParallax);
}, { passive: true });

// --- Form Submission (Netlify AJAX) ---
const workshopForm = document.getElementById("workshopForm");
const formSuccess = document.getElementById("formSuccess");

if (workshopForm) {
  workshopForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(workshopForm);

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString(),
    })
      .then(() => {
        workshopForm.style.display = "none";
        formSuccess.style.display = "flex";
      })
      .catch((error) => {
        console.error("Form submission error:", error);
        alert("There was an issue submitting the form. Please try again.");
      });
  });
}
