/* =========================================================
   Ushike Pavan Reddy — Portfolio scripts (vanilla JS)
   ========================================================= */

/* ---------- CONFIG: edit these two values ---------- */
const CONFIG = {
  // 1) Contact form service. Create a free form at https://formspree.io,
  //    then paste its endpoint here, e.g. "https://formspree.io/f/abcdwxyz".
  //    Leave empty ("") to use the email fallback (opens the visitor's email app).
  formspreeEndpoint: "",

  // 2) Where messages go when using the email fallback.
  contactEmail: "bunnyreddy07@gmail.com",

  // Roles for the hero typing animation.
  roles: [
    "Computer Science Student | Full Stack Developer",
    "Computer Science Student",
    "Full Stack Developer",
    "MERN Stack Developer",
  ],
};

(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Theme toggle ---------- */
  const root = document.documentElement;
  const themeBtn = $("#themeToggle");
  const themeMeta = $('meta[name="theme-color"]');

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeMeta) themeMeta.setAttribute("content", theme === "dark" ? "#05050a" : "#f7f7fc");
    themeBtn.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
  }
  applyTheme(root.getAttribute("data-theme") || "dark");

  themeBtn.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("theme", next); } catch (e) { /* storage unavailable */ }
  });

  /* ---------- Mobile navigation ---------- */
  const navToggle = $("#navToggle");
  const navLinks = $("#navLinks");

  function setNav(open) {
    navLinks.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  navToggle.addEventListener("click", () => setNav(!navLinks.classList.contains("open")));
  $$(".nav-link", navLinks).forEach((a) => a.addEventListener("click", () => setNav(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setNav(false); });
  document.addEventListener("click", (e) => {
    if (navLinks.classList.contains("open") && !e.target.closest(".nav")) setNav(false);
  });
  window.matchMedia("(min-width: 1081px)").addEventListener("change", (e) => { if (e.matches) setNav(false); });

  /* ---------- Header state, scroll progress, back-to-top ---------- */
  const header = $("#siteHeader");
  const progress = $("#scrollProgress");
  const backTop = $("#backTop");
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle("scrolled", y > 24);
    backTop.classList.toggle("show", y > 600);
    progress.style.transform = "scaleX(" + (max > 0 ? Math.min(y / max, 1) : 0) + ")";
    ticking = false;
  }
  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

  /* ---------- Active section highlight ---------- */
  const sections = $$("main section[id]");
  const linkMap = new Map($$(".nav-link").map((a) => [a.getAttribute("href").slice(1), a]));

  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        linkMap.forEach((a) => a.classList.remove("active"));
        const link = linkMap.get(entry.target.id);
        if (link) link.classList.add("active");
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => spy.observe(s));

  /* ---------- Scroll-triggered reveal ---------- */
  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ---------- Typing effect ---------- */
  const typedEl = $("#typed");
  if (typedEl && !reduceMotion) {
    let roleIdx = 0, charIdx = 0, deleting = false;
    function tick() {
      const word = CONFIG.roles[roleIdx];
      charIdx += deleting ? -1 : 1;
      typedEl.textContent = word.slice(0, charIdx);
      let delay = deleting ? 35 : 70;
      if (!deleting && charIdx === word.length) { delay = 1800; deleting = true; }
      else if (deleting && charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % CONFIG.roles.length; delay = 350; }
      setTimeout(tick, delay);
    }
    // First role is already visible as static text; start by deleting it after a pause.
    charIdx = CONFIG.roles[0].length;
    deleting = true;
    setTimeout(tick, 2200);
  }

  /* ---------- 3D tilt on cards (desktop pointers only) ---------- */
  if (canHover && !reduceMotion) {
    $$("[data-tilt]").forEach((el) => {
      const max = el.classList.contains("code-window") ? 6 : 5;
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty("--ry", (px * max * 2).toFixed(2) + "deg");
        el.style.setProperty("--rx", (-py * max * 2).toFixed(2) + "deg");
      });
      el.addEventListener("pointerleave", () => {
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
      });
    });
  }

  /* ---------- Certificate modal ---------- */
  const modal = $("#certModal");
  const mTitle = $("#certModalTitle");
  const mMeta = $("#certModalMeta");
  const mImg = $("#certModalImg");
  const mOpen = $("#certOpenPdf");
  const mDownload = $("#certDownload");
  let lastFocus = null;

  function openModal(data) {
    lastFocus = document.activeElement;
    mTitle.textContent = data.title;
    mMeta.textContent = data.issuer + " · " + data.date;
    mImg.src = data.img;
    mImg.alt = data.title + " certificate";
    mOpen.href = data.pdf;
    mDownload.href = data.pdf;
    modal.hidden = false;
    document.body.classList.add("modal-open");
    $(".modal-close", modal).focus();
  }
  function closeModal() {
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    mImg.src = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  $$("[data-cert-open]").forEach((btn) => btn.addEventListener("click", () => openModal(btn.dataset)));
  $$("[data-modal-close]", modal).forEach((el) => el.addEventListener("click", closeModal));
  document.addEventListener("keydown", (e) => {
    if (modal.hidden) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "Tab") { // keep focus inside the dialog
      const f = $$("a[href], button:not([disabled])", modal).filter((n) => n.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- Contact form (real submission) ---------- */
  const form = $("#contactForm");
  const statusEl = $("#formStatus");
  const submitBtn = $("#cfSubmit");
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setStatus(msg, type, html) {
    statusEl.className = "form-status " + (type || "");
    if (html) statusEl.innerHTML = msg; else statusEl.textContent = msg;
  }
  function setError(name, msg) {
    const field = form.elements[name].closest(".field");
    field.classList.toggle("invalid", Boolean(msg));
    $('.field-error[data-for="' + name + '"]', form).textContent = msg || "";
  }
  function validate() {
    const v = (n) => form.elements[n].value.trim();
    let ok = true;
    setError("name", v("name") ? "" : (ok = false, "Please enter your name."));
    setError("email", EMAIL_RE.test(v("email")) ? "" : (ok = false, "Please enter a valid email address."));
    setError("message", v("message").length >= 10 ? "" : (ok = false, "Please write a message (at least 10 characters)."));
    return ok;
  }
  ["name", "email", "message"].forEach((n) =>
    form.elements[n].addEventListener("input", () => setError(n, ""))
  );

  function setLoading(on) {
    submitBtn.disabled = on;
    $(".btn-label", submitBtn).hidden = on;
    $(".btn-loading", submitBtn).hidden = !on;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setStatus("", "");
    if (!validate()) return;
    if (form.elements._gotcha.value) return; // bot caught by honeypot

    const data = new FormData(form);
    const name = data.get("name").trim();
    const email = data.get("email").trim();
    const subject = (data.get("subject") || "").trim() || "Portfolio contact from " + name;
    const message = data.get("message").trim();

    // Preferred: Formspree (message is delivered to your inbox)
    if (CONFIG.formspreeEndpoint) {
      setLoading(true);
      try {
        const res = await fetch(CONFIG.formspreeEndpoint, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
        });
        if (res.ok) {
          setStatus("Message sent successfully. Thank you, I'll get back to you soon.", "ok");
          form.reset();
        } else {
          let detail = "";
          try { const j = await res.json(); if (j.errors) detail = j.errors.map((x) => x.message).join(", "); } catch (_) {}
          throw new Error(detail || "The server returned an error (" + res.status + ").");
        }
      } catch (err) {
        setStatus(
          "Sorry, your message could not be sent. " + (err.message || "") +
          ' Please email me directly at <a href="mailto:' + CONFIG.contactEmail + '">' + CONFIG.contactEmail + "</a>.",
          "err", true
        );
      } finally {
        setLoading(false);
      }
      return;
    }

    // Fallback: open the visitor's email app with the message pre-filled.
    // This does NOT send anything by itself, so we do not claim success.
    const body = message + "\n\n— " + name + " (" + email + ")";
    const href = "mailto:" + CONFIG.contactEmail + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    setStatus(
      'Opening your email app with the message pre-filled. Press send there to deliver it. If nothing opens, email me at <a href="mailto:' +
      CONFIG.contactEmail + '">' + CONFIG.contactEmail + "</a>.",
      "info", true
    );
    window.location.href = href;
  });

  /* ---------- Footer year ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
