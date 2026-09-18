"use strict";

const CONFIG = {
  whatsapp: "919939250070",
  phone: "9939250070",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=NoDoubts+English+Classes+Lalganj+Vaishali+Bihar",
  social: {
    instagram: "#",
    facebook: "#",
    youtube: "#",
    telegram: "#"
  }
};

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

// Mobile menu
const menuBtn = $("#menuBtn");
const nav = $("#nav");
if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuBtn.classList.toggle("active", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("menu-open", open);
  });
  $$(".nav-link, .nav-cta", nav).forEach(link => link.addEventListener("click", closeMenu));
}
function closeMenu() {
  nav?.classList.remove("open");
  menuBtn?.classList.remove("active");
  menuBtn?.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}

// Header + back to top
const header = $("#header");
const backTop = $("#backTop");
function updateScrollUI() {
  const y = window.scrollY;
  header?.classList.toggle("scrolled", y > 45);
  backTop?.classList.toggle("show", y > 500);
}
window.addEventListener("scroll", updateScrollUI, { passive: true });
updateScrollUI();
backTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// Active navigation
const sections = $$("main section[id]");
const navLinks = $$(".nav-link");
function updateActiveNav() {
  let current = "home";
  const marker = window.scrollY + 170;
  sections.forEach(section => {
    if (marker >= section.offsetTop && marker < section.offsetTop + section.offsetHeight) current = section.id;
  });
  navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${current}`));
}
window.addEventListener("scroll", updateActiveNav, { passive: true });
updateActiveNav();

// Scroll reveal
const revealItems = $$(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  revealItems.forEach(item => observer.observe(item));
} else revealItems.forEach(item => item.classList.add("visible"));

// FAQ accordion
$$(".faq-item").forEach(item => {
  const button = $(".faq-question", item);
  const answer = $(".faq-answer", item);
  button?.addEventListener("click", () => {
    const wasOpen = item.classList.contains("open");
    $$(".faq-item").forEach(other => {
      other.classList.remove("open");
      const otherAnswer = $(".faq-answer", other);
      if (otherAnswer) otherAnswer.style.maxHeight = null;
    });
    if (!wasOpen) {
      item.classList.add("open");
      answer.style.maxHeight = answer.scrollHeight + "px";
    }
  });
});

// WhatsApp enquiry form
const enquiryForm = $("#enquiryForm");
enquiryForm?.addEventListener("submit", event => {
  event.preventDefault();
  const name = $("#name")?.value.trim();
  const phone = $("#phone")?.value.trim();
  const course = $("#course")?.value;
  const message = $("#message")?.value.trim();
  if (!name || !phone || !course) {
    showToast("Please fill your name, phone number and course.");
    return;
  }
  const cleanPhone = phone.replace(/\D/g, "");
  if (cleanPhone.length < 10) {
    showToast("Please enter a valid phone number.");
    return;
  }
  const text = `Hello NoDoubts English Classes,\n\nI want information about your classes.\n\nName: ${name}\nPhone: ${phone}\nInterested Course: ${course}\n\nMessage:\n${message || "I want to know more about this course."}`;
  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  enquiryForm.reset();
});

// Editable social links — replace # with the client's real links.
$$('[data-social]').forEach(link => {
  const key = link.dataset.social;
  const url = CONFIG.social[key];
  if (url && url !== "#") {
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  } else {
    link.addEventListener("click", event => {
      event.preventDefault();
      showToast(`Add the ${key} link in app.js first.`);
    });
  }
});

// Prevent empty hashes
$$('a[href="#"]').forEach(link => link.addEventListener("click", e => e.preventDefault()));

// Keyboard escape
window.addEventListener("keydown", event => {
  if (event.key === "Escape") closeMenu();
});

// Year
$("#year") && ($("#year").textContent = new Date().getFullYear());

let toastTimer;
function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}
