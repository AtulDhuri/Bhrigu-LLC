# UI Implementation Summary

## Overview
This project uses **custom UI components** built with Tailwind CSS and Angular standalone components.

## What We Have
Custom UI components in `src/app/shared/ui/`:
- Card components
- Button directive with variants
- Input directive
- Label directive

## Why Custom Components?
- **Lightweight**: Only what we need
- **Customizable**: Full control over styling
- **Modern**: Uses latest Angular patterns
- **Tailwind-based**: Consistent design system

## Components Implemented

### 1. Card Components (`src/app/shared/ui/card.component.ts`)
- `HlmCardComponent` (`<hlm-card>`)
- `HlmCardHeaderComponent` (`<hlm-card-header>`)
- `HlmCardTitleComponent` (`<hlm-card-title>`)
- `HlmCardDescriptionComponent` (`<hlm-card-description>`)
- `HlmCardContentComponent` (`<hlm-card-content>`)
- `HlmCardFooterComponent` (`<hlm-card-footer>`)

### 2. Button Directive (`src/app/shared/ui/button.directive.ts`)
- `HlmButtonDirective` (`hlmBtn`)
- Supports variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
- Supports sizes: `default`, `sm`, `lg`, `icon`
- Uses `class-variance-authority` for variant management

### 3. Input Directive (`src/app/shared/ui/input.directive.ts`)
- `HlmInputDirective` (`hlmInput`)
- Applies consistent styling to form inputs

### 4. Label Directive (`src/app/shared/ui/label.directive.ts`)
- `HlmLabelDirective` (`hlmLabel`)
- Applies consistent styling to form labels

## Usage Examples

### Card Usage
```html
<hlm-card>
  <hlm-card-header>
    <hlm-card-title>Card Title</hlm-card-title>
  </hlm-card-header>
  <hlm-card-content>
    <p>Card content goes here</p>
  </hlm-card-content>
</hlm-card>
```

### Button Usage
```html
<!-- Default button -->
<button hlmBtn>Click me</button>

<!-- Outline button -->
<button hlmBtn variant="outline">Cancel</button>

<!-- Large button -->
<button hlmBtn size="lg">Submit</button>
```

### Form Elements Usage
```html
<div>
  <label hlmLabel for="email">Email</label>
  <input hlmInput type="email" id="email" />
</div>
```

## Where It's Used

### Blog Features
- **post-list.component**: Card components for blog posts, button for "Read more" and "Load More"
- **post-detail.component**: Card for post content, button for navigation
- **add-comment.component**: Card wrapper, form inputs/labels, buttons for submit/cancel

### Photo Features
- **album-list.component**: Card components for albums, button for "Load More"
- **album-detail.component**: Button for navigation

### Auth Features
- **login.component**: Card wrapper, form inputs/labels, buttons
- **signup.component**: Card wrapper, form inputs/labels, buttons

## Dependencies
- `class-variance-authority`: For button variant management
- `tailwindcss`: For styling
- `clsx`: For class name utilities (used by CVA)

## Icon Library

### Lucide Angular
We use Lucide Angular for icons:
- `arrow-right` - Navigation arrows
- `book-open` - Reading time indicator
- `camera` - Album/photo representation

See `ICON_STRATEGY.md` for detailed icon documentation.

## Backup
Custom components are backed up in `src/app/shared/ui-backup/` for safety.

## Documentation
See `UI_COMPONENTS.md` for comprehensive documentation of all custom components.
