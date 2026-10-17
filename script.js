(function () {
    'use strict';

    var root = document.documentElement;
    root.classList.add('ready');

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    // Theme menu: reflect the saved choice and handle clicks
    var menu = document.getElementById('theme-menu');
    var theme = window.siteTheme;

    if (menu && theme) {
        var modeButtons = menu.querySelectorAll('[data-mode]');
        var accentButtons = menu.querySelectorAll('[data-accent]');

        var sync = function () {
            modeButtons.forEach(function (button) {
                button.setAttribute('aria-pressed', String(button.getAttribute('data-mode') === theme.getMode()));
            });
            accentButtons.forEach(function (button) {
                button.setAttribute('aria-pressed', String(button.getAttribute('data-accent') === theme.getAccent()));
            });
        };

        modeButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                theme.setMode(button.getAttribute('data-mode'));
                sync();
            });
        });

        accentButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                theme.setAccent(button.getAttribute('data-accent'));
                sync();
            });
        });

        // Close when clicking elsewhere or pressing Escape
        document.addEventListener('click', function (event) {
            if (menu.open && !menu.contains(event.target)) { menu.open = false; }
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && menu.open) {
                menu.open = false;
                var summary = menu.querySelector('summary');
                if (summary) { summary.focus(); }
            }
        });

        sync();
    }

    // Footer year
    var year = document.getElementById('year');
    if (year) { year.textContent = String(new Date().getFullYear()); }

    // Highlight the nav link of the section in view
    var links = document.querySelectorAll('.nav-list a');
    if ('IntersectionObserver' in window && links.length) {
        var byId = {};
        links.forEach(function (link) {
            byId[link.getAttribute('href').slice(1)] = link;
        });

        var navObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) { return; }
                links.forEach(function (link) { link.classList.remove('is-active'); });
                var active = byId[entry.target.id];
                if (active) { active.classList.add('is-active'); }
            });
        }, { rootMargin: '-45% 0px -50% 0px' });

        Object.keys(byId).forEach(function (id) {
            var section = document.getElementById(id);
            if (section) { navObserver.observe(section); }
        });
    }

    // Scroll progress bar (read by .progress in the CSS)
    var ticking = false;

    function updateProgress() {
        var max = root.scrollHeight - window.innerHeight;
        var value = max > 0 ? window.scrollY / max : 0;
        root.style.setProperty('--progress', clamp(value, 0, 1).toFixed(4));
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(updateProgress);
        }
    }, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();

    // Reveal sections and cards as they scroll into view
    var revealItems = document.querySelectorAll('.reveal');

    if (reduceMotion || !('IntersectionObserver' in window)) {
        revealItems.forEach(function (el) { el.classList.add('is-in'); });
    } else {
        revealItems.forEach(function (el) {
            var index = Array.prototype.indexOf.call(el.parentNode.children, el);
            el.style.setProperty('--d', (Math.min(index, 5) * 80) + 'ms');
        });

        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) { return; }
                entry.target.classList.add('is-in');
                revealObserver.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });

        revealItems.forEach(function (el) { revealObserver.observe(el); });
    }

    // 3D tilt only for a real mouse and when motion is allowed.
    // Touch screens get the gentle CSS sway instead.
    if (canHover && !reduceMotion) {
        // Portrait follows the pointer across the hero
        var hero = document.getElementById('top');
        var stage = document.querySelector('.tilt-stage');

        if (hero && stage) {
            var portrait = stage.parentNode;

            hero.addEventListener('pointermove', function (event) {
                if (event.pointerType !== 'mouse') { return; }
                var rect = portrait.getBoundingClientRect();
                var x = (event.clientX - (rect.left + rect.width / 2)) / (window.innerWidth / 2);
                var y = (event.clientY - (rect.top + rect.height / 2)) / (window.innerHeight / 2);
                stage.style.setProperty('--ry', (clamp(x, -1, 1) * 14).toFixed(2) + 'deg');
                stage.style.setProperty('--rx', (clamp(y, -1, 1) * -10).toFixed(2) + 'deg');
            });

            hero.addEventListener('pointerleave', function () {
                stage.style.setProperty('--ry', '0deg');
                stage.style.setProperty('--rx', '0deg');
            });
        }

        // Cards tilt toward the pointer and show a light spot
        document.querySelectorAll('[data-tilt]').forEach(function (card) {
            card.addEventListener('pointermove', function (event) {
                if (event.pointerType !== 'mouse') { return; }
                var rect = card.getBoundingClientRect();
                var px = clamp((event.clientX - rect.left) / rect.width, 0, 1);
                var py = clamp((event.clientY - rect.top) / rect.height, 0, 1);
                card.style.setProperty('--ry', ((px - 0.5) * 12).toFixed(2) + 'deg');
                card.style.setProperty('--rx', ((0.5 - py) * 12).toFixed(2) + 'deg');
                card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
                card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
            });

            card.addEventListener('pointerleave', function () {
                card.style.setProperty('--rx', '0deg');
                card.style.setProperty('--ry', '0deg');
            });
        });
    }
})();
