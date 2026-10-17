(function () {
    'use strict';

    var root = document.documentElement;
    root.classList.add('ready');

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    // Theme buttons: dark, light or match the device
    var toggle = document.getElementById('theme-toggle');
    var theme = window.siteTheme;

    if (toggle && theme) {
        var buttons = toggle.querySelectorAll('[data-mode]');

        var sync = function () {
            buttons.forEach(function (button) {
                button.setAttribute('aria-pressed', String(button.getAttribute('data-mode') === theme.getMode()));
            });
        };

        buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                theme.setMode(button.getAttribute('data-mode'));
                sync();
            });
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

    // Reveal sections and cards as they scroll into view
    var revealItems = document.querySelectorAll('.reveal');

    if (reduceMotion || !('IntersectionObserver' in window)) {
        revealItems.forEach(function (el) { el.classList.add('is-in'); });
    } else {
        revealItems.forEach(function (el) {
            var index = Array.prototype.indexOf.call(el.parentNode.children, el);
            el.style.setProperty('--d', (Math.min(index, 5) * 70) + 'ms');
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

    // Journey: the line fills and each stop lights up as you scroll past it
    var journey = document.getElementById('journey-list');

    if (journey) {
        var steps = Array.prototype.slice.call(journey.querySelectorAll('.step'));
        var nodes = steps.map(function (step) { return step.querySelector('.node'); });
        var ticking = false;

        var center = function (el) {
            var rect = el.getBoundingClientRect();
            return rect.top + rect.height / 2;
        };

        var updateJourney = function () {
            ticking = false;

            if (reduceMotion) {
                journey.style.setProperty('--j', '1');
                steps.forEach(function (step) { step.classList.add('is-active'); });
                return;
            }

            var line = window.innerHeight * 0.6;
            var first = center(nodes[0]);
            var last = center(nodes[nodes.length - 1]);
            var progress = last > first ? (line - first) / (last - first) : 0;
            journey.style.setProperty('--j', clamp(progress, 0, 1).toFixed(4));

            steps.forEach(function (step, index) {
                step.classList.toggle('is-active', center(nodes[index]) <= line);
            });
        };

        window.addEventListener('scroll', function () {
            if (!ticking) {
                ticking = true;
                window.requestAnimationFrame(updateJourney);
            }
        }, { passive: true });
        window.addEventListener('resize', updateJourney);
        updateJourney();
    }

    // Portrait tilts slightly toward a real mouse pointer (never on touch)
    if (canHover && !reduceMotion) {
        var hero = document.getElementById('top');
        var stage = document.querySelector('.tilt-stage');

        if (hero && stage) {
            var portrait = stage.parentNode;

            hero.addEventListener('pointermove', function (event) {
                if (event.pointerType !== 'mouse') { return; }
                var rect = portrait.getBoundingClientRect();
                var x = (event.clientX - (rect.left + rect.width / 2)) / (window.innerWidth / 2);
                var y = (event.clientY - (rect.top + rect.height / 2)) / (window.innerHeight / 2);
                stage.style.setProperty('--ry', (clamp(x, -1, 1) * 8).toFixed(2) + 'deg');
                stage.style.setProperty('--rx', (clamp(y, -1, 1) * -6).toFixed(2) + 'deg');
            });

            hero.addEventListener('pointerleave', function () {
                stage.style.setProperty('--ry', '0deg');
                stage.style.setProperty('--rx', '0deg');
            });
        }
    }
})();
