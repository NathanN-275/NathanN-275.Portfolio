const navLinks = Array.from(document.querySelectorAll("[data-section]"));
const sections = Array.from(document.querySelectorAll("[data-observe-section]"));

const setActiveLink = (sectionId) => {
  navLinks.forEach((link) => {
    const isActive = link.dataset.section === sectionId;
    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

const sectionRatios = new Map(sections.map((section) => [section.id, 0]));
const validSectionIds = new Set(sections.map((section) => section.id));
let hashLockUntil = 0;

const updateActiveFromHash = () => {
  const sectionId = window.location.hash.replace("#", "");
  if (validSectionIds.has(sectionId)) {
    setActiveLink(sectionId);
    hashLockUntil = Date.now() + 900;
    return true;
  }

  return false;
};

const updateActiveFromScroll = () => {
  if (Date.now() < hashLockUntil) {
    return;
  }

  const page = document.documentElement;
  if (window.scrollY + window.innerHeight >= page.scrollHeight - 4) {
    setActiveLink(sections[sections.length - 1].id);
    return;
  }

  const viewportAnchor = window.innerHeight * 0.58;
  let current = sections[0]?.id;

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= viewportAnchor && rect.bottom > 0) {
      current = section.id;
    }
  });

  if (current) {
    setActiveLink(current);
  }
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      sectionRatios.set(entry.target.id, entry.intersectionRatio);
    });

    updateActiveFromScroll();
    const strongest = Array.from(sectionRatios.entries()).sort((a, b) => b[1] - a[1])[0];
    if (strongest && strongest[1] > 0) {
      updateActiveFromScroll();
    }
  },
  {
    rootMargin: "-18% 0px -48% 0px",
    threshold: [0, 0.2, 0.35, 0.5, 0.65, 0.8, 1]
  }
);

sections.forEach((section) => observer.observe(section));
window.addEventListener("scroll", updateActiveFromScroll, { passive: true });
window.addEventListener("resize", updateActiveFromScroll);
window.addEventListener("hashchange", () => {
  if (!updateActiveFromHash()) {
    updateActiveFromScroll();
  }
});

if (!updateActiveFromHash()) {
  updateActiveFromScroll();
}

const year = document.querySelector("[data-current-year]");
if (year) {
  year.textContent = new Date().getFullYear();
}
