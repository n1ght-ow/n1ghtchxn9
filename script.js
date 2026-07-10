/* =========================================================
   N1GHT CHXN9 — interactions
   ========================================================= */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  /* ---------- Build gallery ---------- */
  const gallery = document.getElementById("gallery");
  const webImg = (src, kind) =>
    `photos/web/${src.replace(/^photos\//, "").replace(/\.[^.]+$/, "")}-${kind}.jpg`;

  const built = PHOTOS.map((p, i) => {
    const sizeClass = p.size === "wide" ? "card--wide" : p.size === "tall" ? "card--tall" : "";
    const el = document.createElement("article");
    el.className = `card ${sizeClass}`.trim();
    el.dataset.cat = p.cat;
    el.dataset.index = i;
    el.tabIndex = 0;
    el.setAttribute("role", "button");
    el.setAttribute("aria-label", `Open work: ${p.title}`);
    el.innerHTML = `
      <div class="card__surface">
        <img src="${webImg(p.src, "thumb")}" alt="${p.title}" loading="lazy" decoding="async" />
        <span class="card__index">${String(i + 1).padStart(2, "0")}</span>
        <div class="card__overlay">
          <span class="card__cat">${p.tag}</span>
          <span class="card__title">${p.title}</span>
        </div>
      </div>`;
    el._display = webImg(p.src, "display");
    el._full = p.src;
    gallery.appendChild(el);
    return el;
  });

  /* ---------- Games (second archive) ----------
     To set a cover, drop an image path into `cover` ("" shows a placeholder).
     size: "feature" = full-width row, "two" = half width, "" = standard third.
  */
  const GAMES = [
    { title: "Cyberpunk 2077", genre: "Action RPG", genreKey: "rpg", dev: "CD PROJEKT RED", year: "2020",
      verse: ["Night City sells you forever and bills you by the second.", "I chrome over every part that hurts, and still feel each one."],
      cover: "photos/covers/cyberpunk.jpg", size: "feature" },
    { title: "Detroit: Become Human", genre: "Narrative", genreKey: "narrative", dev: "Quantic Dream", year: "2018",
      verse: ["They built me to obey, then called it a miracle when I refused.", "The first time I said no, I did not break. I woke."],
      cover: "photos/covers/detroit.jpg", size: "" },
    { title: "Red Dead Redemption 2", genre: "Open World", genreKey: "open-world", dev: "Rockstar Games", year: "2018",
      verse: ["The frontier was closing like a wound, and we rode into the scar.", "Right at the end, a man still gets to choose what kind of man he was."],
      cover: "photos/covers/rdr2.jpg", size: "" },
    { title: "Grand Theft Auto V", genre: "Open World", genreKey: "open-world", dev: "Rockstar Games", year: "2013",
      verse: ["Los Santos sells you the whole dream and repossesses it by nightfall.", "Three men, one city, each wanting more than any life can hold."],
      cover: "photos/covers/gta5.jpg", size: "" },
    { title: "Counter-Strike", genre: "Tactical FPS", genreKey: "fps", dev: "Valve", year: "since 2000",
      verse: ["The maps never change, so there is no one to blame but your own hands.", "A whole round can live or die in the width of a single doorway."],
      cover: "photos/covers/counter-strike.jpg", size: "two" },
    { title: "Football Manager", genre: "Management", genreKey: "management", dev: "Sports Interactive", year: "since 2004",
      verse: ["You never once touch the ball, yet no loss ever felt more like your fault.", "They stay numbers until one becomes your striker. Then he is your son."],
      cover: "photos/covers/football-manager.jpg", size: "two" },
    { title: "Forza Horizon 4", genre: "Racing", genreKey: "racing", dev: "Playground Games", year: "2018",
      verse: ["Four seasons turn over the same hills, each a fresh excuse to drive nowhere.", "No story, no stakes, just the low sun and an open road. Always enough."],
      cover: "photos/covers/forza-horizon-4.jpg", size: "feature" },
  ];

  const gamesGrid = document.getElementById("gamesGrid");
  if (gamesGrid) {
    const gameCover = (g) =>
      g.cover
        ? `<img class="game__img" src="${g.cover}" alt="${g.title} cover art" width="1600" height="900" loading="lazy" decoding="async" fetchpriority="low" />`
        : `<div class="game__ph" aria-hidden="true"><span class="game__ph-title">${g.title}</span><span class="game__ph-note">artwork pending</span></div>`;

    GAMES.forEach((g) => {
      const el = document.createElement("article");
      el.className = `game reveal${g.size ? ` game--${g.size}` : ""}`;
      el.dataset.genre = g.genreKey;
      el.innerHTML = `
        <div class="game__cover">${gameCover(g)}</div>
        <div class="game__body">
          <span class="game__genre">${g.genre}</span>
          <h3 class="game__title">${g.title}</h3>
          <blockquote class="game__verse">${g.verse.map((l) => `<span>${l}</span>`).join("")}</blockquote>
          <p class="game__meta">${g.dev} · ${g.year}</p>
        </div>`;
      gamesGrid.appendChild(el);
    });

    const gamesFilters = document.getElementById("gamesFilters");
    if (gamesFilters) {
      const gameCards = [...gamesGrid.querySelectorAll(".game")];
      gamesFilters.querySelectorAll(".filter").forEach((b) =>
        b.setAttribute("aria-pressed", b.classList.contains("is-active") ? "true" : "false"));
      gamesFilters.addEventListener("click", (e) => {
        const btn = e.target.closest(".filter");
        if (!btn) return;
        gamesFilters.querySelector(".is-active")?.classList.remove("is-active");
        gamesFilters.querySelectorAll(".filter").forEach((b) => b.setAttribute("aria-pressed", "false"));
        btn.classList.add("is-active");
        btn.setAttribute("aria-pressed", "true");
        const f = btn.dataset.filter;
        gameCards.forEach((c) => c.classList.toggle("is-hidden", !(f === "all" || c.dataset.genre === f)));
      });
    }
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && !reduceMotion) {
    revealEls.forEach((el) => el.classList.add("is-pending"));
    built.forEach((el) => el.classList.add("is-pending"));

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
    window.__restaggerCards = () => {};
  }

  /* ---------- Filters ---------- */
  const filters = document.getElementById("filters");
  const photoFilterStatus = document.getElementById("photoFilterStatus");
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
    let visibleCount = 0;
    built.forEach((c) => {
      const show = f === "all" || c.dataset.cat === f;
      c.classList.toggle("is-hidden", !show);
      c.classList.remove("is-in");
      if (show) visibleCount += 1;
    });

    const subject = { tree: "tree", flower: "flower", sky: "sky" }[f];
    photoFilterStatus.textContent = `Showing ${visibleCount} ${subject ? `${subject} ` : ""}photographs.`;

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
  const mainContent = document.querySelector("main");
  const pageFooter = document.querySelector(".footer");
  const modalBackground = [document.querySelector(".nav"), mainContent, pageFooter].filter(Boolean);
  let current = 0;
  let lastFocus = null;
  let touchStartX = 0;
  let previousBodyOverflow = "";

  const setRegionsInert = (regions, inert) => {
    regions.forEach((region) => region.toggleAttribute("inert", inert));
  };

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
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setRegionsInert(modalBackground, true);
    lbImg.style.opacity = "1";
    lb.setAttribute("aria-hidden", "false");

    const reveal = () => {
      lb.classList.add("is-open");
      window.setTimeout(() => lbClose.focus({ preventScroll: true }), 0);
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
    document.body.style.overflow = previousBodyOverflow;
    setRegionsInert(modalBackground, false);
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
      lbOriginal.textContent = "Failed, retry";
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
  const menuBackdrop = document.getElementById("menuBackdrop");
  const menuQuery = window.matchMedia("(max-width: 720px)");
  const menuBackground = [mainContent, pageFooter].filter(Boolean);
  const navTargets = [...navLinks.querySelectorAll('a[href^="#"]')]
    .map((link) => ({ link, section: document.querySelector(link.getAttribute("href")) }))
    .filter((item) => item.section);

  function updateScrollFx() {
    nav.classList.toggle("is-scrolled", window.scrollY > 40);

    const marker = window.scrollY + window.innerHeight * 0.36;
    let active = navTargets[0];
    navTargets.forEach((item) => {
      if (item.section.offsetTop <= marker) active = item;
    });
    navTargets.forEach(({ link }) => link.removeAttribute("aria-current"));
    active?.link.setAttribute("aria-current", "location");
  }

  updateScrollFx();
  let scrollScheduled = false;
  window.addEventListener("scroll", () => {
    if (scrollScheduled) return;
    scrollScheduled = true;
    requestAnimationFrame(() => {
      updateScrollFx();
      scrollScheduled = false;
    });
  }, { passive: true });

  function setMenu(open, { restoreFocus = false } = {}) {
    const shouldOpen = menuQuery.matches && open;
    navLinks.classList.toggle("is-open", shouldOpen);
    menuBackdrop.classList.toggle("is-open", shouldOpen);
    document.body.classList.toggle("menu-open", shouldOpen);
    burger.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
    burger.setAttribute("aria-label", shouldOpen ? "Close menu" : "Open menu");
    setRegionsInert(menuBackground, shouldOpen);

    if (menuQuery.matches) {
      navLinks.toggleAttribute("inert", !shouldOpen);
      navLinks.setAttribute("aria-hidden", shouldOpen ? "false" : "true");
    } else {
      navLinks.removeAttribute("inert");
      navLinks.removeAttribute("aria-hidden");
    }

    if (!shouldOpen && restoreFocus) {
      burger.focus({ preventScroll: true });
    }
  }

  burger.addEventListener("click", () => {
    const opening = !navLinks.classList.contains("is-open");
    setMenu(opening, { restoreFocus: !opening });
  });

  menuBackdrop.addEventListener("click", () => setMenu(false, { restoreFocus: true }));
  nav.querySelector(".nav__brand").addEventListener("click", () => setMenu(false));

  navLinks.addEventListener("click", (e) => {
    if (e.target.tagName === "A") setMenu(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navLinks.classList.contains("is-open")) {
      setMenu(false, { restoreFocus: true });
    }
  });

  if (menuQuery.addEventListener) menuQuery.addEventListener("change", () => setMenu(false));
  else menuQuery.addListener(() => setMenu(false));
  setMenu(false);

  /* ---------- Copy email ---------- */
  const copyEmail = document.getElementById("copyEmail");
  const copyStatus = document.getElementById("copyStatus");

  function copyBySelection(text) {
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    const copied = document.execCommand("copy");
    field.remove();
    return copied;
  }

  async function writeClipboard(text) {
    if (copyBySelection(text)) return;

    if (navigator.clipboard?.writeText) {
      await Promise.race([
        navigator.clipboard.writeText(text),
        new Promise((_, reject) => window.setTimeout(() => reject(new Error("Clipboard timed out")), 800)),
      ]);
      return;
    }

    throw new Error("Copy command failed");
  }

  function selectEmailText() {
    const emailLink = document.querySelector(".contact__mail");
    const selection = window.getSelection();
    if (!emailLink || !selection) return;
    const range = document.createRange();
    range.selectNodeContents(emailLink);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  copyEmail.addEventListener("click", async () => {
    try {
      await writeClipboard(copyEmail.dataset.email);
      copyEmail.textContent = "Copied";
      copyEmail.classList.add("is-copied");
      copyStatus.textContent = "Email address copied to clipboard.";
    } catch {
      selectEmailText();
      copyEmail.textContent = "Email selected";
      copyStatus.textContent = "Clipboard access was blocked, so the email address was selected instead.";
    }

    copyEmail.focus({ preventScroll: true });

    window.setTimeout(() => {
      copyEmail.textContent = "Copy email";
      copyEmail.classList.remove("is-copied");
    }, 2200);
  });

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
