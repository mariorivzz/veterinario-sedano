---
applyTo: "**/*.css,**/*.astro"
description: "Use when writing or editing CSS styles. Covers the project's green veterinary theme, responsive design patterns, and CSS conventions."
---

# CSS & Styling Guidelines

## Theme
- Primary color: `#2d6a4f` (dark green)
- Primary hover: `#1b4332`
- Background: `#f8f9fa`
- Font: `system-ui, -apple-system, sans-serif`

## Conventions
- Use vanilla CSS — no Tailwind, SASS, or CSS-in-JS
- Global styles go in `src/styles/global.css`
- Component-scoped styles use `<style>` tags inside `.astro` files (automatically scoped)
- Use CSS custom properties for reusable values
- Mobile-first responsive design with `min-width` media queries

## Responsive Breakpoints
```css
/* Tablet */
@media (min-width: 768px) { }

/* Desktop */
@media (min-width: 1024px) { }
```

## Common Patterns
- `.container` — max-width centered content
- Grid layouts: `display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))`
- Card hover effects: `transform: translateY(-5px)` with `transition: transform 0.3s`
