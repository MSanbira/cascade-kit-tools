# CascadeKit AI Prompt Guide

Use this guide as context when prompting an AI to build a React application following CascadeKit principles.

---

## Core Principle 1: Layered Cascade

All styles in explicit layers:

```css
@layer base, utils, components, pages, component-overrides, user-overrides;
```

**Layer order reasoning:**
- **base** — Design tokens, resets, root variables
- **utils** — Reusable layout utilities (d-flex, col-container, gap-*)
- **components** — Component base styles + variants
- **pages** — Page-specific compositions
- **component-overrides** — Modifiers, sizes, states, mixins
- **user-overrides** — Consumer customizations (always wins)

---

## Core Principle 2: No Inline Styles

Styles via classes, never inline `style` for layout/theming. Inline breaks cascade control.

CSS variables in `style` are OK—they're inputs to class rules, not rules themselves.

---

## Core Principle 3: Naming Convention

Single `--` delimiter: `.ComponentName--root`, `.ComponentName--variant`, `.ComponentName--element`

```
.Button--root        ← Base element
.Button--primary     ← Variant
.Button--sm          ← Size modifier
.Button--icon        ← Child element
```

---

## Core Principle 4: Co-located Component CSS

```
/Button
  Button.tsx  ← imports Button.css
  Button.css  ← @layer components { }
  index.ts
```

**Benefits:** Discoverability, deletability, tree-shaking (unused components = unused CSS).

---

## Core Principle 5: Token-Driven Values

All values derive from `--base-size`:

```css
--base-size: clamp(8px, .5vw, 12px);
--space-2: calc(var(--base-size) * 2);
```

---

## Project Structure

```
src/
├── styles/
│   ├── layers.css        ← Import FIRST (establishes layer order)
│   ├── base.css          ← @layer base { :root variables }
│   ├── reset.css         ← @layer base { CSS reset }
│   └── theme.css         ← @layer user-overrides { theme variants }
├── components/
│   └── Button/
│       ├── Button.tsx    ← Imports Button.css
│       └── Button.css    ← @layer components { }
├── pages/
│   └── Home/
│       ├── HomePage.tsx  ← Imports HomePage.css
│       └── HomePage.css  ← @layer pages { }
└── App.tsx               ← Import order: layers → base → utils → components
```

---

## Base Tokens Pattern

All values derive from `--base-size`. This creates a proportional, responsive system:

```css
@layer base {
  :root {
    /* Single source of truth */
    --base-size: clamp(8px, 0.5vw, 12px);
    
    /* Spacing scale (multiply base-size) */
    --space-0_5: calc(var(--base-size) * 0.5);
    --space-1: var(--base-size);
    --space-2: calc(var(--base-size) * 2);
    --space-3: calc(var(--base-size) * 3);
    --space-4: calc(var(--base-size) * 4);
    /* ... continue scale as needed */
    
    /* Typography scale */
    --text-1_5: calc(var(--base-size) * 1.5);
    --text-2: calc(var(--base-size) * 2);
    --text-3: calc(var(--base-size) * 3);
    --text-4: calc(var(--base-size) * 4);
    
    /* Border radius */
    --radius-sm: calc(var(--base-size) * 0.5);
    --radius-md: var(--base-size);
    --radius-lg: calc(var(--base-size) * 1.5);
    --radius-full: 100vmax;
    
    /* Colors - define semantic tokens */
    --color-bg: #ffffff;
    --color-surface: #ffffff;
    --color-text: #212529;
    --color-text-muted: #6c757d;
    --color-border: #dee2e6;
    --color-primary: #6366f1;
    --color-primary-hover: #4f46e5;
    --color-primary-subtle: #eef2ff;
    --color-success: #10b981;
    --color-warning: #f59e0b;
    --color-error: #ef4444;
    
    /* Transitions */
    --transition-fast: 150ms ease;
    --transition-base: 200ms ease;
    
    /* Font stacks */
    --font-sans: system-ui, -apple-system, sans-serif;
    --font-mono: 'SF Mono', Consolas, monospace;
  }
  
  /* Dark mode via media query */
  @media (prefers-color-scheme: dark) {
    :root {
      --color-bg: #0f172a;
      --color-surface: #1e293b;
      --color-text: #f1f5f9;
      --color-text-muted: #94a3b8;
      --color-border: #334155;
      --color-primary: #818cf8;
      --color-primary-hover: #a5b4fc;
      --color-primary-subtle: #1e1b4b;
    }
  }
}
```

---

## Component Pattern

### Component TSX Structure

```tsx
import { classNames } from 'cascade-kit-tools/classNames';
import { getMixin, type MixinProps } from 'cascade-kit-tools/mixin';
import './Button.css';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  mixin?: MixinProps;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  mixin,
  children,
  ...props 
}: ButtonProps) {
  const { className: mixinClassName, style: mixinStyle } = getMixin(mixin);
  
  return (
    <button 
      className={classNames('Button--root', [
        `Button--${variant}`,
        `Button--${size}`,
        mixinClassName,
        className
      ])}
      style={mixinStyle}
      {...props}
    >
      {children}
    </button>
  );
}
```

### Component CSS Structure

**Key principle:** Base styles use CSS variables with fallbacks. Variants only set variable values.

```css
@layer components {
  /* Base styles - define behavior using variables with fallbacks */
  .Button--root {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-1);
    padding: var(--button-padding-block, var(--space-2)) var(--button-padding-inline, var(--space-4));
    border: 1px solid var(--button-border-color, transparent);
    border-radius: var(--radius-md);
    font-size: var(--button-font-size, var(--text-2));
    font-weight: 500;
    background: var(--button-bg, var(--color-primary));
    color: var(--button-color, white);
    cursor: pointer;
    transition: background var(--transition-fast), border-color var(--transition-fast);
  }
  
  .Button--root:hover {
    background: var(--button-bg-hover, var(--button-bg));
  }
  
  /* Variants - ONLY set variable values, never repeat properties */
  .Button--primary {
    --button-bg: var(--color-primary);
    --button-bg-hover: var(--color-primary-hover);
    --button-color: white;
  }
  
  .Button--secondary {
    --button-bg: transparent;
    --button-bg-hover: var(--color-bg-muted);
    --button-color: var(--color-text);
    --button-border-color: var(--color-border);
  }
  
  .Button--ghost {
    --button-bg: transparent;
    --button-bg-hover: var(--color-bg-muted);
    --button-color: var(--color-text);
  }
}

/* Sizes and states in higher-priority layer */
@layer component-overrides {
  .Button--sm {
    --button-padding-block: var(--space-1);
    --button-padding-inline: var(--space-2);
    --button-font-size: var(--text-1_75);
  }
  
  .Button--lg {
    --button-padding-block: var(--space-3);
    --button-padding-inline: var(--space-6);
    --button-font-size: var(--text-2_25);
  }
  
  .Button--root:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .Button--root:disabled:hover {
    background: var(--button-bg);
  }
}
```

### Simple Component Example (Badge)

Not every component needs sizes, states, or scopedStyle. Here's a minimal component:

**Badge.tsx:**
```tsx
import { classNames } from 'cascade-kit-tools/classNames';
import { getMixin, type MixinProps } from 'cascade-kit-tools/mixin';
import './Badge.css';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: BadgeVariant;
  mixin?: MixinProps;
}

export function Badge({ children, className = '', variant = 'primary', mixin }: BadgeProps) {
  const { className: mixinClassName, style: mixinStyle } = getMixin(mixin);
  
  return (
    <span 
      className={classNames('Badge--root', [`Badge--${variant}`, mixinClassName, className])} 
      style={mixinStyle}
    >
      {children}
    </span>
  );
}
```

**Badge.css:**
```css
@layer components {
  .Badge--root {
    display: inline-block;
    padding-block: var(--space-1);
    padding-inline: var(--space-3);
    border-radius: var(--radius-full);
    font-weight: var(--font-weight-medium);
    font-size: var(--text-1_75);
    background-color: var(--badge-bg, var(--color-primary-subtle));
    color: var(--badge-color, var(--color-primary));
  }

  .Badge--secondary {
    --badge-bg: var(--color-bg-muted);
    --badge-color: var(--color-text-muted);
  }

  .Badge--success {
    --badge-bg: color-mix(in srgb, var(--color-success) 15%, transparent);
    --badge-color: var(--color-success);
  }

  .Badge--warning {
    --badge-bg: color-mix(in srgb, var(--color-warning) 15%, transparent);
    --badge-color: var(--color-warning);
  }

  .Badge--error {
    --badge-bg: color-mix(in srgb, var(--color-error) 15%, transparent);
    --badge-color: var(--color-error);
  }
}
```

**Key points:**
- No `scopedStyle` — simple components inherit from parent or use variants
- `mixin` support for spacing adjustments (e.g., `<Badge mixin={{ ml: 1 }}>`)
- Variants only set CSS variables, never repeat properties
- All in `@layer components` — no overrides layer needed for this simple component

---

## Page Pattern

Pages compose components and add page-specific styles:

### Page TSX

```tsx
import { Section } from '../../components/Section/Section';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Text } from '../../components/Text/Text';
import { Box } from '../../components/Box/Box';
import './HomePage.css';

export function HomePage() {
  return (
    <div className="HomePage--root">
      <Section>
        <Text variant="h1">Welcome</Text>
        <Text>Page introduction text.</Text>
      </Section>
      
      <Section>
        <Box className="d-grid" mixin={{ 
          gap: 4, 
          smallScreen: { gridColTemplate: '1fr' },
          bigScreen: { gridColTemplate: '1fr 1fr 1fr' }
        }}>
          <Card title="Feature 1">
            <Text variant="body2" muted>Description</Text>
            <Button variant="primary" size="sm" mixin={{ mt: 2 }}>Action</Button>
          </Card>
          {/* More cards... */}
        </Box>
      </Section>
    </div>
  );
}
```

### Page CSS

```css
@layer pages {
  .HomePage--root {
    /* Page-level layout */
  }
  
  /* Page-specific element styles */
  .HomePage--hero {
    padding: var(--space-10) var(--space-4);
    background: linear-gradient(135deg, var(--color-primary-subtle), var(--color-bg));
    text-align: center;
  }
  
  /* Override component styles for this page context */
  .HomePage--root .Card--root {
    border-color: var(--color-primary);
  }
}
```

---

## System Tools (npm: cascade-kit-tools)

### `classNames` Helper

Joins classes and handles conditionals.

**When to use:** Every component that builds className strings. Enforces naming convention.

```tsx
import { classNames } from 'cascade-kit-tools/classNames';

classNames('Button--root', [`Button--${variant}`, className])
// => "Button--root Button--primary custom-class"

// With conditionals
classNames('Card--root', ['Card--elevated'], { 
  'Card--active': isActive,
  'Card--disabled': isDisabled 
});
```

---

### `mixin` Prop

Layout adjustments without inline styles. Generates classes in `component-overrides` layer.

**When to use:**
- Properties need to change at breakpoints (responsive)
- Container query support needed
- Spacing/opacity/display varies by screen size
- Dynamic layout that can't be predetermined

**Why not inline styles?** Inline styles bypass the cascade — `user-overrides` can't override them. Mixin uses CSS variables + classes in `component-overrides` layer, preserving cascade control.

```tsx
import { getMixin, type MixinProps } from 'cascade-kit-tools/mixin';
import 'cascade-kit-tools/mixin/mixin.css'; // Required CSS

<Card mixin={{ p: 2, mt: 4 }}>

// Responsive
<Box mixin={{ 
  p: 2,
  smallScreen: { p: 1, flexDirection: 'column' },
  bigScreen: { p: 4, flexDirection: 'row' }
}}>
```

**Props:** `m`, `mt`, `mr`, `mb`, `ml`, `mx`, `my`, `p`, `pt`, `pr`, `pb`, `pl`, `px`, `py`, `display`, `opacity`, `position`, `inset`, `top`, `right`, `bottom`, `left`, `flexDirection`, `flexWrap`, `alignItems`, `justifyContent`, `gap`, `gridColTemplate`, `gridRowTemplate`, `gridColumn`, `gridRow`

**Breakpoints:** `smallScreen`, `mediumScreen`, `bigScreen`, `smallContainer`, `mediumContainer`, `bigContainer`

---

## ScopedStyle — Instance-Level Style Customization

`ScopedStyle` provides per-instance style overrides using native CSS `@scope`. It renders a `<style>` tag inside the component that scopes styles to that specific instance.

### How It Works

```tsx
<ScopedStyle style={scopedStyle} layer={scopedLayer} />
```

Outputs:
```html
<style>
  @layer component-overrides {
    @scope {
      :scope {
        --color-primary: #10b981;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        .Card--title { color: #000; }
      }
    }
  }
</style>
```

### ScopedStylesObj Type

The `style` prop accepts an object that can contain:
- **CSS custom properties**: `'--color-primary': '#10b981'`
- **CSS properties** (camelCase): `boxShadow: '...'`, `transform: '...'`
- **Nested selectors**: `'.Card--title': { color: '#000' }`

```ts
type ScopedStylesObj = CSSProperties & CSSVars & { [selector: string]: ScopedStylesObj };
```

### Layer Control

The `layer` prop controls CSS specificity (default: `'component-overrides'`):
- `'base'` | `'utils'` | `'components'` | `'pages'` | `'component-overrides'` | `'user-overrides'`

### Which Components Should Support ScopedStyle

**NOT every component needs `scopedStyle`.** Only add it to:
- **Containers**: Card, Box, Modal, Panel, Section
- **Dynamic/themed components**: Components likely to need per-instance customization

**DO NOT add to primitives** like Button, Badge, Text — use variants instead.

### Component Implementation Pattern

```tsx
import { ScopedStyle, type ScopedStylesObj, type LayerOptions } from 'cascade-kit-tools/scopedStyle';

interface CardProps {
  children: React.ReactNode;
  mixin?: MixinProps;
  scopedStyle?: ScopedStylesObj;
  scopedLayer?: LayerOptions;
}

export function Card({ children, mixin, scopedStyle, scopedLayer }: CardProps) {
  const { className: mixinClassName, style: mixinStyle } = getMixin(mixin);
  
  return (
    <div className={classNames('Card--root', [mixinClassName])} style={mixinStyle}>
      <ScopedStyle style={scopedStyle} layer={scopedLayer} />
      {children}
    </div>
  );
}
```

### Usage Examples

```tsx
// Token overrides — children inherit these
<Card scopedStyle={{ 
  '--color-primary': '#10b981',
  '--color-border': '#10b981',
}}>
  <Button variant="primary">Inherits green</Button>
</Card>

// Direct CSS properties
<Card scopedStyle={{
  boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
  background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
}}>
  Content
</Card>

// Nested selectors (scoped to this instance)
<Card scopedStyle={{
  '.Card--title': { color: '#000', fontWeight: 700 },
}}>
  Content
</Card>

// Combined
<Card scopedStyle={{
  '--color-primary': '#f59e0b',
  borderStyle: 'dashed',
  '.Card--title': { textTransform: 'uppercase' }
}} scopedLayer="user-overrides">
  Content
</Card>

// Dynamic values from state/props
const [progress, setProgress] = useState(65);
const [themeColor, setThemeColor] = useState('#6366f1');

<Card scopedStyle={{
  '--progress': `${progress}%`,
  '--color-primary': themeColor,
  '--color-border': themeColor,
}}>
  <ProgressBar />  {/* Uses var(--progress) in its CSS */}
  <Button variant="primary">Themed to {themeColor}</Button>
</Card>

// Conditional styling
<Card scopedStyle={{
  '--color-primary': isError ? 'var(--color-error)' : 'var(--color-success)',
  opacity: isLoading ? 0.6 : 1,
  pointerEvents: isLoading ? 'none' : 'auto',
}}>
  <StatusContent />
</Card>
```

### ScopedStyle vs Inline Styles

Never use inline `style` prop for customization. Use `scopedStyle` instead:

```tsx
// ❌ WRONG — no layer control, breaks cascade
<div style={{ boxShadow: '...' }} />

// ✅ CORRECT — respects layers, supports nesting
<Card scopedStyle={{ boxShadow: '...' }} />
```

The only acceptable use of the `style` attribute is for mixin-generated CSS variables via `getMixin()`.

---

### Layout Utils CSS

Composable utilities using `:where()` for low specificity.

**When to use:**
- Layout structure is **static** (always flex, always 3 columns)
- Quick, composable layout classes
- Gap and alignment **don't need to change responsively**

**When to use mixin instead:** When properties need to change at breakpoints or with container queries.

**Combine both:** Use utility classes for base layout, mixin for responsive overrides.

```tsx
import 'cascade-kit-tools/layoutUtils/layoutUtils.css';

<div className="d-flex dir-col gap-2 ali-center">
<div className="col-container col-num-3 gap-4">

// Combined: static layout + responsive override
<Box 
  className="col-container col-num-2 gap-3"
  mixin={{ smallScreen: { gridColTemplate: '1fr' } }}
>
```

**Classes:**
- `d-flex`, `dir-col`, `f-wrap`, `min-0`
- `col-container`, `col-num-2`, `col-num-3`, `col-num-4`, `col-num-auto`
- `ali-start`, `ali-center`, `ali-end`, `ali-baseline`, `ali-stretch`
- `jc-start`, `jc-center`, `jc-end`, `jc-sb`, `jc-se`
- `gap-0_5`, `gap-1`, `gap-2`, `gap-3`, `gap-4`, `gap-5`, `gap-6`, `gap-8`, `gap-10`, `no-gap`

---

## Key Rules

- All styles in `@layer` (unlayered beats all)
- Classes for styling (inline breaks cascade)
- Import CSS in component (tree-shaking)
- Derive from `--base-size` (single source of truth)
- Variants set variables only (never repeat properties)

---

## App Entry Point Example

```tsx
// App.tsx - Import order matters!
import './styles/layers.css';           // FIRST - establishes layer order
import './styles/base.css';             // Design tokens
import './styles/reset.css';            // CSS reset
import 'cascade-kit-tools/layoutUtils/layoutUtils.css';  // Layout utilities
import 'cascade-kit-tools/mixin/mixin.css';              // Mixin styles
import './styles/theme.css';            // Theme overrides (optional)

// Components and pages...
```

---

## General Suggestions for Initial App Build

- **Create small, reusable components** — Keep page-level styling to a minimum. Pages should compose components, not define new styles.
- **Keep App.tsx minimal** — Only CSS imports and top-level routing. Better separation of concerns.
- **Reach for cascade-kit-tools first** — Before adding new class names, check if `mixin`, `layoutUtils`, or `scopedStyle` already solves the problem. Avoid bloating stylesheets with one-off classes.

---

## Quick Start Checklist

1. ☐ Create `layers.css` with layer order declaration
2. ☐ Create `base.css` with `--base-size` and token scale
3. ☐ Install `cascade-kit-tools` from npm
4. ☐ Import CSS in correct order in App entry
5. ☐ Create first component following the pattern
6. ☐ Use `classNames` for class composition
7. ☐ Use `getMixin` for responsive spacing props
8. ☐ Use layout utils classes for flex/grid layouts
9. ☐ Use `scopedStyle` for per-instance customizations and dynamic values

