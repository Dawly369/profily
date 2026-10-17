/*
 * Loaded in <head> before the page paints, so the chosen theme applies
 * without a flash. Saved values are checked against fixed lists before use.
 */
(function () {
    'use strict';

    // Clickjacking defense for hosts that cannot send a frame-ancestors header
    // (GitHub Pages cannot). If the page is framed by another site, break out,
    // or hide the page when the browser blocks that.
    try {
        if (window.top !== window.self) {
            window.top.location = window.self.location;
        }
    } catch (e) {
        document.documentElement.hidden = true;
    }

    var MODES = ['light', 'dark', 'auto'];
    var ACCENTS = ['violet', 'coral', 'teal', 'amber'];
    var root = document.documentElement;

    // Marks that scripts are running, so scroll-reveal may hide content until
    // it scrolls into view. If the main script has not started after a few
    // seconds, everything is shown again so nothing stays hidden.
    root.classList.add('js');
    window.setTimeout(function () {
        if (!root.classList.contains('ready')) { root.classList.remove('js'); }
    }, 4000);
    var query = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

    function read(key) {
        try { return window.localStorage.getItem(key); } catch (e) { return null; }
    }

    function write(key, value) {
        try { window.localStorage.setItem(key, value); } catch (e) { /* storage blocked */ }
    }

    var mode = read('theme-mode');
    if (MODES.indexOf(mode) === -1) { mode = 'auto'; }

    var accent = read('theme-accent');
    if (ACCENTS.indexOf(accent) === -1) { accent = 'violet'; }

    function apply() {
        var effective = mode === 'auto' ? (query && query.matches ? 'dark' : 'light') : mode;
        root.setAttribute('data-mode', effective);
        root.setAttribute('data-accent', accent);
    }

    apply();

    if (query) {
        var onChange = function () { if (mode === 'auto') { apply(); } };
        if (query.addEventListener) {
            query.addEventListener('change', onChange);
        } else if (query.addListener) {
            query.addListener(onChange);
        }
    }

    window.siteTheme = {
        getMode: function () { return mode; },
        getAccent: function () { return accent; },
        setMode: function (value) {
            if (MODES.indexOf(value) === -1) { return; }
            mode = value;
            write('theme-mode', mode);
            apply();
        },
        setAccent: function (value) {
            if (ACCENTS.indexOf(value) === -1) { return; }
            accent = value;
            write('theme-accent', accent);
            apply();
        }
    };
})();
