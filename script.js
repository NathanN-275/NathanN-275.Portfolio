const navLinks = Array.from(document.querySelectorAll("[data-section]"));
const sections = Array.from(document.querySelectorAll("[data-observe-section]"));
const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
const projectCards = Array.from(document.querySelectorAll("[data-category]"));

const setActiveLink = (sectionId) => {
  navLinks.forEach((link) => {
    const isActive = link.dataset.section === sectionId;
    link.classList.toggle("active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

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

  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) {
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

const observer = new IntersectionObserver(updateActiveFromScroll, {
  rootMargin: "-18% 0px -40% 0px",
  threshold: [0, 0.2, 0.45, 0.7, 1]
});

sections.forEach((section) => observer.observe(section));
window.addEventListener("scroll", updateActiveFromScroll, { passive: true });
window.addEventListener("resize", updateActiveFromScroll);
window.addEventListener("hashchange", () => {
  if (!updateActiveFromHash()) {
    updateActiveFromScroll();
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.toggle("selected", item === button));
    projectCards.forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.category !== filter;
    });
  });
});

if (!updateActiveFromHash()) {
  updateActiveFromScroll();
}
