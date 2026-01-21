# UI Components Documentation

## Overview
This project uses **custom UI components** with Tailwind CSS styling. The components follow modern Angular patterns with standalone components and directives.

## Components Location
`src/app/shared/ui/` - Custom UI components
`src/app/shared/ui-backup/` - Backup of custom components

## Custom Components Implemented

### 1. Card Components (`src/app/shared/ui/card.component.ts`)
Reusable card components for content display.

**Components:**
- `HlmCardComponent` (`<hlm-card>`)
- `HlmCardHeaderComponent` (`<hlm-card-header>`)
- `HlmCardTitleComponent` (`<hlm-card-title>`)
- `HlmCardDescriptionComponent` (`<hlm-card-description>`)
- `HlmCardContentComponent` (`<hlm-card-content>`)
- `HlmCardFooterComponent` (`<hlm-card-footer>`)

**Usage:**
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

**Styling:**
- Rounded corners with border
- Shadow for depth
- Responsive padding
- Tailwind CSS classes

---

### 2. Button Directive (`src/app/shared/ui/button.directive.ts`)
Flexible button styling with variants and sizes using class-variance-authority.

**Directive:** `hlmBtn`

**Variants:**
- `default` - Primary button style
- `destructive` - Danger/delete actions
- `outline` - Outlined button
- `secondary` - Secondary actions
- `ghost` - Minimal styling
- `link` - Link-style button

**Sizes:**
- `default` - Standard size (h-9)
- `sm` - Small (h-8)
- `lg` - Large (h-10)
- `icon` - Square icon button (h-9 w-9)

**Usage:**
```html
<!-- Default button -->
<button hlmBtn>Click me</button>

<!-- Outline button, small size -->
<button hlmBtn variant="outline" size="sm">Cancel</button>

<!-- Large primary button -->
<button hlmBtn size="lg">Submit</button>
```

**Features:**
- Uses `class-variance-authority` for variant management
- Smooth transitions
- Focus states
- Disabled states

---

### 3. Input Directive (`src/app/shared/ui/input.directive.ts`)
Consistent styling for form inputs.

**Directive:** `hlmInput`

**Usage:**
```html
<input hlmInput type="text" placeholder="Enter text" />
<input hlmInput type="email" placeholder="Email" />
```

**Styling:**
- Rounded borders
- Focus ring
- Placeholder styling
- Shadow effects
- Disabled states

---

### 4. Label Directive (`src/app/shared/ui/label.directive.ts`)
Consistent styling for form labels.

**Directive:** `hlmLabel`

**Usage:**
```html
<label hlmLabel for="email">Email Address</label>
<input hlmInput type="email" id="email" />
```

**Styling:**
- Medium font weight
- Proper spacing
- Disabled state support

---

## Where Components Are Used

### Blog Features
- **post-list.component** - Card components for blog posts, buttons for navigation
- **post-detail.component** - Card for post content, buttons for actions
- **add-comment.component** - Card wrapper, form inputs/labels, buttons

### Photo Features
- **album-list.component** - Card components for albums, buttons
- **album-detail.component** - Buttons for navigation

### Auth Features
- **login.component** - Card wrapper, form inputs/labels, buttons
- **signup.component** - Card wrapper, form inputs/labels, buttons

---

## Icon Library

### Lucide Angular
Professional icon library with 1000+ icons.

**Package:** `lucide-angular`

**Icons Used:**
- `arrow-right` - Navigation arrows
- `book-open` - Reading time indicator
- `camera` - Album/photo representation

**Usage:**
```html
<lucide-icon name="arrow-right" [size]="16" />
<lucide-icon name="camera" [size]="48" class="text-primary" />
```

**Configuration:**
Icons are provided globally in `app.config.ts`:
```typescript
import { LUCIDE_ICONS, LucideIconProvider } from 'lucide-angular';
import { ArrowRight, BookOpen, Camera } from 'lucide-angular/src/icons';

{
  provide: LUCIDE_ICONS,
  multi: true,
  useValue: new LucideIconProvider({
    ArrowRight,
    BookOpen,
    Camera,
  }),
}
```

See `ICON_STRATEGY.md` for detailed icon documentation.

---

## Styling Approach

### Tailwind CSS
All components use Tailwind CSS utility classes for styling.

**Benefits:**
- Consistent design system
- Small bundle size
- Easy customization
- Responsive by default

### Design Tokens
Components use Tailwind's design tokens:
- `primary` - Main brand color
- `secondary` - Secondary actions
- `destructive` - Danger/error states
- `muted-foreground` - Subtle text
- `border` - Border colors
- `input` - Input borders
- `ring` - Focus rings

### Dark Mode
Components support dark mode through Tailwind's dark mode utilities.

---

## Component Architecture

### Standalone Components
All components are standalone, making them:
- Easy to import
- Tree-shakeable
- Modular
- Reusable

### Host Bindings
Components use host bindings for styling:
```typescript
@Component({
  host: {
    class: 'block rounded-xl border bg-card text-card-foreground shadow',
  },
})
```

### Type Safety
Button directive uses TypeScript for type-safe variants:
```typescript
export type ButtonVariants = VariantProps<typeof buttonVariants>;
```

---

## Dependencies

### Required Packages
- `class-variance-authority` - Variant management for buttons
- `tailwindcss` - Styling framework
- `clsx` - Class name utilities
- `lucide-angular` - Icon library

### Installation
```bash
npm install class-variance-authority clsx lucide-angular
```

---

## Best Practices

### 1. Consistent Usage
Always use the same components throughout the app for consistency.

### 2. Semantic HTML
Components wrap semantic HTML elements (button, input, label).

### 3. Accessibility
- Proper ARIA attributes
- Keyboard navigation
- Focus management
- Screen reader support

### 4. Performance
- Standalone components for tree-shaking
- Minimal dependencies
- Optimized Tailwind CSS

---

## Customization

### Modifying Styles
Edit the component files in `src/app/shared/ui/` to customize:
- Colors
- Spacing
- Border radius
- Shadows
- Typography

### Adding Variants
Add new button variants in `button.directive.ts`:
```typescript
const buttonVariants = cva('...', {
  variants: {
    variant: {
      // Add new variant here
      custom: 'bg-custom text-custom-foreground',
    },
  },
});
```

### Extending Components
Create new components following the same patterns:
1. Use standalone components
2. Apply Tailwind classes via host bindings
3. Export from shared/ui folder
4. Document usage

---

## Backup & Recovery

### Backup Location
`src/app/shared/ui-backup/` contains backup copies of all custom components.

### Restoring Components
If needed, copy files from backup:
```bash
Copy-Item -Path "src/app/shared/ui-backup/*" -Destination "src/app/shared/ui/" -Force
```

---

## Future Enhancements

### Potential Additions
- Dialog/Modal components
- Dropdown menus
- Toast notifications
- Tabs component
- Accordion component
- Form validation components

### Migration Path
If switching to a UI library in the future:
1. Keep the same component names
2. Update imports
3. Adjust styling as needed
4. Test thoroughly

---

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Class Variance Authority](https://cva.style/docs)
- [Lucide Icons](https://lucide.dev/)
- [Angular Standalone Components](https://angular.dev/guide/components/importing)
