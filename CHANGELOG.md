# Changelog

All notable changes to this project are documented here.

---

## [0.2.0.0] - 2026-04-16

### Added
- `i18n/ja.yaml` and `i18n/en.yaml` with full translation key set for all UI strings
  — header, footer, hero, research themes section, news section, 404 page
- `layouts/404.html`: bilingual 404 page wired to i18n keys
- `static/admin/index.html` + `static/admin/config.yml`: Decap CMS v3 via CDN
  — Collections: `news` (JP), `news_en` (EN), `publications`, `members`, `facilities`
  — File collections for YAML-backed data; GitHub backend on `main` branch

### Changed
- `layouts/partials/header.html`: replaced inline `{{ if eq .Language.Lang "ja" }}` conditionals with `{{ i18n "key" }}`
- `layouts/partials/footer.html`: same — all strings now pulled from i18n files
- `layouts/index.html`: hero, research section, news section all use i18n keys

### Verified
- `hugo --minify` builds with zero errors: 12 JP pages, 8 EN pages

---

## [0.1.0.0] - 2026-04-16

### Added
- Hugo extended v0.147.0 project scaffold (`hugo new site . --force`)
- `hugo.toml`: bilingual config (JP at `/`, EN at `/en/`), `defaultContentLanguageInSubdir = false`, navigation menus for both languages, sitemap, OGP params
- Tailwind CSS v3 + PostCSS + Autoprefixer pipeline via Hugo Pipes (`css.PostCSS`)
- `assets/css/main.css` with `@tailwind` directives and custom component classes (`btn-primary`, `btn-secondary`, `card`, `nav-link`)
- `tailwind.config.js` with QND Lab brand palette (primary `#006633`, accent `#1a1a2e`)
- Directory structure: `archetypes/`, `assets/css/`, `assets/js/`, `content/news/`, `content/research/`, `content/en/`, `data/`, `i18n/`, `layouts/`, `static/images/`
- Base layout (`layouts/_default/baseof.html`), default single and list templates
- `layouts/partials/head.html`: meta, OGP, Twitter Card, hreflang, canonical, Google Fonts, CSS fingerprinted asset
- `layouts/partials/header.html`: sticky nav, language toggle JP/EN, Alpine.js hamburger menu
- `layouts/partials/footer.html`: lab info, sitemap, contact in both languages
- `layouts/index.html`: hero section, 4 research theme cards, latest news feed (shows real content when added)
- Homepage `_index.md` stubs for JP and EN
- `.gitignore` for Hugo build artifacts, `node_modules`, `.env`

### Verified
- `hugo --minify` builds with zero errors: 11 JP pages, 7 EN pages
