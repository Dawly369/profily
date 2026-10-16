# Abdo Maghawry | Personal Portfolio

A fast, responsive personal website built with plain HTML, CSS and JavaScript. No frameworks, no build step and no third-party scripts.

## Files

- `index.html` page content, SEO tags and the Content Security Policy
- `style.css` design tokens, light and dark modes, accent colors and layout
- `theme.js` applies the saved theme before the page paints
- `script.js` theme menu, active nav link and footer year
- `abdo.jpg` profile photo (keep it in the same folder as `index.html`)

## Themes

Visitors can pick Light, Dark or Auto (follows the device) and one of four accent colors from the Theme menu. The choice is saved in the browser.

## Security

GitHub Pages serves static files and cannot set custom HTTP headers, so protection is built into the page itself:

- A Content Security Policy (meta tag) that allows scripts and images only from this site and styles and fonts only from Google Fonts. Inline scripts are not allowed.
- No forms, no user input and no backend, so there is nothing to inject into.
- External links use `rel="noopener noreferrer"`.
- A referrer policy that sends only the site origin to other sites.
- Saved theme values are checked against a fixed list before use.
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
