(function () {
  "use strict";

  // Header scroll state
  var header = document.querySelector(".site-header");
  var onScroll = function () {
    if (window.scrollY > 40) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile nav toggle
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "Close" : "Menu";
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "Menu";
      });
    });
  }

  // Lightbox
  var lightbox = document.querySelector(".lightbox");
  var lbImg = lightbox.querySelector("img");
  var lbCaption = lightbox.querySelector(".lightbox-caption");
  var closeBtn = lightbox.querySelector(".lightbox-close");
  var prevBtn = lightbox.querySelector(".lightbox-prev");
  var nextBtn = lightbox.querySelector(".lightbox-next");

  var currentGroup = [];
  var currentIndex = 0;
  var lastFocused = null;

  function openLightbox(group, index) {
    currentGroup = group;
    currentIndex = index;
    render();
    lightbox.classList.add("is-open");
    lastFocused = document.activeElement;
    closeBtn.focus();
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  function render() {
    var item = currentGroup[currentIndex];
    lbImg.src = item.full;
    lbImg.alt = item.alt || "";
    lbCaption.textContent = item.caption || "";
    var multi = currentGroup.length > 1;
    prevBtn.style.display = multi ? "" : "none";
    nextBtn.style.display = multi ? "" : "none";
  }

  function step(delta) {
    currentIndex = (currentIndex + delta + currentGroup.length) % currentGroup.length;
    render();
  }

  closeBtn.addEventListener("click", closeLightbox);
  prevBtn.addEventListener("click", function () { step(-1); });
  nextBtn.addEventListener("click", function () { step(1); });
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  });

  document.querySelectorAll("[data-gallery]").forEach(function (galleryEl) {
    var buttons = Array.prototype.slice.call(galleryEl.querySelectorAll("button[data-full]"));
    var group = buttons.map(function (btn) {
      var img = btn.querySelector("img");
      return { full: btn.getAttribute("data-full"), alt: img ? img.alt : "", caption: img ? img.alt : "" };
    });
    buttons.forEach(function (btn, i) {
      btn.addEventListener("click", function () { openLightbox(group, i); });
    });
  });

  // Cover images also open their project's first gallery image set
  document.querySelectorAll("[data-cover-open]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var galleryEl = document.querySelector(btn.getAttribute("data-cover-open"));
      if (!galleryEl) return;
      var buttons = Array.prototype.slice.call(galleryEl.querySelectorAll("button[data-full]"));
      var group = buttons.map(function (b) {
        var img = b.querySelector("img");
        return { full: b.getAttribute("data-full"), alt: img ? img.alt : "", caption: img ? img.alt : "" };
      });
      openLightbox(group, 0);
    });
  });

  // Secondary "more work" cards open a single-image lightbox
  document.querySelectorAll(".more-card[data-full]").forEach(function (card) {
    card.addEventListener("click", function (e) {
      e.preventDefault();
      var img = card.querySelector("img");
      openLightbox([{ full: card.getAttribute("data-full"), alt: img ? img.alt : "", caption: img ? img.alt : "" }], 0);
    });
  });

  // Current year
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
