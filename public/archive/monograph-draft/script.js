(function () {
  "use strict";

  var doc = document;

  /* Current year in the footer. */
  var year = doc.getElementById("year");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  /* Scroll progress line + header hairline, throttled to one frame. */
  var progress = doc.getElementById("progress");
  var header = doc.querySelector(".site-header");
  var ticking = false;

  function onScroll() {
    var root = doc.documentElement;
    var max = root.scrollHeight - window.innerHeight;
    var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    if (progress) {
      progress.style.width = Math.min(100, Math.max(0, pct)) + "%";
    }
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 4);
    }
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    },
    { passive: true }
  );
  onScroll();

  /* Mobile navigation. */
  var menuButton = doc.querySelector(".menu-toggle");
  var nav = doc.getElementById("nav-links");

  function setMenu(open) {
    if (!menuButton || !nav) {
      return;
    }
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    nav.classList.toggle("is-open", open);
  }

  if (menuButton && nav) {
    menuButton.addEventListener("click", function () {
      setMenu(menuButton.getAttribute("aria-expanded") !== "true");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMenu(false);
      });
    });
    doc.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        menuButton.focus();
      }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 820) {
        setMenu(false);
      }
    });
  }

  /* Mark the section currently being read in the navigation. */
  var navLinks = Array.prototype.slice.call(doc.querySelectorAll('.nav a[href^="#"]'));
  var sections = navLinks
    .map(function (link) {
      return doc.getElementById(link.getAttribute("href").slice(1));
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var ratios = {};

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          ratios[entry.target.id] = entry.isIntersecting ? entry.intersectionRatio : 0;
        });

        var current = null;
        var best = 0;
        sections.forEach(function (section) {
          if ((ratios[section.id] || 0) > best) {
            best = ratios[section.id] || 0;
            current = section;
          }
        });

        navLinks.forEach(function (link) {
          var match = current && link.getAttribute("href") === "#" + current.id;
          if (match) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      },
      { threshold: [0, 0.15, 0.4, 0.7], rootMargin: "-68px 0px -40% 0px" }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }
})();
