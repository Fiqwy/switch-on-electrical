# Switch On Electrical Contractors — Session Handoff

**Last updated:** 2026-05-21 (v3 deployed to GitHub Pages preview)
**Status:** v3 LIVE at the GitHub Pages preview URL — this is what Nicholas sends to Locky. Custom domain cutover deferred until Locky purchases.

## Deployed (preview)

- **Live URL:** https://fiqwy.github.io/switch-on-electrical/ — this is what gets sent to Locky.
- **Repo:** https://github.com/Fiqwy/switch-on-electrical (public — required for GitHub Pages on free accounts)
- **Branch + Pages config:** `main` root, auto-deploy on push (~30–60s propagation)
- **Initial commit:** `a4a555f` — "Initial site — v3 spec pitch build for Locky"
- **Verified at deploy time (2026-05-21):** homepage 200, suburb pages 200, all 8 Services photos 200, Leaflet vendor CSS 200, hero renders correctly in headless Chrome at 1280×800.

**Deploy flow for future updates:**
```bash
cd "/Users/nicholasmatthews/claude code projects/switch-on-electrical"
git add <specific-files>
/commit    # global rule — use /commit, not raw git commit
git push origin main
# ~30–60s later: changes live at https://fiqwy.github.io/switch-on-electrical/
```

**Deferred until Locky purchases — DO NOT do without his sign-off:**
- Custom domain `switchonelec.com` DNS cutover (Cloudflare → GitHub Pages CNAME or migrate to Cloudflare Pages)
- Web3Forms access key (form silently fails until wired — see `switch-on-purchase-followups` memory)
- T&Cs, privacy policy, licence number, insurance dollar amount, exact warranty length
- Master Electricians AU badge (if applicable)
- Service list edge cases, suburb priority order
- See full Discovery menu in `~/.claude/plans/this-is-where-we-abundant-lake.md` sections A–I



## v3 — Real Services Photos (2026-05-21 late afternoon)

All 8 inline `<svg>` icon panels in the Services section ([index.html lines 198–420](index.html)) replaced with real photographs of installs/products. Site quality jumped — no more "polished placeholder" tells. Stored at `assets/gallery/services/<icon>.jpg`. Each `<img>` tag includes descriptive alt text + `loading="lazy"` + `decoding="async"`.

| `data-icon` | Photo source | What it shows |
|-------------|--------------|---------------|
| switchboard | Pexels #5767595 | Residential switchboard with DIN-rail breakers + meter on white wall |
| safety | Pexels #28950842 | Row of colour-coded DIN-rail safety switches in a switchboard |
| ev | Pexels #5391509 | Wall-mounted residential EV charger on brick exterior |
| lighting | Pexels #8134808 | Premium master bedroom with LED cove + strip + downlights |
| powerpoints | Wikimedia `Australian_Dual_Socket_Outlet.jpg` | AS/NZS 3112 double GPO with angled-Y pin pattern |
| smoke | Wikimedia `Smoke_detector_(1).JPG` | White photoelectric smoke alarm on textured ceiling |
| aircon | Pexels #6585615 | Modern Scandi interior with split-system AC head unit centred on wall |
| commercial | Pexels #32166402 | Café interior with premium yellow pendant lights |

CSS notes: `.service-row .service-img img` was already present in `styles.css` lines 564–569 (anticipated future image use). Added `position: relative; z-index: 2` so img sits above the legacy data-icon `::before` grid overlay. Added two new rules to hide the icon-panel gradient + grid decoration when the wrapper has an img child: `.service-img[data-icon]:has(img)::before { display: none; }` and `.service-img[data-icon]:has(img) { background: var(--bg-surface); }`. `data-icon` attribute kept on each wrapper for backward-compat with any JS hooks. Hover-zoom (`transform: scale(1.04)`) still works on the photos.

**Failed approaches recorded for next session:**
- **flux_dev AI gen** failed the realism bar earlier in the same day — generated "safety switch" was a wall light switch, "power point" was a US-style horizontal-slot outlet. Don't retry AI for AU-specific electrical hardware.
- **Pexels via headless Playwright** is Cloudflare-blocked. Use WebFetch for search → curl for direct CDN download. Cap `w=1200` to stay under Claude's 2000px Read limit.
- **Wikimedia** is the only reliable source for AS/NZS 3112 AU power point photo.

## v2 polish — what changed since v1 (2026-05-21 evening)

1. **Scroll smoothness fix** — root cause was Lenis being raf'd twice per frame (manual loop + GSAP ticker both calling `lenis.raf()`). Removed the duplicate. Also tightened `duration: 1.15 → 1.0`, throttled parallax scrubs (`1.5 → 2.5`), gated heavy scrubs behind `gsap.matchMedia('(min-width: 769px)')` so mobile gets a static layout, and set `autoRaf: false` on Lenis.
2. **Hero lightning optimised** — `hero-lightning.js` now pauses via IntersectionObserver when scrolled out of view (saves ~6–10ms/frame everywhere else on the page). Particle count reduced 36→22 desktop / 14 mobile, DPR capped at 1.5 on mobile, shadow blur dropped on the particle pass.
3. **Stubby holder removed from gallery** — `brand-detail.jpg` was the 3rd of 3 "real" photos. Removed and replaced with an extra social CTA tile ("@switchon.elec — Follow on Instagram"). The original "More on Instagram" CTA was also dedupe-replaced with a "5.0 on Google — Read our reviews" CTA. `brand-detail.jpg` stays in `assets/logo/` as the source-of-truth reference for tracing the logo SVG later — it is NOT to be used as a work/job photo.
4. **Real Leaflet map** — replaced the hand-stylised SVG with a proper Leaflet 1.9.4 + CARTO dark-tiles map. HQ pulse marker on Beechmont, 7 clickable lime markers on the suburb landing pages. `service-areas-map.js`, `vendor/leaflet.min.js`, `vendor/leaflet.css` are the new files.
5. **3 real Google reviews integrated** (later evening) — Nicholas dropped IMG_3489/3490 in `~/Desktop/switch-on-dropoff/`; reviews extracted and rebuilt as a 3-up card grid. JSON-LD `aggregateRating.reviewCount` bumped 1→3 on `index.html` AND all 8 suburb pages (via `_generate-suburbs.py`). One of the reviewers is Macy (Control Detailing) — referral-loop cross-pollination as social proof.

**Still to do (v3 follow-ups):** all gates now waiting for Locky's purchase. See `switch-on-purchase-followups` memory + Outstanding Work list below.

> Read this end-to-end before doing anything. This is a **spec pitch site** — Locky &amp; Lily haven't bought yet. Quality bar is "perfect" — the site IS the sales pitch.

---

## TL;DR

You are picking up a spec-pitch website for **Switch On Electrical Contractors PTY LTD** — Locky &amp; Lily's family-run electrical contracting business in Beechmont, Gold Coast hinterland.

- **Local preview:** `http://localhost:8767/` (start the server first — see "How to run locally" below)
- **Owners:** Locky &amp; Lily (husband + wife), kids Layken &amp; Lennon-Rae
- **Phone:** 0475 365 373
- **Email:** info@switchonelec.com
- **Domain owned (not yet pointed):** switchonelec.com
- **Referral source:** Macy from Control Detailing (2026-05-21)
- **Plan file (full design rationale):** `~/.claude/plans/this-is-where-we-abundant-lake.md`

Nicholas (the agency, Applied Intelligence) built v1 in one session on 2026-05-21 as a **spec pitch** — the strategy is to send Locky the live URL and let the quality of the work close the sale. **Locky has NOT yet purchased a website**. Once he does, Nicholas runs the post-purchase Discovery menu (questions A through I in the plan file) and we swap pitch defaults for real values in a quick second pass.

---

## Who Locky &amp; Lily are — keep in mind

- **Locky** (husband, sparky) and **Lily** (wife) own and run Switch On together.
- Two young kids: **Layken &amp; Lennon-Rae**.
- Live in a "little Beechmont cottage" — the business runs out of there.
- Self-described as "**relaxed, go with the flow** people both in life and parenting". Built the business the same way: "**genuine, down to earth and community focused**".
- Brand new business — 192 FB followers, 1 review on FB (5★ from Shiree Frost), 5.0 stars on Google Business Profile (1 review there too). No website set on GBP yet.
- They service **all residential and commercial electrical work** + **split-system air-conditioning installs** (per Nicholas confirmed this session; ute decal also reads "Electrical &amp; Airconditioning").
- Hours: **Mon–Fri 7am–6pm**. **NOT 24/7 emergency** — quote-led, not emergency-led.

**Do not invent credentials.** Site copy uses tactful real-feeling placeholders ("Licensed QLD electrical contractor", "Fully insured", "Workmanship guaranteed") because we don't have specific numbers yet. These are accurate-by-omission, not fabricated. Replace post-purchase.

---

## What's in v1

### Stack &amp; build decisions

| Decision | Choice | Why |
|---|---|---|
| Hosting | Cloudflare Pages → switchonelec.com (preview on `.pages.dev` first) | They own the domain. Wrangler OAuth needs refresh (token expired April per Control Detailing HANDOFF). |
| Stack | Vanilla HTML/CSS/JS | Matches the other client sites (Control Detailing, DR Paint, Silver Style, Good Coast Finance). No framework. No build step. |
| Smooth scroll | Lenis 1.1.18 (`vendor/lenis.min.js`) | LATITO-tier feel. Local copy, not CDN. |
| Animations | GSAP 3.12.5 + ScrollTrigger | Parallax, scrub, stagger reveals. Local copies. |
| Hero animation | **Canvas 2D** (not Three.js) — `hero-lightning.js` | Plan called for Three.js WebGL lightning; pivoted to Canvas 2D for better mobile FPS. Three.js is loaded in vendor/ but unused in v1 (kept for potential future use). |
| Lottie | `vendor/lottie.min.js` (loaded but currently no Lottie animations used) | Available if we want to add later. Process steps use static SVG icons now. |
| Typography | Manrope (display) + Inter (body), Google Fonts | Modern, AU-friendly. |
| Palette | **Black + lime green + white + silver**. `--accent: #8FCB3A`. Locked from observed brand assets. Tokens at top of `styles.css`. | Their actual brand colours, refined for web. |
| Logo | SVG power-button glyph inline + favicon.svg | Traced from the stubby holder + ute decal photos. The "O" of "SWITCH ON" is replaced by the universal power-button glyph in lime green. |
| Form | **Web3Forms** — placeholder access_key in `index.html` AND every suburb page | NOT WIRED YET. See Outstanding Work #1. |

### Files

```
~/claude code projects/switch-on-electrical/
├── HANDOFF.md                # this file
├── CLAUDE.md                 # project notes
├── index.html                # 16-section single-page
├── styles.css                # design tokens + components + responsive
├── script.js                 # Lenis, GSAP, nav, FAQ, form, before/after slider, sticky CTA, magnetic CTAs, custom cursor
├── safety-quiz.js            # 5-question quiz module (separately loaded)
├── hero-lightning.js         # Canvas 2D lightning + particles for hero
├── _generate-suburbs.py      # Generator script — re-run after edits to suburb data
├── robots.txt
├── sitemap.xml               # homepage + 8 suburb pages
├── _headers                  # Cloudflare cache + security headers
├── _redirects                # www → apex 301
├── vendor/
│   ├── lenis.min.js          # 1.1.18
│   ├── gsap.min.js           # 3.12.5
│   ├── ScrollTrigger.min.js  # 3.12.5
│   ├── three.min.js          # 0.149.0 (loaded, unused in v1)
│   └── lottie.min.js         # 5.12.2 (loaded, unused in v1)
├── suburbs/                  # 8 SEO landing pages
│   ├── beechmont.html
│   ├── tamborine-mountain.html
│   ├── nerang.html
│   ├── mudgeeraba.html
│   ├── robina.html
│   ├── burleigh-heads.html
│   ├── broadbeach.html
│   └── surfers-paradise.html
└── assets/
    ├── og-image.jpg          # 1200×630 social share (from hero screenshot)
    ├── logo/
    │   ├── favicon.svg       # power-button glyph in brand lime
    │   └── brand-detail.jpg  # Switch On branded stubby holder (the source of truth for logo design)
    ├── about/
    │   └── locky-lily.jpg    # founders photo in front of branded ute
    └── gallery/
        └── gbp-cover.jpg     # LED strip lighting under timber stairs (THE killer install photo, from GBP)
```

### Section order on homepage

1. **Nav** — fixed, glass blur on scroll, mobile burger drawer (full-screen `width:100vw; height:100dvh`)
2. **Hero** — full viewport, **Canvas 2D lightning + particles** background, "Done once. Done right." with lime gradient on second line, dual CTA (Get a free quote / Call Locky)
3. **Trust strip** — Licensed QLD electrical contractor · Fully insured · Family-owned · Beechmont based · Workmanship guaranteed
4. **Featured install** — Hero photo (LED step lighting from GBP) with caption. Replaces the before/after slider from the original plan (we only have 1 install photo currently — pivoted to "featured install showcase" rather than fake before/after pairs)
5. **Services** — 8 alternating editorial cards with **on-brand SVG icon panels** (not photos — designed-around-scarcity approach):
   - Switchboard upgrades · Safety switches &amp; RCDs · EV chargers · LED lighting · Power points &amp; rewires · Smoke alarms · Split-system air-con · Commercial fit-outs
6. **Safety Quiz** — 5-question interactive home safety quiz (the Tesla-calc-killer). Scores 0–15 against current QLD standards. Tailored CTA links to contact form with prefilled service.
7. **Process** — 4-step timeline with SVG icons in lime-glow circles: Get in touch → On-site quote → Clean install → Tested &amp; guaranteed
8. **Gallery** — 3 real photos (LED steps featured + Locky &amp; Lily + brand-detail) + 3 social CTA tiles (Facebook / Instagram / Get a quote)
9. **About / Meet the Family** — founders photo + verbatim founder story from FB "Meet the family" post
10. **Service Areas** — interactive SVG map with hoverable suburb regions (clickable to dedicated landing pages) + pill list
11. **FAQ** — 8-item accordion (licensed?, areas, emergency, quote speed, small jobs, warranty, commercial, EV chargers, AC)
12. **Reviews** — 1 real FB review from Shiree Frost + "leave us a Google review" CTA card
13. **Contact** — split layout: Web3Forms quote form + sidebar with phone, email, hours, social links
14. **CTA strip** — full-bleed "Ready to do it once and do it right?"
15. **Footer** — wordmark, all suburb page links (internal linking + SEO), licence statement, copyright, "Done once. Done right." tagline
16. **Sticky mobile CTA bar** — fixed bottom, two buttons (Call + Quote). Shows after 60% viewport scroll. Hides near footer.

### Suburb landing pages (`suburbs/*.html`)

8 pages, each generated from `_generate-suburbs.py`. Each has:
- Unique meta title + description targeting `"[Suburb] Electrician"`
- Personalised hero ("Your [Suburb] electrician. Done once. Done right.")
- Local context paragraph
- Service overview in 4-item accordion
- CTA strip + contact form
- Own JSON-LD `Electrician` schema with `areaServed` scoped to that suburb
- Listed in `sitemap.xml`

**To regenerate** (after editing the script's SUBURBS list or template):
```bash
cd "/Users/nicholasmatthews/claude code projects/switch-on-electrical"
python3 _generate-suburbs.py
```

---

## Outstanding work (priority-ordered)

### 1. WIRE UP THE WEB3FORMS ACCESS KEY — gates lead capture

The form action `https://api.web3forms.com/submit` is real, but the `access_key` field across `index.html` and every `suburbs/*.html` is the placeholder string `REPLACE_WITH_WEB3FORMS_KEY`.

To wire up:
1. Go to https://web3forms.com (no signup — just provide an email)
2. They send a real access key tied to that email
3. Replace `REPLACE_WITH_WEB3FORMS_KEY` everywhere (in `index.html` AND all 8 `suburbs/*.html` — easiest is a sed-replace)

Recommended target: `info@switchonelec.com` (Locky) + Nicholas's email as a hidden CC via Web3Forms's `cc` field. Discussion of routing is in the post-purchase Discovery menu (I1).

### 2. DEPLOY TO CLOUDFLARE PAGES (preview first)

Wrangler OAuth expired 2026-04-05 (per Control Detailing HANDOFF). Run `npx wrangler login` interactively first — opens a browser, takes 30 seconds. Then:

```bash
cd "/Users/nicholasmatthews/claude code projects/switch-on-electrical"
npx wrangler pages deploy . --project-name=switch-on-electrical --commit-dirty=true --branch=main
```

Returns a `switch-on-electrical.pages.dev` URL. **Send this preview to Locky &amp; Lily for review FIRST**. Only point `switchonelec.com` DNS at it once they've approved.

### 3. DNS CUTOVER (after they say yes)

- Point `switchonelec.com` A/AAAA records at Cloudflare Pages
- `www` either CNAME to apex or redirects to apex via `_redirects` (already configured)
- SSL auto-provisioned by Cloudflare
- Also: **add the live URL to their GBP** (currently the website field is empty — quick win for local SEO)

### 4. POST-PURCHASE DISCOVERY (Nicholas runs with Locky)

Plan file (`~/.claude/plans/this-is-where-we-abundant-lake.md`) has the full menu — A1 through I3. Get specifically:

- QLD Electrical Contractor licence number → replace "Licensed QLD electrical contractor" in trust strip + footer + JSON-LD
- Public liability insurance amount → replace "Fully insured" with specific $ figure
- Warranty length offered → replace "Workmanship guaranteed" with specific months/years
- Master Electricians AU membership status → add badge if yes
- Full electrical service list with their priority order (currently using 8 standard categories)
- Higher-res original photos via Dropbox / Drive (the IG/FB CDN serves downsized versions)
- AC scope detail (just splits? servicing too? ducted?)
- Confirmation of the 8 suburb picks vs Locky's preferred priority list

### 5. PHOTO PASS — fill the icon-led services with real install photos

Currently all 8 service cards use on-brand SVG icon panels (deliberately — we only had 3 real photos to play with). Once Locky &amp; Lily share their photo folder:
- Swap each service-row's `<div class="service-img" data-icon="...">` for `<div class="service-img"><img src="..." alt="..." loading="lazy"></div>` (the responsive + parallax CSS handles both)
- Replace the gallery social CTA tiles (last 3 of 6) with real work photos
- Build out the before/after slider section (currently replaced with single Featured Install) once we have paired before/after photos

The SVG icon design is a real strength of v1 though — even after photos arrive, consider keeping the icon panels in some service cards as a deliberate visual rhythm.

### 6. GOOGLE BUSINESS PROFILE OPTIMISATION

Their GBP is at 5.0 stars but barely populated. After site is live:
- Add website URL to GBP
- Upload all the work photos
- Set service categories (they're "Electrician" — add sub-categories)
- Set hours
- Encourage Locky to post weekly updates

This is **massive** for local SEO. Should be done before any paid ads.

### 7. SUBURB EXPANSION (phase 2)

8 suburbs at launch covers the high-priority areas. Add more later (Helensvale, Coomera, Pacific Pines, Coolangatta, Currumbin, Tugun, Palm Beach, Mermaid Waters, Bundall, Southport) by adding entries to `SUBURBS` list in `_generate-suburbs.py` and re-running. Add new URLs to `sitemap.xml` too.

---

## Gotchas — read before changing the site

### Wrangler OAuth expired
Same issue as Control Detailing. CLI deploys to Cloudflare Pages fail until you run `npx wrangler login` interactively.

### Lenis + IntersectionObserver edge case
Lenis hijacks scroll position, which can prevent IntersectionObserver from firing on programmatic scroll. Safeguards in `script.js`:
- `document.documentElement.classList.add('has-js')` is set on load; `[data-reveal]` only starts hidden if `has-js` is on. So if JS fails, reveals are visible by default.
- Elements already in viewport on load are revealed immediately (no wait for IO).
- A failsafe at the bottom of `script.js` reveals anything still hidden 1.5s after `load`.

### Mobile burger drawer
`.nav-mobile` uses explicit `width: 100vw; height: 100dvh;` instead of `inset: 0` to dodge Lenis containing-block weirdness on mobile. **Don't revert that.**

### Canvas 2D lightning (not Three.js)
The plan originally called for Three.js WebGL lightning. We pivoted to Canvas 2D in `hero-lightning.js` for better mobile FPS — the effect is just as electric and runs at 60fps on iPhone. Three.js is loaded in `vendor/` but unused; safe to keep there for any 3D additions later.

### Brand-detail photo (`assets/logo/brand-detail.jpg`)
This is a photo of a branded stubby holder (the highest-fidelity reference for the logo design). It's used in the Gallery section, but it's also the **source of truth for tracing the actual logo as SVG** if you want a proper wordmark beyond the current power-button-glyph-only favicon.

### "Real where we can, tactful where we can't, NEVER invented"
Site copy avoids fake credentials. If you're adding new copy:
- Don't invent licence numbers, insurance amounts, warranty lengths, or certifications
- Use polished accurate-by-omission phrasing instead ("Licensed", "Fully insured", "Workmanship guaranteed")
- Replace with specifics post-purchase

### Web3Forms placeholder
`REPLACE_WITH_WEB3FORMS_KEY` appears in `index.html` AND every `suburbs/*.html`. Replace ALL occurrences in one sed pass.

### Australian English
Nicholas insists on AU spelling everywhere user-facing: colour, optimise, behaviour, organised. The site copy already follows this — keep it.

### Don't read .env files
Per Nicholas's global rules. There's no .env here, but if one appears, don't read it.

---

## How to run locally

```bash
cd "/Users/nicholasmatthews/claude code projects/switch-on-electrical"
python3 -m http.server 8767
# visit http://localhost:8767/
```

Port 8765 is often held by an older Control Detailing server — 8767 is the convention for this project.

---

## What NOT to do

- **Don't deploy to switchonelec.com without sending Locky the `.pages.dev` preview first.** This is a pitch — they need to see it before public URLs go live.
- **Don't invent credentials.** If you don't have the licence number, write "Licensed QLD electrical contractor". Never write "Licence #99999".
- **Don't change the About section copy.** Those are Locky &amp; Lily's actual words from their rebrand FB post. Anything else would lose authenticity.
- **Don't add fake reviews.** The single Shiree Frost review is real (from FB). Don't fabricate more — instead push them to gather real Google reviews.
- **Don't replace the LED step lighting hero photo** without comparison. It's their best published work and carries enormous weight in the gallery.
- **Don't strip the JSON-LD schemas** in `index.html` or any `suburbs/*.html`. They're tuned for Google's `Electrician` LocalBusiness type with per-page `areaServed` scoping.

---

## Quick contact reference

- **Locky &amp; Lily** — 0475 365 373 · info@switchonelec.com
- **Nicholas (agency owner)** — nicholasjmatthews2006@gmail.com

---

## Related memory / docs

- Global memory index: `~/.claude/projects/-Users-nicholasmatthews/memory/MEMORY.md`
- This project's memory entry: `~/.claude/projects/-Users-nicholasmatthews/memory/project_switch_on_electrical.md`
- Spec-pitch workflow pattern: `~/.claude/projects/-Users-nicholasmatthews/memory/feedback_spec_pitch_websites.md`
- Workspace router: `~/claude code projects/CLAUDE.md`
- Plan file (full design rationale + post-purchase Discovery menu): `~/.claude/plans/this-is-where-we-abundant-lake.md`
- Referral source (similar build, similar area): `~/claude code projects/control-detailing/HANDOFF.md`

---

If you're a fresh agent picking this up: **start by reading this whole doc, then the plan file, then `CLAUDE.md` in this folder. After that, confirm with Nicholas what he wants to tackle from the Outstanding Work list. The site is a pitch — protect that quality.**
