# Abdo Maghawry | Personal Portfolio

A fast, responsive personal website built with plain HTML, CSS and JavaScript. No frameworks, no build step, no third-party scripts and no external fonts.

## Design

- Apple-style layout: large type, generous space, rounded tiles and simple line icons.
- Black, violet and pink gradient. Dark is the default look, with a light option and a "match my device" option in the header.
- The page is laid out as a journey: a line fills in and each stop lights up as you scroll.
- Motion is light: content fades in on scroll, and the portrait tilts slightly toward a mouse. Visitors who set "reduce motion" in their system get a still page with all content visible.
- Layout adapts from small phones to large desktop screens.

## Files

- `index.html` page content, icon set, SEO tags and the Content Security Policy
- `style.css` design tokens, dark and light modes, layout and animation
- `theme.js` applies the saved theme before the page paints
- `script.js` theme buttons, reveal on scroll, journey line and portrait tilt
- `abdo.jpg` profile photo (keep it in the same folder as `index.html`)

## Security

GitHub Pages serves static files and cannot set custom HTTP headers, so protection is built into the page itself:

- A Content Security Policy (meta tag) that allows scripts, styles and images only from this site. Nothing is loaded from other sites, and inline scripts are not allowed.
- No forms, no user input and no backend, so there is nothing to inject into.
- External links use `rel="noopener noreferrer"`.
- A referrer policy that sends only the site origin to other sites.
- The saved theme value is checked against a fixed list before use.
- A frame-busting check so other sites cannot embed the page.

Headers such as `X-Frame-Options`, `Strict-Transport-Security` and a full `frame-ancestors` rule cannot be set on GitHub Pages. Putting the site behind Cloudflare is the way to add them. In the repository settings, keep "Enforce HTTPS" enabled for Pages.

## Run locally

```
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploy

Enable GitHub Pages from the repository settings (Settings, Pages, deploy from the `main` branch, root folder).

## Contact

maghawryabdo@gmail.com
