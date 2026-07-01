/* =========================================================
   N1GHT CHXN9 — interactions
   ========================================================= */
(() => {
  "use strict";

  /* ---------- Photo data ----------
     Swap these for your real photos later:
     replace `src` with a path like "photos/my-shot.jpg".
     `size` controls layout: "" (default), "wide", or "tall".
  */
  const PHOTOS = [
    { title: "晨雾中的山谷",   cat: "mountain", tag: "MOUNTAIN", seed: "misty-valley-01", size: "wide" },
    { title: "海边的日出",     cat: "sea",      tag: "OCEAN",    seed: "sea-sunrise-02", size: "tall" },
    { title: "松林小径",       cat: "forest",   tag: "FOREST",   seed: "pine-path-03",   size: "" },
    { title: "云海之上",       cat: "mountain", tag: "MOUNTAIN", seed: "cloud-sea-04",   size: "" },
    { title: "金色麦田",       cat: "field",    tag: "FIELD",    seed: "wheat-05",       size: "wide" },
    { title: "潮汐与礁石",     cat: "sea",      tag: "OCEAN",    seed: "tide-rocks-06",  size: "" },
    { title: "薄雾森林",       cat: "forest",   tag: "FOREST",   seed: "foggy-woods-07", size: "tall" },
    { title: "雪山之巅",       cat: "mountain", tag: "MOUNTAIN", seed: "snow-peak-08",   size: "" },
    { title: "静谧的湖面",     cat: "sea",      tag: "OCEAN",    seed: "calm-lake-09",   size: "" },
    { title: "蓝天与白云",     cat: "sky",      tag: "SKY",      seed: "blue-sky-10",    size: "" },
    { title: "秋天的白桦",     cat: "forest",   tag: "FOREST",   seed: "autumn-birch-11", size: "tall" },
    { title: "黄昏的天空",     cat: "sky",      tag: "SKY",      seed: "dusk-sky-12",    size: "wide" },
    { title: "花海漫漫",       cat: "field",    tag: "FIELD",    seed: "flower-field-13", size: "" },
    { title: "星空下的山脊",   cat: "sky",      tag: "SKY",      seed: "starry-ridge-14", size: "" },
    { title: "层层梯田",       cat: "field",    tag: "FIELD",    seed: "terrace-15",     size: "" },
  ];

  const imgUrl = (seed, w, h) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

  /* ---------- Build gallery ---------- */
  const gallery = document.getElementById("gallery");
  const built = PHOTOS.map((p, i) => {
    const sizeClass = p.size === "wide" ? "card--wide" : p.size === "tall" ? "card--tall" : "";
    const dims = p.size === "wide" ? [1200, 750] : p.size === "tall" ? [700, 1100] : [800, 1000];
    const src = imgUrl(p.seed, dims[0], dims[1]);
    const full = imgUrl(p.seed, 1600, Math.round(1600 * dims[1] / dims[0]));
    const el = document.createElement("article");
    el.className = `card ${sizeClass}`.trim();
    el.dataset.cat = p.cat;
    el.dataset.index = i;
    el.setAttribute("data-cursor", "hover");
    el.innerHTML = `
      <img src="${src}" alt="${p.title}" loading="lazy" />
      <div class="card__plus">+</div>
      <div class="card__overlay">
        <span class="card__cat">${p.tag}</span>
        <span class="card__title">${p.title}</span>
      </div>`;
    el._full = full;
    gallery.appendChild(el);
    return el;
  });

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }),
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  const cardIO = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add("is-in"), (Number(e.target.dataset.stagger) || 0) * 70);
        cardIO.unobserve(e.target);
      }
    }),
    { threshold: 0.12 }
  );
  const restagger = () => {
    let s = 0;
    built.forEach((c) => { if (!c.classList.contains("is-hidden")) { c.dataset.stagger = s++; } });
  };
  restagger();
  built.forEach((c) => cardIO.observe(c));

  /* ---------- Filters ---------- */
  const filters = document.getElementById("filters");
  filters.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter");
    if (!btn) return;
    filters.querySelector(".is-active")?.classList.remove("is-active");
    btn.classList.add("is-active");
    const f = btn.dataset.filter;
    built.forEach((c) => {
      const show = f === "all" || c.dataset.cat === f;
      c.classList.toggle("is-hidden", !show);
      c.classList.remove("is-in");
    });
    restagger();
    // re-trigger reveal for now-visible cards
    requestAnimationFrame(() => built.forEach((c) => { if (!c.classList.contains("is-hidden")) cardIO.observe(c); }));
  });

  /* ---------- Lightbox ---------- */
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbTitle = document.getElementById("lbTitle");
  const lbCat = document.getElementById("lbCat");
  const lbCount = document.getElementById("lbCount");
  let current = 0;

  const visibleCards = () => built.filter((c) => !c.classList.contains("is-hidden"));

  function openLightbox(card) {
    const list = visibleCards();
    current = list.indexOf(card);
    renderLightbox(list);
    lb.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }
  function renderLightbox(list) {
    const card = list[current];
    const p = PHOTOS[Number(card.dataset.index)];
    lbImg.src = card._full;
    lbImg.alt = p.title;
    lbTitle.textContent = p.title;
    lbCat.textContent = p.tag;
    lbCount.textContent = `${String(current + 1).padStart(2, "0")} / ${String(list.length).padStart(2, "0")}`;
  }
  function step(dir) {
    const list = visibleCards();
    current = (current + dir + list.length) % list.length;
    lbImg.style.opacity = "0";
    setTimeout(() => { renderLightbox(list); lbImg.style.opacity = "1"; }, 150);
  }
  function closeLightbox() {
    lb.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  gallery.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (card) openLightbox(card);
  });
  document.getElementById("lbClose").addEventListener("click", closeLightbox);
  document.getElementById("lbNext").addEventListener("click", () => step(1));
  document.getElementById("lbPrev").addEventListener("click", () => step(-1));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  });

  /* ---------- Nav scroll + mobile menu ---------- */
  const nav = document.getElementById("nav");
  window.addEventListener("scroll", () => nav.classList.toggle("is-scrolled", window.scrollY > 40), { passive: true });

  const burger = document.getElementById("burger");
  const navLinks = document.querySelector(".nav__links");
  burger.addEventListener("click", () => {
    navLinks.classList.toggle("is-open");
    document.body.classList.toggle("menu-open");
  });
  navLinks.addEventListener("click", (e) => {
    if (e.target.tagName === "A") { navLinks.classList.remove("is-open"); document.body.classList.remove("menu-open"); }
  });

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll("[data-count]");
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target, target = +el.dataset.count;
      let n = 0; const inc = Math.ceil(target / 45);
      const tick = () => { n += inc; if (n >= target) { el.textContent = target.toLocaleString(); } else { el.textContent = n.toLocaleString(); requestAnimationFrame(tick); } };
      tick(); counterIO.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach((c) => counterIO.observe(c));

  /* ---------- Custom cursor ---------- */
  const cursor = document.getElementById("cursor");
  const dot = document.getElementById("cursorDot");
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    let cx = 0, cy = 0, tx = 0, ty = 0;
    window.addEventListener("mousemove", (e) => {
      tx = e.clientX; ty = e.clientY;
      dot.style.transform = `translate(${tx}px, ${ty}px) translate(-50%, -50%)`;
    });
    const loop = () => {
      cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    };
    loop();
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest('[data-cursor="hover"], a, button, .card')) cursor.classList.add("is-hover");
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest('[data-cursor="hover"], a, button, .card')) cursor.classList.remove("is-hover");
    });
  }

  /* ---------- Hero parallax ---------- */
  const heroTitle = document.querySelector(".hero__title");
  window.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 18;
    const y = (e.clientY / window.innerHeight - 0.5) * 18;
    if (heroTitle) heroTitle.style.transform = `translate(${x}px, ${y}px)`;
  });

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Loader ---------- */
  const loader = document.getElementById("loader");
  const bar = document.getElementById("loaderBar");
  const pct = document.getElementById("loaderPct");
  let prog = 0;
  const fake = setInterval(() => {
    prog = Math.min(prog + Math.random() * 18, 100);
    bar.style.width = prog + "%";
    pct.textContent = Math.floor(prog) + "%";
    if (prog >= 100) {
      clearInterval(fake);
      setTimeout(() => loader.classList.add("is-done"), 350);
    }
  }, 160);
  window.addEventListener("load", () => { prog = 100; bar.style.width = "100%"; pct.textContent = "100%"; });
})();
