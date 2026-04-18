# TODOS — QND Lab Website

Post-launch experiments and deferred work. These are NOT in scope for the initial build.

---

## TODO-01: Plausible Analytics

**What:** Add Plausible Analytics (`<script>` tag in `layouts/partials/head.html`) for privacy-friendly visitor tracking.

**Why deferred:** GDPR and university privacy policy implications need to be confirmed before any analytics are added to a university-affiliated site. This review has not happened yet.

**Effort:** 30 minutes once the policy question is answered.

**Steps:**
1. Confirm with the university that Plausible (EU-hosted, no cookies, no personal data) is compliant with university policy.
2. Sign up at plausible.io, add the domain.
3. Add the `<script>` snippet to `layouts/partials/head.html` (one line, behind a `{{ if not .Site.Params.disableAnalytics }}` guard).
4. Verify data is flowing in the Plausible dashboard after deploy.

---

## TODO-03: Decap CMS /admin Smoke Test in CI

**What:** Add a post-deploy CI step that verifies `/admin` returns HTTP 200 after each production deploy.

**Why deferred:** The OAuth flow itself can't be tested in CI (requires interactive GitHub login), but confirming the static files deployed correctly is a 2-line check. If `/admin/index.html` is missing, the professor's only update path silently fails with a 404 that looks like an OAuth error.

**Effort:** 5 minutes.

**Steps:**
1. Add to `.github/workflows/deploy.yml` post-deploy step:
   ```bash
   curl -f https://adv.chiba-u.jp/nano/qnd/admin/ >/dev/null \
     && echo "✓ /admin deployed" || echo "✗ /admin missing — check Cloudflare Pages deploy"
   ```
2. Do NOT fail the CI job on this check (OAuth state is not testable in CI; this is an advisory check).

---

## TODO-04: Hero Section Image (Design-Critical)

**What:** Add an actual lab photo (SEM image, quantum device, or clean-room shot) to the homepage hero section.

**Why deferred:** No lab photos are available yet. The current hero is text-only on black. Per the Apple design reference (`awesome-design-md/design-md/apple/DESIGN.md`): "Product-as-hero photography on solid color fields" is a core design principle — the hero will feel incomplete until a real image is there.

**Who to ask:** Professor Aoki — request highest-resolution SEM images or device photos available. JPG or PNG, any aspect ratio (will be cropped/positioned in CSS).

**Effort:** 30 minutes once image is provided. Drop in `static/images/hero.jpg`, add `<img src="/images/hero.jpg" ...>` to `layouts/index.html` hero section.

---

## TODO-05: Customer Site Repo Strategy (1 customer = 1 fork)

**What:** Document and codify the "1 customer = 1 fork of openclaw" operational model.

**Why:** At scale, template updates (security fixes, Hugo upgrades, layout improvements) won't propagate back to customer forks automatically. Need a process before hitting 3+ customers.

**Pros:** Each customer has fully isolated repo, independent Decap CMS permissions, independent Cloudflare Workers deploy, independent domain.

**Cons:** Template bug fix = N manual cherry-picks. Customer customization drift vs template base is hard to track. No fleet-wide update story.

**Context:** Design doc (`m99-main-design-20260418-110852.md`) chose Productized Service. Current 1 customer is forked. Decision affirmed: continue 1-customer-1-fork. Revisit before 3rd customer.

**Steps (future, not now):**
1. Write `FORK_CHECKLIST.md` in openclaw — what to rename per customer (wrangler name, baseURL, GitHub OAuth app_id, domain).
2. Consider a `template-sync` script that cherry-picks a labeled commit range from openclaw into each customer fork.
3. Before 3rd customer: evaluate if pain justifies moving to a branch-per-customer single-repo model.

**Depends on / blocked by:** Nothing right now. Revisit at customer #3.

---

## TODO-06: LP Conversion Analytics — Cloudflare Web Analytics

**What:** Add Cloudflare Web Analytics beacon to the LP (`/service/` page) to measure channel-level conversion (learn conference vs cold mail vs referral performance).

**Why:** Design doc specifies "A/Bテスト: どのチャネルがCAC < LTVの20%に収まるか" in Phase 2. Without LP-level analytics, this test is unmeasurable.

**Pros:** Free, zero cookies (no GDPR/法人policy concern), zero config code, shows unique visits and page paths.

**Cons:** Cloudflare Analytics does not capture UTM parameters natively in the free dashboard. If UTM analysis is needed, upgrade path is Plausible ($9/mo) or GA4 (free but cookies).

**Context:** LP added to existing openclaw repo at `/service/`. Cloudflare Workers deploy already in place. Beacon is one `<script>` tag in `layouts/partials/head.html` gated on `.IsHome` or a page param.

**Steps:**
1. Cloudflare dashboard → Analytics → Web Analytics → add site.
2. Copy the `<script>` snippet.
3. Add to `layouts/partials/head.html` behind `{{ if .Params.analytics }}`.
4. Set `analytics: true` only in `content/service/_index.md` front matter (don't track customer lab sites with the operator's beacon).
5. Verify post-deploy that beacon fires in Cloudflare dashboard.

**Depends on / blocked by:** LP implementation (`/service/` page) must ship first.

---

## TODO-02: ResearchProject JSON-LD Schema

**What:** Add `ResearchProject` schema.org structured data to `/research/` and individual research theme pages.

**Why deferred:** Google has not publicly confirmed it renders `ResearchProject` schema as rich results. Adding it pre-launch would be unverifiable noise. Post-launch, Google Search Console can confirm whether impressions appear.

**Effort:** ~2 hours (add partials, verify with Rich Results Test).

**Steps:**
1. After site is live and indexed (give it 2-4 weeks), open Google Search Console → Enhancements.
2. If `ResearchProject` rich results appear organically → no action needed.
3. If not: add `layouts/partials/json-ld-research.html` with `@type: ResearchProject`, `name`, `description`, `url`, `funder` (千葉大学), `researchSubject`.
4. Include the partial in `layouts/research/single.html` only.
5. Submit research pages for re-indexing via Search Console URL inspection tool.
6. Monitor for 4 weeks. If zero impressions in "Enhancements" → this schema is not supported; remove to keep the codebase clean.
