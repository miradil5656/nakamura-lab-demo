# DESIGN.md — Advanced Materials Science Laboratory (Nakamura Lab)

> Adapted from NVIDIA's design system. Industrial precision, dark authority, electric green accent.
> This file applies to the `demo/nakamura-lab` branch.
>
> For other demo branches, see the footer of this file.

---

## 1. Visual Theme & Atmosphere

High-contrast, technology-forward. Built for a physics lab doing cutting-edge quantum materials research — the design communicates the same precision and authority as the research itself. Black dominates. The electric lime-green (`#76b900`) appears only at high-signal moments: borders, underlines, interactive states. Never as a background fill.

Think hardware specification sheets rendered in pixels. Navigation labels read like instrument markings. The contrast between dark sections (white text on black) and light sections (black text on white) creates a natural scroll rhythm.

**Key characteristics:**
- True black (`#000000`) primary background; pure white (`#ffffff`) for light sections
- Lab Green (`#76b900`) as pure accent — borders, underlines, active states only
- Inter as the workhorse font (weight 700 dominant for headings and interactive)
- Sharp corners: 2px border-radius for buttons and cards — engineered precision
- Green-bordered buttons on dark backgrounds (transparent fill, visible only via border)

---

## 2. Color Palette

### Primary
| Name | Hex | Role |
|------|-----|------|
| Lab Green | `#76b900` | Brand accent — borders, underlines, CTAs, active indicators |
| True Black | `#000000` | Primary background (dark sections), text on light |
| Pure White | `#ffffff` | Text on dark, light section backgrounds, card surfaces |

### Extended
| Name | Hex | Role |
|------|-----|------|
| Near Black | `#1a1a1a` | Dark card surfaces, hover backgrounds |
| Gray 500 | `#757575` | Muted text, metadata, captions |
| Gray 400 | `#898989` | Secondary text |
| Gray 300 | `#a7a7a7` | Tertiary text on dark backgrounds |
| Gray Border | `#5e5e5e` | Subtle borders, divider lines |
| Green Bright | `#bff230` | Hover highlights on green accents |

### Semantic
| Name | Hex | Role |
|------|-----|------|
| Error | `#e52020` | Form errors, destructive actions |
| Info | `#0046a4` | Informational accents |

### Shadows
- Card: `rgba(0, 0, 0, 0.3) 0px 0px 5px 0px`

---

## 3. Typography

### Font Stack
- **Primary**: `Inter`, fallback: `system-ui, -apple-system, Arial, Helvetica, sans-serif`
- **Monospace**: `JetBrains Mono`, fallback: `SFMono-Regular, Menlo, Consolas, monospace`

Add to Hugo head: `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">`

### Scale

| Role | Size | Weight | Line Height | Notes |
|------|------|--------|-------------|-------|
| Hero heading | 2.5rem (40px) | 700 | 1.2 | Dark sections; scales to 1.8rem mobile |
| Section heading | 1.75rem (28px) | 700 | 1.25 | Section titles, card headings |
| Sub-heading | 1.25rem (20px) | 700 | 1.5 | Feature descriptions |
| Nav label | 0.875rem (14px) | 700 | 1.43 | `text-transform: uppercase` |
| Body | 1rem (16px) | 400 | 1.6 | Standard reading text |
| Caption | 0.875rem (14px) | 400 | 1.5 | Metadata, timestamps |
| Button | 1rem (16px) | 700 | 1.25 | CTA text |

**Principles:**
- Weight 700 is the dominant voice for headings, navigation, buttons
- Weight 400 reserved for body text and descriptions
- Navigation uses uppercase 14px bold — reads like instrument labels

---

## 4. Component Styles

### Buttons

**Primary (dark background)**
```css
background: transparent;
color: #ffffff;
border: 2px solid #76b900;
border-radius: 2px;
padding: 11px 20px;
font-size: 16px;
font-weight: 700;
/* Hover: background #76b900, color #000000 */
/* Tailwind: bg-transparent text-white border-2 border-[#76b900] rounded-sm px-5 py-[11px] font-bold hover:bg-[#76b900] hover:text-black */
```

**Primary (light background)**
```css
background: #76b900;
color: #000000;
border: 2px solid #76b900;
border-radius: 2px;
padding: 11px 20px;
font-weight: 700;
/* Hover: background #000000, color #ffffff, border-color #000000 */
```

**Secondary**
```css
background: transparent;
border: 1px solid #5e5e5e;
color: #a7a7a7;
border-radius: 2px;
padding: 8px 16px;
```

### Cards
```css
background: #1a1a1a;          /* dark sections */
background: #ffffff;           /* light sections */
border: 1px solid #5e5e5e;
border-radius: 2px;
box-shadow: rgba(0, 0, 0, 0.3) 0px 0px 5px 0px;
padding: 20px 24px;
/* Title: green underline on hover via border-bottom 2px solid #76b900 */
```

### Links
- On dark: `#ffffff`, hover `#76b900`
- On light: `#000000`, underline `2px solid #76b900`, hover color shifts
- Navigation: uppercase, bold, white, no underline

### Navigation
- `background: #000000` (sticky)
- Logo left, menu links center-right
- Menu links: `Inter 14px weight 700 uppercase #ffffff`
- Active / hover: `color: #76b900`
- Mobile: hamburger collapse

### Section Alternation
Dark (`#000000` bg, `#ffffff` text) alternates with light (`#ffffff` bg, `#000000` text).  
The Lab Green accent works identically in both.

---

## 5. Layout

- Max content width: `1200px`
- Base spacing unit: `8px`
- Section vertical padding: `64px` desktop, `40px` mobile
- Card grid gap: `16–20px`
- Border-radius: `2px` for buttons/cards (sharp, engineered)

### Whitespace
Dense but deliberate. Cards sit close together (catalog feel, not gallery). Generous vertical padding between sections.

---

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat | none | Page backgrounds, text blocks |
| Contained | `1px solid #5e5e5e` | Standard cards, section dividers |
| Green accent | `2px solid #76b900` | Active states, CTA buttons |
| Elevated | `rgba(0,0,0,0.3) 0 0 5px` | Floating cards, modals |

---

## 7. Do's and Don'ts

**Do:**
- Use `#76b900` as borders, underlines, and highlights — never as large fills
- Keep button fill transparent on dark; border provides the signal
- Use uppercase + bold for all navigation labels
- Alternate dark/light sections for rhythm
- Keep border-radius at 2px throughout — sharpness = precision

**Don't:**
- Fill large areas with green — it loses its signal value
- Use rounded corners (8px+) — breaks the engineering aesthetic
- Use weight 400 for navigation or CTAs
- Use the green on colored backgrounds — only on black or white

---

## 8. Responsive

| Breakpoint | Width | Changes |
|-----------|-------|---------|
| Mobile | <768px | Single column, hero 1.8rem, section padding 40px |
| Tablet | 768–1024px | 2-column grids, nav condensed |
| Desktop | 1024px+ | Full 3-column grids, sticky nav |

---

## 9. Quick Reference (for AI agents)

```
Background dark:    #000000
Background light:   #ffffff
Card dark:          #1a1a1a
Accent green:       #76b900
Text (dark bg):     #ffffff
Text (light bg):    #000000
Muted text:         #a7a7a7
Border:             1px solid #5e5e5e
Accent border:      2px solid #76b900
Border-radius:      2px (everywhere)
Font heading:       Inter 700
Font body:          Inter 400
Font nav:           Inter 700 uppercase 14px
```

### Hero (dark)
```
background: #000000
heading: Inter 40px weight 700 line-height 1.2 color #ffffff
subheading: Inter 20px weight 400 color #a7a7a7
CTA: transparent bg, 2px solid #76b900 border, 2px radius, #ffffff text, hover: bg #76b900 text #000000
```

---

---

# Future Demo Branches

## demo/biology-lab — Notion-inspired

**Theme:** Warm minimalism. Quality paper. Natural science.  
**Source:** `awesome-design-md/design-md/notion/DESIGN.md`

### Color Summary
```
Background:     #ffffff (white)
Alt Background: #f6f5f4 (warm white, yellow undertone)
Heading text:   rgba(0,0,0,0.95) (near-black)
Body text:      rgba(0,0,0,0.95)
Muted text:     #615d59 (warm gray)
Placeholder:    #a39e98
CTA accent:     #0075de (Notion blue → swap for a warm botanical green: #2d6a4f)
Border:         1px solid rgba(0,0,0,0.1) (whisper-thin)
Border-radius:  12px (cards), 4px (buttons)
```

**Key direction:** Replace Notion's blue CTA with a botanical green (`#2d6a4f`) for biology context. Warm serif headings (use `Lora` or `Playfair Display` for H1s, Inter for body). Card shadows use multi-layer soft elevation. White alternating with `#f6f5f4` warm-white sections. No dark mode.

**Fonts:** `Lora` (headings, weight 700), `Inter` (body/UI)  
**Buttons:** Botanical green fill, white text, 4px radius, friendly and clear  
**Border-radius:** 12px cards, 4px buttons — inviting, not clinical

---

## demo/cs-lab — VoltAgent-inspired

**Theme:** Terminal-native. Dark canvas. Electric green. Code as hero.  
**Source:** `awesome-design-md/design-md/voltagent/DESIGN.md`

### Color Summary
```
Background:       #050507 (abyss black)
Card surface:     #101010 (carbon)
Border:           1px solid #3d3a39 (warm charcoal)
Accent:           #00d992 (emerald signal green)
Button text:      #2fd6a1 (volt mint)
Primary text:     #f2f2f2 (snow white)
Secondary text:   #b8b3b0 (warm parchment)
Muted text:       #8b949e (steel slate)
Border-radius:    6px (buttons), 8px (cards), 4px (code blocks)
```

**Key direction:** Code snippets as primary visual content. Monospace font (`JetBrains Mono`) throughout code blocks and technical labels. The hero leads with a research-specific "command" (e.g., a publication DOI or research command). Navigation links glow to emerald on hover. Member cards use terminal-card style with warm charcoal borders.

**Fonts:** `system-ui` (headings, native authority), `Inter` (body), `JetBrains Mono` (code/technical labels)  
**Buttons:** Carbon surface background, Volt Mint text, warm charcoal border  
**Accent:** Emerald `#00d992` — borders on active/highlighted cards, hover glow on nav links

---
