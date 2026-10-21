(function () {
  "use strict";

  var doc = document;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var finePointer = window.matchMedia("(pointer: fine)");

  /* ---------------------------------------------------------- year ---- */
  var year = doc.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ------------------------------------------------ scroll progress --- */
  var progressFill = doc.getElementById("hud-progress-fill");
  var header = doc.querySelector(".site-header");
  var ticking = false;

  function onScroll() {
    var root = doc.documentElement;
    var max = root.scrollHeight - window.innerHeight;
    var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    if (progressFill) progressFill.style.width = Math.min(100, Math.max(0, pct)) + "%";
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ------------------------------------------------- mobile nav ------- */
  var menuButton = doc.querySelector(".menu-toggle");
  var nav = doc.getElementById("nav-links");

  function setMenu(open) {
    if (!menuButton || !nav) return;
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    nav.classList.toggle("is-open", open);
  }
  if (menuButton && nav) {
    menuButton.addEventListener("click", function () {
      setMenu(menuButton.getAttribute("aria-expanded") !== "true");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setMenu(false); });
    });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        menuButton.focus();
      }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 820) setMenu(false);
    });
  }

  /* ------------------------------------------ active nav section ------ */
  var navLinks = Array.prototype.slice.call(doc.querySelectorAll('.nav a[href^="#"]'));
  var sections = navLinks
    .map(function (l) { return doc.getElementById(l.getAttribute("href").slice(1)); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var ratios = {};
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        ratios[entry.target.id] = entry.isIntersecting ? entry.intersectionRatio : 0;
      });
      var current = null, best = 0;
      sections.forEach(function (s) {
        if ((ratios[s.id] || 0) > best) { best = ratios[s.id] || 0; current = s; }
      });
      navLinks.forEach(function (link) {
        if (current && link.getAttribute("href") === "#" + current.id) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    }, { threshold: [0, 0.15, 0.4, 0.7], rootMargin: "-68px 0px -40% 0px" });
    sections.forEach(function (s) { sectionObserver.observe(s); });
  }

  /* ---------------------------------------------- reveals ------------- */
  /* Clip-reveal headings: wrap content so the mask animates without
     touching the semantic text. Done in JS so no-JS keeps plain markup. */
  doc.querySelectorAll(".clip-reveal").forEach(function (el) {
    var inner = doc.createElement("span");
    inner.className = "clip-inner";
    while (el.firstChild) inner.appendChild(el.firstChild);
    el.appendChild(inner);
  });

  if ("IntersectionObserver" in window) {
    var revealables = [];
    doc.querySelectorAll(".project").forEach(function (el, i) {
      el.classList.add("reveal");
      el.style.setProperty("--rd", (Math.min(i, 3) * 0.09) + "s");
      revealables.push(el);
    });
    doc.querySelectorAll(".principles li, .stack-group, .section-head").forEach(function (el) {
      el.classList.add("reveal");
      revealables.push(el);
    });
    doc.querySelectorAll(".clip-reveal, .lab-list li").forEach(function (el) {
      revealables.push(el);
    });

    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealables.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ------------------------------------------- engineering notes ------- */
  doc.querySelectorAll(".notes-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var panel = doc.getElementById(btn.getAttribute("aria-controls"));
      if (!panel) return;
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      panel.classList.toggle("is-open", !open);
    });
  });

  /* ------------------------------ pointer effects (fine pointer only) -- */
  if (finePointer.matches && !reduceMotion.matches) {
    /* spotlight follows the cursor, behind all content */
    var spotlight = doc.querySelector(".spotlight");
    var sxTarget = 0, syTarget = 0, sx = 0, sy = 0, spotRunning = false;

    function spotFrame() {
      sx += (sxTarget - sx) * 0.12;
      sy += (syTarget - sy) * 0.12;
      if (spotlight) {
        spotlight.style.setProperty("--sx", sx + "px");
        spotlight.style.setProperty("--sy", sy + "px");
      }
      if (Math.abs(sxTarget - sx) > 0.5 || Math.abs(syTarget - sy) > 0.5) {
        window.requestAnimationFrame(spotFrame);
      } else {
        spotRunning = false;
      }
    }
    window.addEventListener("pointermove", function (e) {
      sxTarget = e.clientX;
      syTarget = e.clientY;
      if (!spotRunning) { spotRunning = true; window.requestAnimationFrame(spotFrame); }
    }, { passive: true });

    /* card tilt + sheen position */
    doc.querySelectorAll("[data-tilt]").forEach(function (card) {
      var rafId = null, tX = 0, tY = 0;

      function apply() {
        card.style.transform =
          "perspective(1100px) rotateX(" + tX.toFixed(2) + "deg) rotateY(" + tY.toFixed(2) + "deg)";
        rafId = null;
      }
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        tX = (0.5 - py) * 5;
        tY = (px - 0.5) * 6;
        card.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
        card.style.setProperty("--my", (py * 100).toFixed(1) + "%");
        if (!rafId) rafId = window.requestAnimationFrame(apply);
      });
      card.addEventListener("pointerleave", function () {
        tX = 0; tY = 0;
        if (!rafId) rafId = window.requestAnimationFrame(apply);
      });
    });

    /* magnetic CTAs */
    doc.querySelectorAll(".magnetic").forEach(function (btn) {
      btn.addEventListener("pointermove", function (e) {
        var r = btn.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2);
        var dy = e.clientY - (r.top + r.height / 2);
        btn.style.transform = "translate(" + (dx * 0.14).toFixed(1) + "px," + (dy * 0.2).toFixed(1) + "px)";
      });
      btn.addEventListener("pointerleave", function () {
        btn.style.transition = "transform .35s cubic-bezier(.22,.68,.2,1)";
        btn.style.transform = "";
        window.setTimeout(function () { btn.style.transition = ""; }, 360);
      });
    });
  }

  /* --------------------------------------------- signal field --------- */
  /* An abstract waveform field: three drifting polylines over a dot grid,
     with a gaussian amplitude swell under the pointer. Static frame is
     drawn for reduced motion / coarse pointers; pauses off-screen. */
  var canvas = doc.getElementById("signal-field");
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext("2d");
    var W = 0, H = 0, dpr = 1;
    var t = 0;
    var pointerX = -1, pointerStrength = 0;
    var running = false, heroVisible = true;

    var LINES = [
      { amp: 26, freq: 0.011, speed: 0.5, y: 0.56, color: "rgba(139,104,255,0.5)", width: 1.4 },
      { amp: 17, freq: 0.017, speed: 0.8, y: 0.66, color: "rgba(124,212,238,0.32)", width: 1.1 },
      { amp: 10, freq: 0.026, speed: 1.25, y: 0.74, color: "rgba(233,235,242,0.16)", width: 1 }
    ];

    function resize() {
      var r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, Math.round(r.width));
      H = Math.max(1, Math.round(r.height));
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      /* dot grid — structural texture */
      ctx.fillStyle = "rgba(233,235,242,0.055)";
      var step = 44;
      for (var gx = step / 2; gx < W; gx += step) {
        for (var gy = step / 2; gy < H; gy += step) {
          ctx.fillRect(gx, gy, 1, 1);
        }
      }

      LINES.forEach(function (line) {
        var baseY = H * line.y;
        ctx.beginPath();
        ctx.strokeStyle = line.color;
        ctx.lineWidth = line.width;
        for (var x = 0; x <= W; x += 4) {
          var wave = Math.sin(x * line.freq + t * line.speed) * line.amp
                   + Math.sin(x * line.freq * 2.3 + t * line.speed * 0.6) * line.amp * 0.35;
          if (pointerStrength > 0 && pointerX >= 0) {
            var dx = x - pointerX;
            var falloff = Math.exp(-(dx * dx) / (2 * 130 * 130));
            wave += falloff * line.amp * 1.6 * pointerStrength;
          }
          var y = baseY + wave;
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
    }

    function frame() {
      if (!running) return;
      t += 0.016;
      draw();
      window.requestAnimationFrame(frame);
    }

    function start() {
      if (!running && heroVisible && !reduceMotion.matches) {
        running = true;
        window.requestAnimationFrame(frame);
      }
    }
    function stop() { running = false; }

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        heroVisible = entries[0].isIntersecting;
        if (heroVisible) start(); else stop();
      }).observe(canvas);
    }

    if (finePointer.matches && !reduceMotion.matches) {
      window.addEventListener("pointermove", function (e) {
        var r = canvas.getBoundingClientRect();
        pointerX = e.clientX - r.left;
        if (e.clientY - r.top < r.height * 1.05) {
          pointerStrength = Math.min(1, pointerStrength + 0.12);
        }
      }, { passive: true });
      (function decay() {
        pointerStrength *= 0.97;
        window.setTimeout(decay, 40);
      })();
    }

    var resizeTimer = null;
    window.addEventListener("resize", function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 120);
    });

    doc.addEventListener("visibilitychange", function () {
      if (doc.hidden) stop(); else start();
    });

    if (reduceMotion.addEventListener) {
      reduceMotion.addEventListener("change", function () {
        if (reduceMotion.matches) { stop(); draw(); } else { start(); }
      });
    }

    resize();
    start();
  }
})();
