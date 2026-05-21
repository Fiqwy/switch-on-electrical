# Switch On Electrical Contractors — project notes

## What this is

Premium single-page website for **Switch On Electrical Contractors PTY LTD** — Locky &amp; Lily's family-run electrical contracting business based in Beechmont, Gold Coast hinterland. Built as a **spec pitch site** (referred by Macy from Control Detailing). The site IS the pitch — Nicholas sends Locky the live URL and lets the quality of the work close the sale.

Phone: **0475 365 373** · Email: info@switchonelec.com · Instagram: [@switchon.elec](https://instagram.com/switchon.elec) · Facebook: [Switch On Electrical Contractors PTY LTD](https://www.facebook.com/people/Switch-On-Electrical-Contractors-PTY-LTD/61574269461880/) · GBP: 5.0 stars (1 review at launch)

## Stack

Vanilla HTML + CSS + JS. Local copies of Lenis (smooth scroll), GSAP + ScrollTrigger (parallax/scrub), Three.js (loaded but not used in v1 — hero uses Canvas 2D instead for performance), Lottie. No build step. Deploys as static to Cloudflare Pages.

## Files

```
switch-on-electrical/
├── CLAUDE.md                      # this file
├── index.html                     # 16-section single-page
├── styles.css                     # design tokens (black + lime green) + components
├── script.js                      # Lenis, GSAP, nav, FAQ, form, before/after, sticky CTA, magnetic CTAs
├── safety-quiz.js                 # 5-question safety quiz module
├── hero-lightning.js              # Canvas 2D lightning + particles for hero
├── _generate-suburbs.py           # generator for suburb pages — re-run after edits
├── robots.txt                     # allow all + sitemap link
├── sitemap.xml                    # homepage + 8 suburb pages
├── _headers                       # Cloudflare Pages cache + security headers
├── _redirects                     # www → apex 301
├── vendor/
│   ├── lenis.min.js               # 1.1.18
│   ├── gsap.min.js                # 3.12.5
│   ├── ScrollTrigger.min.js       # 3.12.5
│   ├── three.min.js               # 0.149.0 (loaded but not used in v1)
│   └── lottie.min.js              # 5.12.2
├── suburbs/
│   ├── beechmont.html
│   ├── tamborine-mountain.html
│   ├── nerang.html
│   ├── mudgeeraba.html
│   ├── robina.html
│   ├── burleigh-heads.html
│   ├── broadbeach.html
│   └── surfers-paradise.html
└── assets/
    ├── logo/
    │   ├── favicon.svg            # power-button glyph in brand lime on black
    │   └── brand-detail.jpg       # Switch On branded stubby holder (logo reference)
    ├── about/
    │   └── locky-lily.jpg         # founders photo in front of branded ute
    └── gallery/
        └── gbp-cover.jpg          # LED step lighting install (from GBP)
```

## Brand

**Black + lime green + white + silver.** Locked from observed brand assets (ute decal, branded stubby holder, polo embroidery). Tokens at top of `styles.css` — change `--accent` and the supporting shades to adjust the entire palette.

Logo is hexagonal shield: "SWITCH O̲N" with the "O" replaced by the universal power-button glyph in lime green. The glyph is reused as favicon and as the brand mark in the nav, footer, and sticky bar.

Fonts: **Manrope** (display) + **Inter** (body), via Google Fonts.

## Operating principle: real where we can, tactful where we can't, NEVER invented

Real names, real photos, real founder story (verbatim from the FB "Meet the family" post), real services, real hours (Mon–Fri 7am–6pm), real Beechmont location. Anywhere we don't yet have detail, the copy is polished and accurate-by-omission rather than fictional:
- "Licensed QLD electrical contractor" — true, no fake licence number
- "Fully insured" — true, no fake dollar figure
- "Workmanship guaranteed" — true, no fake warranty length
- No Master Electricians AU badge unless they confirm membership

## Photo coverage (v1 launch)

Real photos we have:
- `locky-lily.jpg` — founders in front of branded ute (About section)
- `brand-detail.jpg` — Switch On branded stubby holder (gallery social tile)
- `gbp-cover.jpg` — LED strip lighting under timber stairs (Featured Install + Gallery feature tile)

Photo coverage gaps are filled with **on-brand SVG icon panels** (services section) and **social-CTA tiles** (gallery section three of six tiles). Nothing looks broken; the design assumes asset scarcity and still reads premium.

Post-purchase, Nicholas to source higher-res originals from Locky &amp; Lily (Dropbox / Drive) and swap into the gallery + services where appropriate.

## Pitch defaults swapped post-purchase

| Pitch value | Post-purchase swap-in |
|---|---|
| "Licensed QLD electrical contractor — number on request" | Specific licence # in trust strip + footer + JSON-LD |
| "Fully insured" | Specific public liability $ amount |
| "Workmanship guaranteed" | Specific warranty length (months/years) |
| Web3Forms placeholder access_key | Real access_key from web3forms.com — register form, paste key |
| 1 FB review (Shiree Frost) | Live Google Reviews widget once accumulated |
| SVG service icons | Real photos of completed jobs |
| Generic suburb intros | Locky/Lily edits if they want to personalise |

## Deploy

Preview build (don't point real domain yet — Nicholas reviews on `.pages.dev` first):

```bash
cd "/Users/nicholasmatthews/claude code projects/switch-on-electrical"
npx wrangler login  # refresh token first (expired April per Control Detailing HANDOFF)
npx wrangler pages deploy . --project-name=switch-on-electrical --commit-dirty=true
```

DNS cutover (after Nicholas + Locky sign off):
- Point `switchonelec.com` and `www.switchonelec.com` at the Cloudflare Pages project
- SSL auto-provisioned by Cloudflare

## Local preview

```bash
cd "/Users/nicholasmatthews/claude code projects/switch-on-electrical"
python3 -m http.server 8767
# visit http://localhost:8767/
```

## Post-purchase Discovery menu

See plan file at `~/.claude/plans/this-is-where-we-abundant-lake.md` — sections A through I. Nicholas runs these with Locky &amp; Lily after they say yes, then we swap pitch defaults for real values.
