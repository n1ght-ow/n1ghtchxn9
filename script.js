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
    {
      title: "Branches against white",
      alt: "Bare tree branches silhouetted against a pale sky",
      cat: "tree",
      tag: "FLORA",
      src: "photos/1779456446198.jpg",
      size: "wide",
    },
    {
      title: "Dogwood in late light",
      alt: "White dogwood blossoms lit from the side",
      cat: "flower",
      tag: "FLORA",
      src: "photos/1779456446218.jpg",
      size: "",
    },
    {
      title: "Apricot blossoms in blue",
      alt: "White apricot blossoms against a soft blue background",
      cat: "flower",
      tag: "FLORA",
      src: "photos/1779456446227.jpg",
      size: "",
    },
    {
      title: "Magnolia / clear sky",
      alt: "Magnolia blossoms reaching into a clear blue sky",
      cat: "flower",
      tag: "FLORA",
      src: "photos/1779456446231.jpg",
      size: "wide",
    },
    {
      title: "Before bloom / backlit",
      alt: "An unopened flower bud illuminated from behind",
      cat: "flower",
      tag: "FLORA",
      src: "photos/1779456446240.jpg",
      size: "",
    },
    {
      title: "Apricot branch / open sky",
      alt: "A flowering apricot branch crossing an open blue sky",
      cat: "flower",
      tag: "FLORA",
      src: "photos/1779456446245.jpg",
      size: "",
    },
    {
      title: "Magnolia / morning light",
      alt: "A close view of white magnolia petals in morning light",
      cat: "flower",
      tag: "FLORA",
      src: "photos/1779456446248.jpg",
      size: "",
    },
    {
      title: "Cloudbank at the edge of the plain",
      alt: "A bank of white clouds rising beyond open grassland",
      cat: "sky",
      tag: "WEATHER",
      src: "photos/SAVE_20260616_234154.jpg",
      size: "",
    },
    {
      title: "Weather moving over the grassland",
      alt: "Cloud shadows moving across a wide grassland",
      cat: "sky",
      tag: "WEATHER",
      src: "photos/SAVE_20260616_234224.jpg",
      size: "",
    },
    {
      title: "One cloud beyond the ridge",
      alt: "A single white cloud floating beyond a green ridge",
      cat: "sky",
      tag: "WEATHER",
      src: "photos/SAVE_20260616_234337.jpg",
      size: "",
    },
    {
      title: "Clouds resting beyond the grassland",
      alt: "Large white clouds resting above a distant grassland ridge",
      cat: "sky",
      tag: "WEATHER",
      src: "photos/SAVE_20260616_234423.jpg",
      size: "wide",
    },
  ];

  /* ---------- Build gallery ---------- */
  const gallery = document.getElementById("gallery");
  const webImg = (src, kind) =>
    `photos/web/${src.replace(/^photos\//, "").replace(/\.[^.]+$/, "")}-${kind}.jpg`;

  const cardSizes = (size) => size === "wide"
    ? "(max-width: 720px) calc(100vw - 40px), (max-width: 1340px) calc(100vw - 80px), 1260px"
    : "(max-width: 720px) calc(100vw - 40px), (max-width: 1340px) calc(50vw - 60px), 611px";

  const built = PHOTOS.map((p, i) => {
    const sizeClass = p.size === "wide" ? "card--wide" : p.size === "tall" ? "card--tall" : "";
    const el = document.createElement("button");
    el.type = "button";
    el.className = `card ${sizeClass}`.trim();
    el.dataset.cat = p.cat;
    el.dataset.index = i;
    el.setAttribute("aria-label", `Open frame ${String(i + 1).padStart(2, "0")}: ${p.title}`);
    el.setAttribute("aria-haspopup", "dialog");
    el.innerHTML = `
      <span class="card__surface">
        <span class="card__visual">
          <img
            src="${webImg(p.src, "small")}"
            srcset="${webImg(p.src, "small")} 800w, ${webImg(p.src, "thumb")} 1400w"
            sizes="${cardSizes(p.size)}"
            alt="${p.alt}"
            loading="lazy"
            decoding="async"
            fetchpriority="low"
          />
          <span class="card__index">${String(i + 1).padStart(2, "0")}</span>
          <span class="card__open" aria-hidden="true">↗</span>
        </span>
        <span class="card__caption">
          <span class="card__title">${p.title}</span>
          <span class="card__cat">${p.tag}</span>
        </span>
      </span>`;
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
    { title: "Cyberpunk 2077", genre: "Action RPG", groupKey: "story", dev: "CD PROJEKT RED", year: "2020—2023",
      verse: ["I kept it for the weather: neon after rain, a city that never stops performing.", "Every street feels like a drawer full of unfinished futures."],
      cover: "photos/covers/cyberpunk.jpg", size: "feature" },
    { title: "Detroit: Become Human", genre: "Narrative", groupKey: "story", dev: "Quantic Dream", year: "2018",
      verse: ["I kept it for the quiet question underneath the spectacle: who gets to choose?", "Every small decision leaves a mark on the room."],
      cover: "photos/covers/detroit.jpg", size: "" },
    { title: "Red Dead Redemption 2", genre: "Open World", groupKey: "story", dev: "Rockstar Games", year: "2018",
      verse: ["I kept it for the long pauses between destinations — smoke, dust, and a horizon with nowhere to be.", "It makes slowness feel like a kind of courage."],
      cover: "photos/covers/rdr2.jpg", size: "" },
    { title: "Grand Theft Auto V", genre: "Open World", groupKey: "story", dev: "Rockstar Games", year: "2013",
      verse: ["I kept it as a noisy postcard of a city that mistakes appetite for identity.", "It is ugly, bright, funny, and impossible to look away from."],
      cover: "photos/covers/gta5.jpg", size: "" },
    { title: "Counter-Strike", genre: "Tactical FPS", groupKey: "systems", dev: "Valve", year: "2000—",
      verse: ["I kept it for the ritual: the same rooms, the same tension, a different answer every round.", "Precision turns into a kind of handwriting."],
      cover: "photos/covers/counter-strike.jpg", size: "two" },
    { title: "Football Manager", genre: "Management", groupKey: "systems", dev: "Sports Interactive", year: "2004—",
      verse: ["I kept it for the tiny biographies hiding inside a spreadsheet.", "A name becomes a story the moment you decide to trust them."],
      cover: "photos/covers/football-manager.jpg", size: "two" },
    { title: "Forza Horizon 4", genre: "Racing", groupKey: "motion", dev: "Playground Games", year: "2018",
      verse: ["I kept it for the low sun, wet roads, and the pleasure of going nowhere on purpose.", "Sometimes motion is the whole collection."],
      cover: "photos/covers/forza-horizon-4.jpg", size: "feature" },
  ];

  const gamesGrid = document.getElementById("gamesGrid");
  if (gamesGrid) {
    const gameCover = (g) =>
      g.cover
        ? `<img class="game__img" src="${g.cover}" alt="" width="1600" height="900" loading="lazy" decoding="async" fetchpriority="low" />`
        : `<div class="game__ph" aria-hidden="true"><span class="game__ph-title">${g.title}</span><span class="game__ph-note">artwork pending</span></div>`;

    GAMES.forEach((g, i) => {
      const el = document.createElement("article");
      el.className = `game reveal${g.size ? ` game--${g.size}` : ""}`;
      el.dataset.genre = g.groupKey;
      el.style.setProperty("--i", i);
      el.innerHTML = `
        <div class="game__cover">
          ${gameCover(g)}
          <span class="game__number" aria-hidden="true">G-${String(i + 1).padStart(2, "0")}</span>
        </div>
        <div class="game__body">
          <span class="game__genre">${g.genre}</span>
          <h3 class="game__title">${g.title}</h3>
          <div class="game__verse">
            <span class="game__why">Why I kept it</span>
            <p>${g.verse.join(" ")}</p>
          </div>
          <div class="game__footer">
            <p class="game__meta">${g.dev} · ${g.year}</p>
            <span class="game__mark" aria-hidden="true">Archive note</span>
          </div>
        </div>`;
      gamesGrid.appendChild(el);
    });

    const gamesFilters = document.getElementById("gamesFilters");
    const gamesFilterStatus = document.getElementById("gamesFilterStatus");
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
        let visibleCount = 0;
        animateReflow(gameCards, () => {
          gameCards.forEach((c) => {
            const show = f === "all" || c.dataset.genre === f;
            c.classList.toggle("is-hidden", !show);
            c.classList.toggle("is-in", show);
            if (show) visibleCount += 1;
          });
        });
        if (gamesFilterStatus) {
          const label = { story: "story-world", systems: "systems", motion: "motion" }[f];
          gamesFilterStatus.textContent = `Showing ${visibleCount} ${label ? `${label} ` : ""}game${visibleCount === 1 ? "" : "s"}.`;
        }
      });
    }
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = [...document.querySelectorAll(".reveal")];
  document.querySelectorAll("section").forEach((section) => {
    section.querySelectorAll(".reveal").forEach((el, index) => {
      el.style.setProperty("--reveal-delay", `${Math.min(index, 7) * 70}ms`);
    });
  });

  if ("IntersectionObserver" in window && !reduceMotion) {
    revealEls.forEach((el) => el.classList.add("is-pending"));
    built.forEach((el) => el.classList.add("is-pending"));

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting && !e.target.dataset.motionDone) {
          e.target.dataset.motionDone = "true";
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      }),
      { threshold: 0.05, rootMargin: "0px 0px -12%" }
    );
    revealEls.forEach((el) => io.observe(el));

    const cardRevealTimers = new WeakMap();
    const cardIO = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          const timer = window.setTimeout(() => {
            if (!e.target.classList.contains("is-hidden")) e.target.classList.add("is-in");
            cardRevealTimers.delete(e.target);
          }, (Number(e.target.dataset.stagger) || 0) * 65);
          cardRevealTimers.set(e.target, timer);
          cardIO.unobserve(e.target);
        }
      }),
      { threshold: 0.05, rootMargin: "0px 0px -10%" }
    );

    const restagger = () => {
      let s = 0;
      built.forEach((c) => {
        if (!c.classList.contains("is-hidden")) c.dataset.stagger = s++;
      });
    };

    window.__cardIO = cardIO;
    window.__cardRevealTimers = cardRevealTimers;
    window.__restaggerCards = restagger;
    restagger();
    built.forEach((c) => cardIO.observe(c));
  } else {
    window.__restaggerCards = () => {};
  }

  /* ---------- Layout choreography ---------- */
  const animateReflow = (items, mutate) => {
    if (reduceMotion) {
      mutate();
      return;
    }
    const first = new Map(items.map((item) => [item, item.getBoundingClientRect()]));
    mutate();
    requestAnimationFrame(() => {
      items.forEach((item) => {
        if (item.classList.contains("is-hidden")) return;
        const from = first.get(item);
        const to = item.getBoundingClientRect();
        if (!from || !from.width || !from.height || !to.width || !to.height) return;
        const dx = from.left - to.left;
        const dy = from.top - to.top;
        if (Math.abs(dx) + Math.abs(dy) < 1) return;
        if (!item.animate) return;
        item.getAnimations?.().forEach((animation) => animation.cancel());
        item.animate(
          [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "translate(0, 0)" }],
          { duration: 680, easing: "cubic-bezier(.16,1,.3,1)" }
        );
      });
    });
  };

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
    const shouldShowPhoto = (c) => f === "all" || (f === "botanical" && (c.dataset.cat === "tree" || c.dataset.cat === "flower")) || (f === "open-sky" && c.dataset.cat === "sky");
    animateReflow(built, () => {
      built.forEach((c) => {
        window.clearTimeout(window.__cardRevealTimers?.get(c));
        const show = shouldShowPhoto(c);
        c.classList.toggle("is-hidden", !show);
        c.classList.remove("is-in");
        if (show) visibleCount += 1;
      });
    });

    const subject = { botanical: "flora", "open-sky": "weather" }[f];
    photoFilterStatus.textContent = `${visibleCount} ${subject ? `${subject} ` : ""}frame${visibleCount === 1 ? "" : "s"} shown.`;

    window.__restaggerCards?.();
    requestAnimationFrame(() => {
      built.forEach((c) => {
        if (c.classList.contains("is-hidden")) return;
        if (window.__cardIO) window.__cardIO.observe(c);
        else c.classList.add("is-in");
      });
      window.__measureShelf?.();
    });
  });

  /* ---------- Kinetic image shelf ---------- */
  const workSection = document.getElementById("work");
  const workViewport = workSection?.querySelector(".work__viewport");
  const shelfCursor = document.getElementById("shelfCursor");
  const shelfQuery = window.matchMedia("(min-width: 768px)");

  if (workSection && workViewport && shelfCursor) {
    let shelfStart = 0;
    let shelfRange = 0;
    let shelfTravel = 0;
    let shelfTarget = 0;
    let shelfCurrent = 0;
    let shelfFrame = 0;
    let measureFrame = 0;
    let cursorFrame = 0;
    let cursorX = 0;
    let cursorY = 0;

    const clampShelf = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
    const visibleShelfCards = () => built.filter((card) => !card.classList.contains("is-hidden"));

    const renderShelf = () => {
      shelfCurrent += (shelfTarget - shelfCurrent) * (reduceMotion ? 1 : 0.14);
      if (shelfTarget < 0.002) shelfCurrent = 0;
      if (shelfTarget > 0.998) shelfCurrent = 1;
      const x = -shelfTravel * shelfCurrent;
      workSection.style.setProperty("--shelf-progress", shelfCurrent.toFixed(4));
      workSection.style.setProperty("--shelf-x", `${x.toFixed(2)}px`);

      visibleShelfCards().forEach((card) => {
        const center = card.offsetLeft + card.offsetWidth / 2 + x;
        const phase = clampShelf((center - window.innerWidth / 2) / window.innerWidth, -1, 1);
        card.style.setProperty("--image-shift", `${(-phase * 14).toFixed(2)}px`);
      });

      if (Math.abs(shelfTarget - shelfCurrent) > 0.0008) shelfFrame = requestAnimationFrame(renderShelf);
      else shelfFrame = 0;
    };

    const updateShelfTarget = () => {
      if (!shelfQuery.matches || !shelfRange) return;
      shelfTarget = clampShelf((window.scrollY - shelfStart) / shelfRange);
      if (!shelfFrame) shelfFrame = requestAnimationFrame(renderShelf);
    };

    const teardownShelf = () => {
      cancelAnimationFrame(shelfFrame);
      shelfFrame = 0;
      shelfTravel = shelfRange = shelfTarget = shelfCurrent = 0;
      workSection.classList.remove("is-kinetic");
      workSection.style.removeProperty("--shelf-height");
      workSection.style.removeProperty("--shelf-progress");
      workSection.style.removeProperty("--shelf-x");
      built.forEach((card) => card.style.removeProperty("--image-shift"));
    };

    const measureShelf = () => {
      cancelAnimationFrame(measureFrame);
      measureFrame = requestAnimationFrame(() => {
        cancelAnimationFrame(shelfFrame);
        shelfFrame = 0;
        if (!shelfQuery.matches || !CSS.supports("position", "sticky")) {
          teardownShelf();
          return;
        }
        const previousRange = shelfRange;
        const previousStart = shelfStart;
        const previousProgress = previousRange ? clampShelf((window.scrollY - previousStart) / previousRange) : 0;
        const wasInside = previousRange > 0 && window.scrollY >= previousStart && window.scrollY <= previousStart + previousRange;

        workSection.classList.add("is-kinetic");
        shelfTravel = Math.max(0, gallery.scrollWidth - workViewport.clientWidth);
        shelfRange = shelfTravel > 8 ? Math.max(window.innerHeight * 1.15, shelfTravel * 1.08) : 0;
        workSection.style.setProperty("--shelf-height", `${window.innerHeight + shelfRange}px`);

        requestAnimationFrame(() => {
          shelfStart = workSection.getBoundingClientRect().top + window.scrollY;
          if (wasInside) window.scrollTo({ top: shelfStart + previousProgress * shelfRange, behavior: "auto" });
          shelfTarget = shelfRange ? clampShelf((window.scrollY - shelfStart) / shelfRange) : 0;
          shelfCurrent = shelfTarget;
          renderShelf();
        });
      });
    };

    const scheduleShelfMeasure = () => measureShelf();
    window.__measureShelf = scheduleShelfMeasure;
    window.addEventListener("scroll", updateShelfTarget, { passive: true });
    window.addEventListener("resize", scheduleShelfMeasure, { passive: true });
    if (shelfQuery.addEventListener) shelfQuery.addEventListener("change", (event) => event.matches ? scheduleShelfMeasure() : teardownShelf());
    else shelfQuery.addListener((event) => event.matches ? scheduleShelfMeasure() : teardownShelf());
    if ("ResizeObserver" in window) new ResizeObserver(scheduleShelfMeasure).observe(gallery);
    else window.addEventListener("resize", scheduleShelfMeasure, { passive: true });
    document.fonts?.ready?.then(scheduleShelfMeasure);
    gallery.querySelectorAll("img").forEach((image) => image.addEventListener("load", scheduleShelfMeasure, { once: true }));

    workViewport.addEventListener("pointermove", (event) => {
      const card = event.target.closest(".card:not(.is-hidden)");
      workViewport.classList.toggle("is-cursor-visible", Boolean(card));
      if (!card) return;
      const rect = workViewport.getBoundingClientRect();
      cursorX = event.clientX - rect.left;
      cursorY = event.clientY - rect.top;
      if (cursorFrame) return;
      cursorFrame = requestAnimationFrame(() => {
        workViewport.style.setProperty("--cursor-x", `${cursorX}px`);
        workViewport.style.setProperty("--cursor-y", `${cursorY}px`);
        cursorFrame = 0;
      });
    });
    workViewport.addEventListener("pointerleave", () => workViewport.classList.remove("is-cursor-visible"));

    gallery.addEventListener("focusin", (event) => {
      const card = event.target.closest(".card:not(.is-hidden)");
      if (!card || !shelfQuery.matches || !shelfTravel) return;
      requestAnimationFrame(() => {
        if (!card.matches(":focus-visible")) return;
        const cardRect = card.getBoundingClientRect();
        const viewportRect = workViewport.getBoundingClientRect();
        if (cardRect.left >= viewportRect.left && cardRect.right <= viewportRect.right) return;
        const desiredX = clampShelf((card.offsetLeft + card.offsetWidth / 2 - workViewport.clientWidth / 2) / shelfTravel);
        window.scrollTo({ top: shelfStart + desiredX * shelfRange, behavior: "auto" });
      });
    });

    scheduleShelfMeasure();
  }

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
  let lightboxRequest = 0;

  const setRegionsInert = (regions, inert) => {
    regions.forEach((region) => region.toggleAttribute("inert", inert));
  };

  const visibleCards = () => built.filter((c) => !c.classList.contains("is-hidden"));

  function renderLightbox(list) {
    const card = list[current];
    const p = PHOTOS[Number(card.dataset.index)];
    lbImg.src = card._display;
    lbImg.alt = p.alt;
    lbTitle.textContent = p.title;
    lbCat.textContent = p.tag;
    lbCount.textContent = `${String(current + 1).padStart(2, "0")} / ${String(list.length).padStart(2, "0")}`;
    lbOriginal.dataset.full = card._full;
    lbOriginal.textContent = "View original";
    lbOriginal.disabled = false;
    lbOriginal.hidden = false;
  }

  function openLightbox(card) {
    const request = ++lightboxRequest;
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
      if (request !== lightboxRequest) return;
      lb.classList.add("is-open");
      window.setTimeout(() => lbClose.focus({ preventScroll: true }), 0);
    };
    lbImg.decode ? lbImg.decode().then(reveal).catch(reveal) : reveal();
  }

  function step(dir) {
    const list = visibleCards();
    if (!list.length) return;
    current = (current + dir + list.length) % list.length;
    const request = ++lightboxRequest;
    lbImg.style.opacity = "0";
    setTimeout(() => {
      if (request !== lightboxRequest || !lb.classList.contains("is-open")) return;
      renderLightbox(list);
      const reveal = () => { if (request === lightboxRequest) lbImg.style.opacity = "1"; };
      lbImg.decode ? lbImg.decode().then(reveal).catch(reveal) : reveal();
    }, 150);
  }

  function closeLightbox() {
    lightboxRequest += 1;
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
  const scrollProgress = document.getElementById("scrollProgress");
  const menuQuery = window.matchMedia("(max-width: 720px)");
  const menuBackground = [mainContent, pageFooter].filter(Boolean);
  const navTargets = [...navLinks.querySelectorAll('a[href^="#"]')]
    .map((link) => ({ link, section: document.querySelector(link.getAttribute("href")) }))
    .filter((item) => item.section);

  function updateScrollFx() {
    nav.classList.toggle("is-scrolled", window.scrollY > 40);

    const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, window.scrollY / scrollable));
    if (scrollProgress) scrollProgress.style.transform = `scaleX(${progress})`;
    if (!reduceMotion) {
      document.documentElement.style.setProperty("--hero-shift", `${Math.min(22, window.scrollY * 0.025)}px`);
    }

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
      copyEmail.textContent = "Copy address";
      copyEmail.classList.remove("is-copied");
    }, 2200);
  });

  /* ---------- Subtle collection-room motion ---------- */
  if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    const heroImage = document.querySelector(".hero__media-image");
    if (heroImage) {
      let heroRect = null;
      let tiltFrame = 0;
      let pointerX = 0;
      let pointerY = 0;
      const refreshHeroRect = () => { heroRect = heroImage.getBoundingClientRect(); };
      refreshHeroRect();
      window.addEventListener("resize", refreshHeroRect, { passive: true });
      heroImage.addEventListener("pointermove", (event) => {
        if (!heroRect) refreshHeroRect();
        pointerX = (event.clientX - heroRect.left) / heroRect.width - 0.5;
        pointerY = (event.clientY - heroRect.top) / heroRect.height - 0.5;
        if (tiltFrame) return;
        tiltFrame = requestAnimationFrame(() => {
          heroImage.style.setProperty("--tilt-x", `${(pointerY * -2).toFixed(2)}deg`);
          heroImage.style.setProperty("--tilt-y", `${(pointerX * 2).toFixed(2)}deg`);
          tiltFrame = 0;
        });
      });
      heroImage.addEventListener("pointerleave", () => {
        if (tiltFrame) cancelAnimationFrame(tiltFrame);
        heroImage.style.setProperty("--tilt-x", "0deg");
        heroImage.style.setProperty("--tilt-y", "0deg");
      });
    }
  }

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
