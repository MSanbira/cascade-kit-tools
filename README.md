# cascade-kit-tools

CSS cascade tools for React—layout utilities, mixin system, scoped styles, and className helper.

## Installation

```bash
npm install cascade-kit-tools
```

## Tools

### classNames

Helper for building class strings with conditionals.

```tsx
import { classNames } from 'cascade-kit-tools/classNames';

// Basic usage
classNames('Button--root', ['Button--primary', 'Button--lg']);
// => "Button--root Button--primary Button--lg"

// With conditionals
classNames('Card--root', ['Card--elevated'], { 'Card--active': isActive });
// => "Card--root Card--elevated Card--active" (if isActive is true)
```

---

### mixin

Responsive spacing and layout props that generate CSS classes + variables.

```tsx
import { getMixin } from 'cascade-kit-tools/mixin';
import 'cascade-kit-tools/mixin/styles'; // Required CSS

const { className, style } = getMixin({ 
  p: 2, 
  mt: 4,
  smallScreen: { p: 1 }
});

<div className={className} style={style}>...</div>
```

**Available props:** `m`, `mt`, `mr`, `mb`, `ml`, `mx`, `my`, `p`, `pt`, `pr`, `pb`, `pl`, `px`, `py`, `display`, `opacity`, `position`, `inset`, `top`, `right`, `bottom`, `left`, `flexDirection`, `flexWrap`, `alignItems`, `justifyContent`, `gap`, `gridColTemplate`, `gridRowTemplate`, `gridColumn`, `gridRow`

**Breakpoints:** `smallScreen`, `mediumScreen`, `bigScreen`, `smallContainer`, `mediumContainer`, `bigContainer`

---

### scopedStyle

Inline scoped styles with CSS cascade layer support.

```tsx
import { ScopedStyle } from 'cascade-kit-tools/scopedStyle';

<button className="Button--root">
  <ScopedStyle 
    style={{ 
      backgroundColor: 'red',
      ':hover': { backgroundColor: 'darkred' }
    }} 
    layer="component-overrides" 
  />
  Click me
</button>
```

**Layers:** `base`, `utils`, `components`, `pages`, `component-overrides`, `user-overrides`

---

### layoutUtils

CSS utility classes for flex/grid layouts.

```tsx
import 'cascade-kit-tools/layoutUtils/styles';

<div className="d-flex dir-col gap-2 ali-center">
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

## CSS Variables Required

The tools expect these CSS variables to be defined in your app:

```css
:root {
  --base-size: clamp(8px, 0.5vw, 12px);
  --space-0_5: calc(var(--base-size) * 0.5);
  --space-1: calc(var(--base-size) * 1);
  --space-2: calc(var(--base-size) * 2);
  /* ... etc */
}
```

## Cascade Layers

For proper cascade control, declare layers in your app:

```css
@layer base, utils, components, pages, component-overrides, user-overrides;
```

## License

MIT
