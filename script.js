/* =========================================================
   N1GHT CHXN9 — interactions
   ========================================================= */
(() => {
  "use strict";

  /* ---------- Photo data ----------
     Real shots live in the /photos folder.
     `src` is the file path; the same file is used for the lightbox.
     `size` controls layout: "" (default), "wide", or "tall".
     Four "wide" + seven default cards tile the 12-col grid exactly.
  */
  const PHOTOS = [
    { title: "黑白树影",   cat: "tree",   tag: "TREE",   src: "photos/1779456446198.jpg",         size: "wide" },
    { title: "山茱萸",         cat: "flower",     tag: "FLOWER",     src: "photos/1779456446218.jpg",         size: "" },
    { title: "杏花坠入蓝色梦境",       cat: "flower",      tag: "FLOWER",      src: "photos/1779456446227.jpg",         size: "" },
    { title: "玉兰借晴空呼吸",         cat: "flower",     tag: "FLOWER",     src: "photos/1779456446231.jpg",         size: "wide" },
    { title: "逆光里未开的春天",           cat: "flower", tag: "FLOWER", src: "photos/1779456446240.jpg",         size: "" },
    { title: "一枝杏花挑起晴空",         cat: "flower",   tag: "FLOWER",   src: "photos/1779456446245.jpg",         size: "" },
    { title: "玉兰把光揉成雪",           cat: "flower",     tag: "FLOWER",     src: "photos/1779456446248.jpg",         size: "" },
    { title: "草原尽头云在生长",           cat: "sky",      tag: "SKY",      src: "photos/SAVE_20260616_234154.jpg",  size: "wide" },
    { title: "风从云城吹过草原",         cat: "sky",      tag: "SKY",      src: "photos/SAVE_20260616_234224.jpg",  size: "" },
    { title: "山坡托起一座白云",       cat: "sky",      tag: "SKY",      src: "photos/SAVE_20260616_234337.jpg",  size: "" },
    { title: "远山慢慢化成云海",     cat: "sky",      tag: "SKY",      src: "photos/SAVE_20260616_234423.jpg",  size: "wide" },
  ];

  /* ---------- Build gallery ---------- */
  const gallery = document.getElementById("gallery");
  // photos/foo.jpg -> photos/web/foo-thumb.jpg | photos/web/foo-display.jpg
  const webImg = (src, kind) =>
    `photos/web/${src.replace(/^photos\//, "").replace(/\.[^.]+$/, "")}-${kind}.jpg`;
  const built = PHOTOS.map((p, i) => {
    const sizeClass = p.size === "wide" ? "card--wide" : p.size === "tall" ? "card--tall" : "";
    const el = document.createElement("article");
    el.className = `card ${sizeClass}`.trim();
    el.dataset.cat = p.cat;
    el.dataset.index = i;
    el.innerHTML = `
      <img src="${webImg(p.src, "thumb")}" alt="${p.title}" loading="lazy" />
      <div class="card__plus">+</div>
      <div class="card__overlay">
        <span class="card__cat">${p.tag}</span>
        <span class="card__title">${p.title}</span>
      </div>`;
    el._display = webImg(p.src, "display");
    el._full = p.src;
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
  const lbOriginal = document.getElementById("lbOriginal");
  let current = 0;

  const visibleCards = () => built.filter((c) => !c.classList.contains("is-hidden"));

  function openLightbox(card) {
    const list = visibleCards();
    current = list.indexOf(card);
    renderLightbox(list);
    document.body.style.overflow = "hidden";
    lbImg.style.opacity = "1";
    // Decode the (large) image first so it fades in already painted,
    // instead of popping in partway through the open animation.
    const reveal = () => lb.classList.add("is-open");
    lbImg.decode ? lbImg.decode().then(reveal).catch(reveal) : reveal();
  }
  function renderLightbox(list) {
    const card = list[current];
    const p = PHOTOS[Number(card.dataset.index)];
    lbImg.src = card._display;
    lbImg.alt = p.title;
    lbTitle.textContent = p.title;
    lbCat.textContent = p.tag;
    lbCount.textContent = `${String(current + 1).padStart(2, "0")} / ${String(list.length).padStart(2, "0")}`;
    lbOriginal.dataset.full = card._full;
    lbOriginal.textContent = "查看原图";
    lbOriginal.disabled = false;
    lbOriginal.hidden = false;
  }
  function step(dir) {
    const list = visibleCards();
    current = (current + dir + list.length) % list.length;
    lbImg.style.opacity = "0";
    setTimeout(() => {
      renderLightbox(list);
      // Wait for the new image to decode before fading in; otherwise the
      // <img> repaints the previous (still-decoded) photo for a frame.
      const reveal = () => { lbImg.style.opacity = "1"; };
      lbImg.decode ? lbImg.decode().then(reveal).catch(reveal) : reveal();
    }, 150);
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
  lbOriginal.addEventListener("click", () => {
    const full = lbOriginal.dataset.full;
    if (!full) return;
    lbOriginal.disabled = true;
    lbOriginal.textContent = "原图加载中…";
    const hi = new Image();
    hi.onload = () => { lbImg.src = full; lbOriginal.hidden = true; };
    hi.onerror = () => { lbOriginal.textContent = "加载失败，重试"; lbOriginal.disabled = false; };
    hi.src = full;
  });
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
