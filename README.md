# Masana WebWorks — Obsidian & Champagne Edition

A luxury-styled, responsive static website for Masana WebWorks. The original company logo files and supplied developer illustration remain included unchanged. Two portfolio/client logo copies were prepared with transparent backgrounds for the public-facing work sections; the untouched originals remain in `assets/`.

## Design direction

- Deep obsidian-navy first screen, champagne-gold details and warm ivory surfaces.
- Editorial serif headings balanced with accessible sans-serif interface text.
- The supplied laptop/developer illustration appears in the homepage hero, including on mobile screens.
- Transparent client logos for R.K. Mabunda Attorneys Inc. and JoyChn Media.
- Purposeful services, skills, portfolio, process, packages and enquiry sections.
- No unverified ratings, fake counters, invented review quotes, or experience-duration claims.
- SVG user-interface icons are embedded in the page — no external icon font required.

## Files

- `index.html` — main site
- `styles.css` — responsive styling
- `script.js` — navigation, animations and package selection
- `chatbot.js` — browser-based Masana Assistant
- `email-routing.js` — FormSubmit enquiry handling and optional chatbot handoff
- `privacy.html` / `terms.html` — legal pages with matching site styling
- `assets/` — original and cleaned image assets
- `legal/` — existing legal PDFs

## Forms and chatbot

The destination is **www.vukosi394@gmail.com** as previously specified. The form uses FormSubmit; email delivery depends on activation and a live test with the recipient mailbox. The static chatbot offers guided replies and optional contact handoff; it is not a generative AI agent. A user may explicitly consent to send a recent chat transcript through the handoff form; ordinary chat text stays in the browser.

## Deployment

Upload the contents of this folder to your site's document root. The website works as static HTML/CSS/JavaScript; fonts can load from Google Fonts on an internet-connected browser, with local fallbacks. Ensure `assets/`, `legal/`, and JavaScript files are uploaded with `index.html`. Confirm the real domain, hosting, FormSubmit activation, and end-to-end email receipt after going live.

The legal pages and PDFs should be reviewed for accuracy before business use; they are not a substitute for professional legal advice.
