# Design System: Eucalyptus Sage & Terracotta

This repository follows a customized **Eucalyptus Sage & Terracotta** design system. Any coding agents modifying, refactoring, or adding UI screens must adhere strictly to these conventions.

---

## 🎨 Color Palette & Themes

The design supports a high-contrast warm sage light mode by default and a rich forest dark mode via the `.dark` class selector. Avoid standard glowing cyber-glows or cosmic dark backdrops. Under no circumstances should pure white (`#ffffff` or equivalent) or generic gray/slate borders be used for content-bearing components.

### 1. Eucalyptus Light Mode (Default)
- **Body Background**: `#f4f6f3` (Eucalyptus Sage)
- **Card Backgrounds (`.paper-sheet`)**: `#f5e4da` (Distinct warm clay / terracotta-cream, completely non-white)
- **Input Fields, Selects & Textareas**: `#eedcd2` (Slightly deeper tinted clay, providing clear contrast against cards)
- **Borders / Separators**: `#d5dbd7` (Moss Gray Line)
- **Primary Text**: `#1a2620` (Forest Charcoal)
- **Muted Text**: `#607267` (Slate Moss)
- **Accents**: Burnt Terracotta (`#c2410c`), Sage Green (`#15803d`)

### 2. Forest Dark Mode (via `.dark` class)
- **Body Background**: `#101412` (Eucalyptus Dark Shade)
- **Card Backgrounds (`.paper-sheet`)**: `#141a17` (Rich pine green-black)
- **Input Fields, Selects & Textareas**: `#151c19` (Deeper pine shade)
- **Borders / Separators**: `#222b27` (Forest Pine Line)
- **Primary Text**: `#e5eae6` (Eucalyptus Light Shade)
- **Muted Text**: `#7fa08d` (Cool Mint Slate)
- **Accents**: Warm Gold-Orange (`#e8a382`), Bright Mint (`#34d399`)

---

## ✍️ Typography

Always use the designated fonts for their specific semantic purposes:
- **Headings / Hero statements**: `font-serif` (**Fraunces**, italicized details). Example:
  ```html
  <h1 className="font-serif text-3xl font-light text-[#1a2620] dark:text-[#e5eae6]">
      Explore the <span className="italic font-normal">analysis ledger</span>
  </h1>
  ```
- **Technical / Labels / Actions**: `font-mono` (**Space Mono**). Example:
  ```html
  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#607267] dark:text-[#7fa08d]">
      Status Code: 200
  </span>
  ```
- **Body copy**: `font-sans` (**Outfit**).

---

## 📐 Layout & Components

Avoid diffuse drop-shadows or floating border glows. Elements are structured using physical border lines and flat tactile elevations:

### 1. Editorial Grid
The layout grid uses fine lines to replicate newspaper partitions:
```html
<div className="editorial-grid min-h-[calc(100vh-5rem)] border-b border-[#d5dbd7] dark:border-[#222b27]">
    {/* Page content */}
</div>
```

### 2. Paper Sheets
Cards and boxes should be styled as physical paper sheets with a flat, dark drop shadow that translates on interactive state changes:
- CSS class utility: `.paper-sheet`
- Example markup:
  ```html
  <section className="paper-sheet p-6 dark:bg-[#141a17]">
      {/* Content */}
  </section>
  ```
- Hover effects must translate slightly (`-1px, -1px`) and increase the solid flat shadow from `4px` to `6px`.

### 3. Tactile Buttons
Buttons must transition through solid boundary movements rather than opacity modifications or glows:
- **Primary**: `.btn-editorial-primary`
  - Moves `1px` on active depress state (`translate(1px, 1px)`)
- **Secondary**: `.btn-editorial-secondary`
- Example markup:
  ```html
  <button className="btn-editorial-primary px-6 py-2.5 font-mono text-xs uppercase tracking-wider">
      Process Output
  </button>
  ```

### 4. Transcripts & Dialogues
Do not use standard speech bubble UI. Align conversation logs vertically as a dialog ledger:
- Each turn is preceded by a monospace identifier (`[USER]`, `[ASSISTANT]`) indicating the participant role.
- Turns are separated by thin `#d5dbd7` (or `#222b27` in dark mode) borders.

---

## 🔒 Security & Compliance Guidelines

- **Internationalization (i18n)**: All UI strings presented to the user must support localized translations. When refactoring or introducing new text segments, ensure they are dynamically loaded from translation dictionaries or wrapped in helper components. Avoid hardcoding English strings directly into the JSX nodes.
