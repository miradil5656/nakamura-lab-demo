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
