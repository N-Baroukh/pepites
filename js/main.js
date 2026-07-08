/* =============================================================
   PÉPITES FRANCE — main.js
   JS vanilla, léger, sans dépendance. Tout est progressif :
   le site reste 100% fonctionnel sans JavaScript.
   ============================================================= */
(function () {
  'use strict';

  /* ---------- Navigation mobile (accessible) ---------- */
  var burger = document.querySelector('.nav__burger');
  var nav = document.querySelector('.nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // Ferme le menu au clic sur un lien (mobile)
    nav.querySelectorAll('.nav__links a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
    // Échap ferme le menu
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        burger.focus();
      }
    });
  }

  /* ---------- Ombre du header au scroll ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Apparition au scroll ---------- */
  var reveals = document.querySelectorAll('[data-reveal]');
  if (reveals.length) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      reveals.forEach(function (el) { io.observe(el); });
    } else {
      reveals.forEach(function (el) { el.classList.add('is-visible'); });
    }
  }

  /* ---------- Compteurs animés ---------- */
  var counters = document.querySelectorAll('[data-count]');
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (counters.length && 'IntersectionObserver' in window && !prefersReduced) {
    var animate = function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      var decimals = (target % 1 !== 0) ? 1 : 0;
      var start = null;
      var dur = 1500;
      var step = function (ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target.toFixed(decimals) + suffix;
      };
      requestAnimationFrame(step);
    };
    var co = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animate(entry.target); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
  } else if (counters.length) {
    counters.forEach(function (el) {
      el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix') || '');
    });
  }

  /* ---------- FAQ : une seule réponse ouverte à la fois ---------- */
  var faqItems = document.querySelectorAll('.faq__item');
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (item.open) {
        faqItems.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  /* ---------- Popup contact flottant ---------- */
  var fab = document.querySelector('.fab');
  var fabPopup = document.querySelector('.fab-popup');
  if (fab && fabPopup) {
    fab.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = fabPopup.classList.toggle('open');
      fab.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) {
      if (fabPopup.classList.contains('open') &&
          !fabPopup.contains(e.target) && e.target !== fab) {
        fabPopup.classList.remove('open');
        fab.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        fabPopup.classList.remove('open');
        fab.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Indicateur ouvert/fermé (lun-ven 9h-19h) ---------- */
  var dot = document.querySelector('.status-dot');
  var label = document.querySelector('[data-status-label]');
  if (dot) {
    var now = new Date();
    var day = now.getDay();          // 0 = dimanche
    var h = now.getHours() + now.getMinutes() / 60;
    var isOpen = day >= 1 && day <= 5 && h >= 9 && h < 19;
    dot.classList.add(isOpen ? 'open' : 'closed');
    dot.title = isOpen ? 'Ouvert actuellement' : 'Fermé actuellement';
    if (label) label.textContent = isOpen ? 'Ouvert maintenant' : 'Fermé — rappel sous 24h';
  }

  /* ---------- Année du footer ---------- */
  var yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
