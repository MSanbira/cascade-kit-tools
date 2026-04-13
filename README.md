# cascade-kit-tools

CSS cascade tools for React—layout utilities, mixin system, scoped styles, and className helper.

Built for the **CascadeKit** methodology: layered cascade control, no inline styles, token-driven design.

## Installation

```bash
npm install cascade-kit-tools
```

---

## Using with AI Tools (Cascade, Cursor, etc.)

This package includes a **`PROMPT_GUIDE.md`** file designed to be used as context when prompting AI assistants to build React applications.

### How to use:

1. Copy the contents of `PROMPT_GUIDE.md` (or reference the file)
2. Paste it into your AI assistant's context/system prompt
3. Ask the AI to build components or pages following CascadeKit principles

### Example prompts:

```
Using the CascadeKit methodology, create a Card component with 
variants: default, elevated, outlined. Include hover states.
```

```
Build a dashboard page with a sidebar navigation and a grid of 
stat cards. Use the mixin system for responsive layout.
```

```
Create a form with Input, Select, and Button components following 
the component pattern. Add proper focus and error states.
```

The guide teaches the AI:
- Layered cascade architecture
- Component CSS patterns (variants via CSS variables)
- When to use mixin vs layoutUtils vs scopedStyle
- Project structure and naming conventions
- Token-driven design with `--base-size`

---

## Quick Setup

### 1. Create your layers file (`styles/layers.css`)

```css
@layer base, utils, components, pages, component-overrides, user-overrides;
```

### 2. Create base tokens (`styles/base.css`)

```css
@layer base {
  :root {
    --base-size: clamp(8px, 0.5vw, 12px);
    
    /* Spacing scale */
    --space-0_5: calc(var(--base-size) * 0.5);
    --space-1: var(--base-size);
    --space-2: calc(var(--base-size) * 2);
    --space-3: calc(var(--base-size) * 3);
    --space-4: calc(var(--base-size) * 4);
    --space-5: calc(var(--base-size) * 5);
    --space-6: calc(var(--base-size) * 6);
    --space-8: calc(var(--base-size) * 8);
    --space-10: calc(var(--base-size) * 10);
    
    /* Colors */
    --color-primary: #6366f1;
    --color-text: #212529;
    --color-bg: #ffffff;
  }
}
```

### 3. Import in your app entry

```tsx
// App.tsx - Import order matters!
import './styles/layers.css';                              // FIRST
import './styles/base.css';                                // Tokens
import 'cascade-kit-tools/layoutUtils/styles';             // Layout utilities
import 'cascade-kit-tools/mixin/styles';                   // Mixin styles
```

---

## Tools

### classNames

Helper for building class strings with conditionals.

```tsx
import { classNames } from 'cascade-kit-tools/classNames';

// Basic usage
classNames('Button--root', ['Button--primary', 'Button--lg']);
// => "Button--root Button--primary Button--lg"

// With conditionals
classNames('Card--root', ['Card--elevated'], { 
  'Card--active': isActive,
  'Card--disabled': isDisabled 
});
```

---

### mixin

Responsive spacing and layout props that generate CSS classes + variables. Lives in `component-overrides` layer, preserving cascade control.

```tsx
import { getMixin, type MixinProps } from 'cascade-kit-tools/mixin';
import 'cascade-kit-tools/mixin/styles';

// Basic usage
const { className, style } = getMixin({ p: 2, mt: 4 });

// Responsive
const { className, style } = getMixin({ 
  p: 2,
  smallScreen: { p: 1, flexDirection: 'column' },
  bigScreen: { p: 4, flexDirection: 'row' }
});

<div className={className} style={style}>...</div>
```

**Props:** `m`, `mt`, `mr`, `mb`, `ml`, `mx`, `my`, `p`, `pt`, `pr`, `pb`, `pl`, `px`, `py`, `display`, `opacity`, `position`, `inset`, `top`, `right`, `bottom`, `left`, `flexDirection`, `flexWrap`, `alignItems`, `justifyContent`, `gap`, `gridColTemplate`, `gridRowTemplate`, `gridColumn`, `gridRow`

**Breakpoints:** `smallScreen`, `mediumScreen`, `bigScreen`, `smallContainer`, `mediumContainer`, `bigContainer`

---

### scopedStyle

Per-instance style overrides using CSS `@scope`. Use for dynamic/user-driven theming.

```tsx
import { ScopedStyle, type ScopedStylesObj } from 'cascade-kit-tools/scopedStyle';

// Inside a component
<div className="Card--root">
  <ScopedStyle 
    style={{ 
      '--color-primary': '#10b981',
      '&:hover': { transform: 'scale(1.02)' }
    }} 
    layer="component-overrides" 
  />
  {children}
</div>
```

**When to use:**
- Backend/user-selected values (brand colors, CMS data)
- One-off customizations that don't fit the design system
- Needs hover/media queries (not possible with inline styles)

**Layers:** `base`, `utils`, `components`, `pages`, `component-overrides`, `user-overrides`

---

### layoutUtils

CSS utility classes for flex/grid layouts. Uses `:where()` for low specificity.

```tsx
import 'cascade-kit-tools/layoutUtils/styles';

<div className="d-flex dir-col gap-2 ali-center">
  ...
</div>

<div className="col-container col-num-3 gap-4">
  ...
</div>
```

**Classes:**
- **Display:** `d-flex`, `d-grid`, `col-container`
- **Flex:** `dir-col`, `f-wrap`, `min-0`
- **Columns:** `col-num-2`, `col-num-3`, `col-num-4`, `col-num-auto`, `with-divider`
- **Align:** `ali-start`, `ali-center`, `ali-end`, `ali-baseline`, `ali-stretch`
- **Justify:** `jc-start`, `jc-center`, `jc-end`, `jc-sb`, `jc-se`
- **Gap:** `gap-0_25`, `gap-0_5`, `gap-1`, `gap-2`, `gap-3`, `gap-4`, `gap-5`, `gap-6`, `gap-7`, `gap-8`, `gap-10`, `no-gap`

---

## License

MIT
