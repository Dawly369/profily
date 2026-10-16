(function () {
    'use strict';

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

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) { return; }
                links.forEach(function (link) { link.classList.remove('is-active'); });
                var active = byId[entry.target.id];
                if (active) { active.classList.add('is-active'); }
            });
        }, { rootMargin: '-45% 0px -50% 0px' });

        Object.keys(byId).forEach(function (id) {
            var section = document.getElementById(id);
            if (section) { observer.observe(section); }
        });
    }
})();
