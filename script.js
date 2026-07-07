/* =========================================================
   N1GHT CHXN9 — interactions
   ========================================================= */
(() => {
  "use strict";

  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Pointer light field ---------- */
  if (!reduceMotion) {
    window.addEventListener("pointermove", (e) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      root.style.setProperty("--mx", `${e.clientX}px`);
      root.style.setProperty("--my", `${e.clientY}px`);
      root.style.setProperty("--tilt-x", nx.toFixed(3));
      root.style.setProperty("--tilt-y", ny.toFixed(3));
    }, { passive: true });
  }

  /* ---------- Photo data ----------
     Real shots live in the /photos folder.
     `src` is the original file path.
     `size` controls layout: "" (default), "wide", or "tall".
  */
  const PHOTOS = [
    { title: "Tree shadows in monochrome", cat: "tree", tag: "TREE", src: "photos/1779456446198.jpg", size: "wide" },
    { title: "Dogwood", cat: "flower", tag: "FLOWER", src: "photos/1779456446218.jpg", size: "" },
    { title: "Apricot blossoms falling into a blue dream", cat: "flower", tag: "FLOWER", src: "photos/1779456446227.jpg", size: "" },
    { title: "Magnolia breathing the clear sky", cat: "flower", tag: "FLOWER", src: "photos/1779456446231.jpg", size: "wide" },
    { title: "A spring yet to open, backlit", cat: "flower", tag: "FLOWER", src: "photos/1779456446240.jpg", size: "" },
    { title: "A single apricot branch lifting the sky", cat: "flower", tag: "FLOWER", src: "photos/1779456446245.jpg", size: "" },
    { title: "Magnolia kneading light into snow", cat: "flower", tag: "FLOWER", src: "photos/1779456446248.jpg", size: "" },
    { title: "Clouds growing at the edge of the plain", cat: "sky", tag: "SKY", src: "photos/SAVE_20260616_234154.jpg", size: "wide" },
    { title: "Wind from the cloud city across the plain", cat: "sky", tag: "SKY", src: "photos/SAVE_20260616_234224.jpg", size: "" },
    { title: "A hillside cradling a white cloud", cat: "sky", tag: "SKY", src: "photos/SAVE_20260616_234337.jpg", size: "" },
    { title: "Distant mountains dissolving into a sea of clouds", cat: "sky", tag: "SKY", src: "photos/SAVE_20260616_234423.jpg", size: "wide" },
  ];

  const ACCENTS = {
    tree: "168, 255, 47",
    flower: "255, 77, 125",
    sky: "0, 229, 255",
  };

  /* ---------- Build gallery ---------- */
  const gallery = document.getElementById("gallery");
  const webImg = (src, kind) =>
    `photos/web/${src.replace(/^photos\//, "").replace(/\.[^.]+$/, "")}-${kind}.jpg`;

  function attachCardTilt(card) {
    if (reduceMotion) return;
    card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      card.style.setProperty("--px", `${(px * 100).toFixed(2)}%`);
      card.style.setProperty("--py", `${(py * 100).toFixed(2)}%`);
      card.style.setProperty("--rx", `${((0.5 - py) * 12).toFixed(2)}deg`);
      card.style.setProperty("--ry", `${((px - 0.5) * 14).toFixed(2)}deg`);
    }, { passive: true });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--px", "50%");
      card.style.setProperty("--py", "50%");
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
  }

  function attachKineticControl(el) {
    if (el.dataset.kinetic === "true") return;
    el.dataset.kinetic = "true";

    const setPoint = (event) => {
      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      el.style.setProperty("--btn-x", `${x}px`);
      el.style.setProperty("--btn-y", `${y}px`);
      el.style.setProperty("--ripple-x", `${x}px`);
      el.style.setProperty("--ripple-y", `${y}px`);
    };

    el.addEventListener("pointermove", setPoint, { passive: true });
    el.addEventListener("pointerdown", (event) => {
      setPoint(event);
      const ripple = document.createElement("span");
      ripple.className = "control-ripple";
      el.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
    }, { passive: true });
  }

  const built = PHOTOS.map((p, i) => {
    const sizeClass = p.size === "wide" ? "card--wide" : p.size === "tall" ? "card--tall" : "";
    const el = document.createElement("article");
    el.className = `card ${sizeClass}`.trim();
    el.dataset.cat = p.cat;
    el.dataset.index = i;
    el.tabIndex = 0;
    el.setAttribute("role", "button");
    el.setAttribute("aria-label", `Open work: ${p.title}`);
    el.style.setProperty("--accent-rgb", ACCENTS[p.cat] || "0, 229, 255");
    el.style.setProperty("--card-delay", `${i * -0.24}s`);
    el.style.setProperty("--card-float", `${i % 2 ? -7 : -4}px`);
    el.innerHTML = `
      <div class="card__surface">
        <img src="${webImg(p.src, "thumb")}" alt="${p.title}" loading="lazy" />
        <span class="card__index">${String(i + 1).padStart(2, "0")}</span>
        <div class="card__plus" aria-hidden="true">+</div>
        <div class="card__overlay">
          <span class="card__cat">${p.tag}</span>
          <span class="card__title">${p.title}</span>
        </div>
      </div>`;
    el._display = webImg(p.src, "display");
    el._full = p.src;
    gallery.appendChild(el);
    attachCardTilt(el);
    attachKineticControl(el);
    return el;
  });

  document
    .querySelectorAll(".btn, .filter, .nav__burger, .lightbox__close, .lightbox__nav, .lightbox__original, .contact__socials a, .footer a, .nav__brand, .nav__links a")
    .forEach(attachKineticControl);

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      }),
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));

    const cardIO = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add("is-in"), (Number(e.target.dataset.stagger) || 0) * 60);
          cardIO.unobserve(e.target);
        }
      }),
      { threshold: 0.12 }
    );

    const restagger = () => {
      let s = 0;
      built.forEach((c) => {
        if (!c.classList.contains("is-hidden")) c.dataset.stagger = s++;
      });
    };

    window.__cardIO = cardIO;
    window.__restaggerCards = restagger;
    restagger();
    built.forEach((c) => cardIO.observe(c));
  } else {
    revealEls.forEach((el) => el.classList.add("is-in"));
    built.forEach((c) => c.classList.add("is-in"));
    window.__restaggerCards = () => {};
  }

  /* ---------- Filters ---------- */
  const filters = document.getElementById("filters");
  filters.querySelectorAll(".filter").forEach((btn) => {
    btn.setAttribute("aria-pressed", btn.classList.contains("is-active") ? "true" : "false");
  });

  filters.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter");
    if (!btn) return;

    filters.querySelector(".is-active")?.classList.remove("is-active");
    filters.querySelectorAll(".filter").forEach((b) => b.setAttribute("aria-pressed", "false"));
    btn.classList.add("is-active");
    btn.setAttribute("aria-pressed", "true");

    const f = btn.dataset.filter;
    built.forEach((c) => {
      const show = f === "all" || c.dataset.cat === f;
      c.classList.toggle("is-hidden", !show);
      c.classList.remove("is-in");
    });

    window.__restaggerCards?.();
    requestAnimationFrame(() => {
      built.forEach((c) => {
        if (c.classList.contains("is-hidden")) return;
        if (window.__cardIO) window.__cardIO.observe(c);
        else c.classList.add("is-in");
      });
    });
  });

  /* ---------- Lightbox ---------- */
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbTitle = document.getElementById("lbTitle");
  const lbCat = document.getElementById("lbCat");
  const lbCount = document.getElementById("lbCount");
  const lbOriginal = document.getElementById("lbOriginal");
  const lbClose = document.getElementById("lbClose");
  let current = 0;
  let lastFocus = null;
  let touchStartX = 0;

  const visibleCards = () => built.filter((c) => !c.classList.contains("is-hidden"));

  function renderLightbox(list) {
    const card = list[current];
    const p = PHOTOS[Number(card.dataset.index)];
    lbImg.src = card._display;
    lbImg.alt = p.title;
    lbTitle.textContent = p.title;
    lbCat.textContent = p.tag;
    lbCount.textContent = `${String(current + 1).padStart(2, "0")} / ${String(list.length).padStart(2, "0")}`;
    lbOriginal.dataset.full = card._full;
    lbOriginal.textContent = "View original";
    lbOriginal.disabled = false;
    lbOriginal.hidden = false;
  }

  function openLightbox(card) {
    const list = visibleCards();
    current = list.indexOf(card);
    if (current < 0) return;
    lastFocus = document.activeElement;
    renderLightbox(list);
    document.body.style.overflow = "hidden";
    lbImg.style.opacity = "1";
    lb.setAttribute("aria-hidden", "false");

    const reveal = () => {
      lb.classList.add("is-open");
      lbClose.focus({ preventScroll: true });
    };
    lbImg.decode ? lbImg.decode().then(reveal).catch(reveal) : reveal();
  }

  function step(dir) {
    const list = visibleCards();
    if (!list.length) return;
    current = (current + dir + list.length) % list.length;
    lbImg.style.opacity = "0";
    setTimeout(() => {
      renderLightbox(list);
      const reveal = () => { lbImg.style.opacity = "1"; };
      lbImg.decode ? lbImg.decode().then(reveal).catch(reveal) : reveal();
    }, 150);
  }

  function closeLightbox() {
    lb.classList.remove("is-open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus({ preventScroll: true });
    }
  }

  function trapFocus(e) {
    if (e.key !== "Tab" || !lb.classList.contains("is-open")) return;
    const focusable = [...lb.querySelectorAll("button:not([hidden]):not(:disabled)")];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  gallery.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (card) openLightbox(card);
  });

  gallery.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const card = e.target.closest(".card");
    if (!card) return;
    e.preventDefault();
    openLightbox(card);
  });

  lbClose.addEventListener("click", closeLightbox);
  document.getElementById("lbNext").addEventListener("click", () => step(1));
  document.getElementById("lbPrev").addEventListener("click", () => step(-1));

  lbOriginal.addEventListener("click", () => {
    const full = lbOriginal.dataset.full;
    if (!full) return;
    lbOriginal.disabled = true;
    lbOriginal.textContent = "Loading original…";
    const hi = new Image();
    hi.onload = () => {
      lbImg.src = full;
      lbOriginal.hidden = true;
    };
    hi.onerror = () => {
      lbOriginal.textContent = "Failed — retry";
      lbOriginal.disabled = false;
    };
    hi.src = full;
  });

  lb.addEventListener("click", (e) => {
    if (e.target === lb) closeLightbox();
  });

  lb.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  lb.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) < 48) return;
    step(dx < 0 ? 1 : -1);
  }, { passive: true });

  document.addEventListener("keydown", (e) => {
    trapFocus(e);
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  });

  /* ---------- Nav scroll + mobile menu ---------- */
  const nav = document.getElementById("nav");
  const burger = document.getElementById("burger");
  const navLinks = document.querySelector(".nav__links");

  function updateScrollFx() {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const pct = Math.min(100, Math.max(0, (window.scrollY / max) * 100));
    root.style.setProperty("--scroll", pct.toFixed(2));
    nav.classList.toggle("is-scrolled", window.scrollY > 40);
  }

  updateScrollFx();
  window.addEventListener("scroll", updateScrollFx, { passive: true });

  function setMenu(open) {
    navLinks.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  }

  burger.addEventListener("click", () => setMenu(!navLinks.classList.contains("is-open")));

  navLinks.addEventListener("click", (e) => {
    if (e.target.tagName === "A") setMenu(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navLinks.classList.contains("is-open")) setMenu(false);
  });

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const counterIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = Number(el.dataset.count);
        let n = 0;
        const inc = Math.ceil(target / 42);
        const tick = () => {
          n += inc;
          if (n >= target) {
            el.textContent = target.toLocaleString();
          } else {
            el.textContent = n.toLocaleString();
            requestAnimationFrame(tick);
          }
        };
        tick();
        counterIO.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach((c) => counterIO.observe(c));
  } else {
    counters.forEach((c) => { c.textContent = Number(c.dataset.count).toLocaleString(); });
  }

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Loader ---------- */
  const loader = document.getElementById("loader");
  const bar = document.getElementById("loaderBar");
  const pct = document.getElementById("loaderPct");
  let prog = 0;
  const fake = setInterval(() => {
    prog = Math.min(prog + Math.random() * 22, 100);
    bar.style.width = `${prog}%`;
    pct.textContent = `${Math.floor(prog)}%`;
    if (prog >= 100) {
      clearInterval(fake);
      setTimeout(() => loader.classList.add("is-done"), 300);
    }
  }, 130);

  window.addEventListener("load", () => {
    prog = 100;
    bar.style.width = "100%";
    pct.textContent = "100%";
    setTimeout(() => loader.classList.add("is-done"), 380);
  });
})();
