# Design System - Single Source of Truth

All design tokens are defined in `app/globals.css` using CSS variables. This file serves as the **single source of truth** for the entire design system.

## 🎨 Color System

All colors are defined using OKLCH color space for perceptually uniform color manipulation.

### Base Colors
```css
--color-background      /* Main background - near black */
--color-foreground      /* Main text - off white */
--color-card            /* Card backgrounds - slightly lighter than bg */
--color-card-foreground /* Card text */
```

### Accent & Primary
```css
--color-primary            /* Vercel blue accent */
--color-primary-foreground /* Text on primary */
```

### Secondary
```css
--color-secondary            /* Slightly lighter than card */
--color-secondary-foreground /* Text on secondary */
```

### Muted (for de-emphasized content)
```css
--color-muted            /* Muted backgrounds */
--color-muted-foreground /* Muted text - gray */
```

### Interactive States
```css
--color-accent            /* Hover backgrounds */
--color-accent-foreground /* Text on hover */
```

### Destructive (errors, delete actions)
```css
--color-destructive            /* Red for errors */
--color-destructive-foreground /* Text on destructive */
```

### Borders & Inputs
```css
--color-border /* Subtle border color */
--color-input  /* Input field backgrounds */
--color-ring   /* Focus ring color */
```

### Brand Colors (unified)
```css
--color-brand        /* Same as primary */
--color-brand-yellow /* Same as primary */
--color-brand-teal   /* Same as primary */
```

## 📝 Typography System

### Font Families
```css
--font-sans  /* Geist Sans - for body text */
--font-mono  /* Geist Mono - for headlines */
```

### Font Sizes
```css
--font-size-xs   /* 12px - labels, captions */
--font-size-sm   /* 14px - small body text */
--font-size-base /* 16px - default body */
--font-size-lg   /* 18px */
--font-size-xl   /* 20px */
--font-size-2xl  /* 24px */
--font-size-3xl  /* 30px */
--font-size-4xl  /* 36px - h1 */
--font-size-5xl  /* 48px */
--font-size-6xl  /* 60px */
--font-size-7xl  /* 72px */
--font-size-8xl  /* 96px - hero headlines */
```

### Line Heights
```css
--line-height-tight    /* 1.25 - for headlines */
--line-height-snug     /* 1.375 */
--line-height-normal   /* 1.5 - for body */
--line-height-relaxed  /* 1.625 */
--line-height-loose    /* 2 */
```

### Letter Spacing
```css
--letter-spacing-tighter /* -0.05em - tight mono headlines */
--letter-spacing-tight   /* -0.025em - regular headlines */
--letter-spacing-normal  /* 0em */
--letter-spacing-wide    /* 0.025em - labels */
--letter-spacing-wider   /* 0.05em */
```

### Typography Utility Classes

Pre-built classes for common text styles:

```css
.text-display    /* Giant hero headlines (8xl, mono, tight) */
.text-heading-1  /* H1 (4xl, mono, tight) */
.text-heading-2  /* H2 (3xl, mono, snug) */
.text-heading-3  /* H3 (2xl, mono, snug) */
.text-label      /* Labels (xs, mono, uppercase, wide) */
.text-body       /* Body text (base, sans, normal) */
.text-body-sm    /* Small body (sm, sans, normal) */
```

## 📏 Spacing System

Based on 4px/8px grid:

```css
--spacing-0    /* 0px */
--spacing-px   /* 1px */
--spacing-0-5  /* 2px */
--spacing-1    /* 4px */
--spacing-1-5  /* 6px */
--spacing-2    /* 8px */
--spacing-2-5  /* 10px */
--spacing-3    /* 12px */
--spacing-3-5  /* 14px */
--spacing-4    /* 16px */
--spacing-5    /* 20px */
--spacing-6    /* 24px */
--spacing-7    /* 28px */
--spacing-8    /* 32px */
--spacing-9    /* 36px */
--spacing-10   /* 40px */
--spacing-11   /* 44px */
--spacing-12   /* 48px */
--spacing-14   /* 56px */
--spacing-16   /* 64px */
--spacing-20   /* 80px */
--spacing-24   /* 96px */
--spacing-32   /* 128px */
```

## 🔲 Border Radius

```css
--radius      /* 0.5rem (8px) - default */
--radius-sm   /* 6px */
--radius-md   /* 8px (same as default) */
--radius-lg   /* 10px */
--radius-xl   /* 12px */
--radius-full /* 9999px - fully rounded */
```

## 🌓 Shadows

Minimal shadow system (shadows mostly avoided in this design):

```css
--shadow-sm   /* Subtle shadow */
--shadow      /* Default shadow */
--shadow-none /* No shadow */
```

## ⚡ Transitions

```css
--transition-fast /* 150ms - quick interactions */
--transition-base /* 200ms - default */
--transition-slow /* 300ms - complex animations */
```

## 📚 Z-Index Layers

```css
--z-base           /* 0 */
--z-dropdown       /* 1000 */
--z-sticky         /* 1020 */
--z-fixed          /* 1030 */
--z-modal-backdrop /* 1040 */
--z-modal          /* 1050 */
--z-popover        /* 1060 */
--z-tooltip        /* 1070 */
```

## 🛠️ Utility Classes

### Layout
```css
.container-narrow   /* max-width: 48rem */
.container-default  /* max-width: 80rem */
.container-wide     /* max-width: 96rem */
```

### Cards
```css
.card-interactive /* Hover effect on border */
```

### Borders
```css
.border-subtle   /* Subtle border using --color-border */
.border-emphasis /* Emphasized border using --color-foreground */
```

### Icons
```css
.icon-xs /* 12px × 12px */
.icon-sm /* 16px × 16px */
.icon-md /* 20px × 20px */
.icon-lg /* 24px × 24px */
```

## 🎯 Usage Examples

### Changing the Accent Color

To change the entire accent color scheme from blue to another color:

```css
/* In app/globals.css */
--color-primary: oklch(0.55 0.18 150);  /* Change to green */
--color-ring: oklch(0.55 0.18 150);     /* Match focus ring */
--color-brand: oklch(0.55 0.18 150);    /* Match brand color */
```

### Adjusting Typography Scale

To make all text larger:

```css
/* In app/globals.css */
--font-size-base: 1.125rem;  /* 18px instead of 16px */
--font-size-sm: 1rem;        /* 16px instead of 14px */
/* Adjust other sizes proportionally */
```

### Changing Border Radius

To make everything more rounded:

```css
/* In app/globals.css */
--radius: 1rem;  /* 16px instead of 8px */
```

### Switching to Light Mode

To create a light theme variant:

```css
/* In app/globals.css - create a light theme section */
@media (prefers-color-scheme: light) {
  @theme inline {
    --color-background: oklch(0.98 0.005 250);
    --color-foreground: oklch(0.08 0.005 250);
    --color-card: oklch(1 0 0);
    /* etc... */
  }
}
```

## 📋 Design Principles

1. **Single Source of Truth**: All design tokens in `globals.css`
2. **CSS Variables**: Use variables, not hardcoded values
3. **Semantic Naming**: Variables named by purpose, not appearance
4. **Consistent Spacing**: Based on 4px/8px grid
5. **Minimal Shadows**: Prefer borders over shadows
6. **High Contrast**: WCAG AAA compliance
7. **Typography Hierarchy**: Geist Mono for headlines, Geist Sans for body

## 🔄 Migration Guide

When adding new components or updating existing ones:

### ❌ Don't Do This
```jsx
<div className="text-sm text-gray-600 p-4">...</div>
```

### ✅ Do This Instead
```jsx
<div className="text-body-sm text-muted-foreground p-4">...</div>
```

Or use CSS variables directly:
```jsx
<div style={{
  fontSize: 'var(--font-size-sm)',
  color: 'var(--color-muted-foreground)',
  padding: 'var(--spacing-4)'
}}>...</div>
```

## 📊 Customization Workflow

1. Open `app/globals.css`
2. Find the relevant CSS variable
3. Modify the value
4. Changes propagate throughout the entire app
5. No need to touch individual components

This ensures consistency and makes global design changes trivial.
