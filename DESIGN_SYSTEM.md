# Damiønmusic design system

This is the foundation for the phased redesign. The existing logo in `assets/logo.svg` and the black/red identity remain unchanged.

## Brand direction

- Feel like an independent producer's studio: direct, musical, personal and capable.
- Prefer editorial composition, real work and useful explanations over decorative cards.
- Use red as an action and emphasis color, not as a glow applied to every surface.
- Avoid fake statistics, fake testimonials, generic creator slogans and artificial urgency.
- Use the written brand name consistently as **Damiønmusic**. The logo artwork must not be redrawn.

## Color roles

- Main background: `--dm-bg`
- Secondary background: `--dm-bg-secondary`
- Standard surface: `--dm-surface`
- Raised/interactive surface: `--dm-surface-raised`
- Default and strong borders: `--dm-border`, `--dm-border-strong`
- Primary action: `--dm-accent`
- Hover/active actions: `--dm-accent-hover`, `--dm-accent-active`
- Primary, muted and subtle copy: `--dm-text`, `--dm-text-muted`, `--dm-text-subtle`
- Status colors: `--dm-success`, `--dm-warning`, `--dm-error`

The accent must maintain readable contrast. Do not place normal-sized red text on black unless the chosen shade passes contrast checks.

## Typography

- Display: the narrow system display stack in `--dm-font-display`.
- Body/UI: the native system stack in `--dm-font-body` for speed and readability.
- Maximum of two visual type families.
- Hero copy uses `--dm-heading-lg`; section headings use `--dm-heading-md`; component headings use `--dm-heading-sm`.
- Body text normally stays between 16px and 18px with a 1.65 line height.
- Do not make every heading oversized or use uppercase for sentences.

## Spacing and layout

- All spacing comes from the 4px token scale.
- Standard content uses `.dm-container`; long-form copy uses `.dm-reading-width`.
- Section spacing uses `.dm-section` and may be reduced only for intentional paired sections.
- Components must not introduce unexplained one-off spacing values.
- Touch targets must be at least `--dm-touch-target` (44px).

## Shape and depth

- Small controls: `--dm-radius-sm`.
- Inputs and standard cards: `--dm-radius-md`.
- Large media or featured panels: `--dm-radius-lg`.
- Pills only for tags, filters and compact status labels.
- Shadows indicate elevation or interaction; they are not ambient decoration.
- Blur and glass effects are exceptional, not the default surface treatment.

## Motion

- Fast (`150ms`): press feedback, switches, tiny status changes.
- Normal (`280ms`): buttons, menus, accordions, chat and card hover.
- Slow (`620ms`): internal image zoom and large reveals.
- Default easing: `cubic-bezier(0.22, 1, 0.36, 1)`.
- Animate transforms and opacity. Avoid layout-changing width, height, top and left animations.
- Hover movement stays subtle: roughly 1.01–1.03 scale and 2–4px upward translation.
- Essential actions cannot depend on hover.
- `prefers-reduced-motion` reduces all non-essential animation to an effectively instant state.

## Icons and media

- Use one consistent outlined SVG icon style with rounded line caps.
- Do not use platform-dependent emoji as primary interface icons.
- Images stay inside fixed aspect-ratio containers; hover zoom affects the image, not layout.
- Do not fabricate producer portraits, client artwork, reviews or music examples.

## Accessibility baseline

- Every interactive element receives a visible focus state.
- Form fields have persistent labels; placeholders are hints, never labels.
- Modals require dialog semantics, focus trapping, Escape handling and focus restoration.
- Status changes use appropriate live regions without announcing decorative updates.
- Color is never the only way to communicate an error, success or selection.

## Architecture rule

`design-system.css` contains tokens and low-level primitives only. Shared UI belongs in `components.css`; page composition belongs in page-level styles. Do not add another versioned patch stylesheet to override earlier patches.

