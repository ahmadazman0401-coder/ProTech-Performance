const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");
const menuLabel = menuButton?.querySelector(".sr-only");
const quoteForm = document.querySelector("#quote-form");
const serviceSelect = document.querySelector("#service-select");
const toast = document.querySelector("#toast");

const closeMenu = () => {
  if (!menuButton || !navigation) return;
  menuButton.setAttribute("aria-expanded", "false");
  navigation.classList.remove("open");
  document.body.classList.remove("menu-open");
  if (menuLabel) menuLabel.textContent = "Open navigation";
};

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  navigation?.classList.toggle("open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
  if (menuLabel) menuLabel.textContent = isOpen ? "Open navigation" : "Close navigation";
});

navigation?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const updateHeader = () => header?.classList.toggle("scrolled", window.scrollY > 24);
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

let toastTimer;
const showToast = (message) => {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 3000);
};

document.querySelectorAll(".service-enquiry").forEach((button) => {
  button.addEventListener("click", () => {
    const service = button.dataset.service;
    if (serviceSelect && service) serviceSelect.value = service;
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
    showToast(`${service} selected — add your details below.`);
  });
});

quoteForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!quoteForm.reportValidity()) return;

  const data = new FormData(quoteForm);
  const name = data.get("name");
  const vehicle = data.get("vehicle");
  const service = data.get("service");
  const message = data.get("message");

  const lines = [
    `Hi ProTech Performance, I'm ${name}.`,
    `Vehicle: ${vehicle}`,
    `Service: ${service}`,
  ];

  if (message) lines.push(`Details: ${message}`);
  lines.push("Could I get a quote, please?");

  const whatsappUrl = `https://wa.me/60126565915?text=${encodeURIComponent(lines.join("\n"))}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
});

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();
