# Design System - Single Source of Truth

All design tokens are defined in `app/globals.css` using CSS variables. This file serves as the **single source of truth** for the entire design system.

## 🎨 Color System

All colors are defined using OKLCH color space for perceptually uniform color manipulation.

**Inspired by Osmo Supply's bold, minimal aesthetic** - Pure neutral blacks with vibrant orange accents.

### Base Colors
```css
--color-background      /* Main background - near black */
--color-foreground      /* Main text - off white */
--color-card            /* Card backgrounds - slightly lighter than bg */
--color-card-foreground /* Card text */
```

### Accent & Primary
```css
--color-primary            /* Osmo Supply orange accent (#FF4C24) */
--color-primary-foreground /* Text on primary (black) */
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

## 📊 Customization Workflow

1. Open `app/globals.css`
2. Find the relevant CSS variable
3. Modify the value
4. Changes propagate throughout the entire app
5. No need to touch individual components

This ensures consistency and makes global design changes trivial.
