# SmartWallet PWA - Architecture Overview

## Project Summary

SmartWallet is a personal finance management Progressive Web Application (PWA) built with Next.js 16 and React 19. It provides users with comprehensive financial tracking, goal management, and gamified achievement systems. The app is designed as a client-rendered dashboard with no current backend integration.

**Key Technologies:**
- Next.js 16.0.0 with App Router
- React 19.2.0
- TypeScript 5
- Tailwind CSS 4.1.9 (OKLch color space)
- Radix UI primitives
- Recharts for data visualization
- React Hook Form + Zod for forms (infrastructure ready)

---

## Directory Structure

```
.
├── app/                          # Next.js app directory (minimal)
│   ├── layout.tsx               # Root layout with Analytics integration
│   ├── page.tsx                 # Home page - renders DashboardView
│   ├── globals.css              # Global CSS with theme variables
│
├── components/                  # React components
│   ├── dashboard-view.tsx       # Main layout with navigation & view routing
│   ├── spending-dashboard.tsx   # Charts and financial overview
│   ├── transactions-list.tsx    # Transaction history with filtering
│   ├── goals-tracker.tsx        # Goal management with progress tracking
│   ├── gamification-panel.tsx   # Achievements and streaks system
│   ├── add-transaction-dialog.tsx  # Modal form for new transactions
│   ├── theme-provider.tsx       # Next-themes wrapper
│   │
│   └── ui/                      # shadcn/ui components (59 components)
│       ├── form.tsx             # React Hook Form integration wrapper
│       ├── button.tsx           # Button with CVA variants
│       ├── dialog.tsx           # Radix Dialog primitive wrapper
│       ├── card.tsx             # Card layout primitive
│       ├── input.tsx            # Text input primitive
│       ├── select.tsx           # Radix Select wrapper
│       ├── tabs.tsx             # Radix Tabs wrapper
│       ├── chart.tsx            # Recharts integration wrapper
│       ├── badge.tsx            # Badge component
│       ├── progress.tsx         # Progress bar primitive
│       └── [51 other UI components]
│
├── hooks/                       # Custom React hooks
│   ├── use-toast.ts            # Toast notification system (reducer-based)
│   ├── use-mobile.ts           # Mobile viewport detection hook
│
├── lib/                         # Utility functions
│   ├── utils.ts                 # cn() helper (clsx + tailwind-merge)
│   └── i18n/                    # Internationalization system
│       ├── types.ts             # Language and Translations type definitions
│       ├── context.tsx          # LanguageProvider with Context API
│       ├── index.ts             # Exports
│       └── translations/
│           ├── en.ts            # English translations
│           └── pt.ts            # Portuguese translations
│
├── styles/                      # Additional stylesheets
│   └── globals.css              # Light/dark theme CSS variables
│
├── public/                      # Static assets
│
├── tsconfig.json                # TypeScript config with @ path alias
├── next.config.mjs              # Next.js config (unoptimized images, ignore TS errors)
├── components.json              # shadcn/ui config (RSC enabled, new-york style)
├── postcss.config.mjs           # PostCSS with Tailwind 4 plugin
├── package.json                 # Dependencies
└── pnpm-lock.yaml               # Lock file
```

---

## Key Architectural Patterns

### 1. Client-Side State Management

The application uses **local component state** (React.useState) exclusively. There is no global state management library (Redux, Context API, Zustand, etc.).

**Pattern Example (GoalsTracker):**
```typescript
const [goals, setGoals] = useState<Goal[]>(initialGoals)
const [showAddDialog, setShowAddDialog] = useState(false)
const [newGoal, setNewGoal] = useState({ title: "", targetAmount: "", ... })
```

**Implications:**
- Each component manages its own isolated state
- No cross-component state sharing mechanism in place
- Ideal for future integration with a backend API
- Simplifies initial development but requires refactoring for complex multi-component interactions

### 2. Component Organization

**View-Based Structure:**
- `DashboardView` is the main orchestrator component that manages which view to display
- Tabs/sections are implemented via `useState<"dashboard" | "transactions" | "goals" | "achievements">`
- Each view has a dedicated component (SpendingDashboard, TransactionsList, GoalsTracker, GamificationPanel)

**Navigation Pattern:**
```typescript
const [currentView, setCurrentView] = useState<View>("dashboard")
// Switches between views on button click
{currentView === "dashboard" && <SpendingDashboard />}
{currentView === "transactions" && <TransactionsList />}
```

**UI Component Architecture:**
- Extensive use of shadcn/ui (59 pre-built components)
- All UI components are wrapped Radix UI primitives + Tailwind CSS
- Uses CVA (Class Variance Authority) for semantic component variants (button sizes, colors)
- All interactive components marked with `data-slot` attributes for styling hooks

### 3. Data Structures (Mock/Prototype)

Data is **hardcoded as constants** within components - no API integration yet:

**Transaction Type:**
```typescript
type Transaction = {
  id: string
  title: string
  category: string
  amount: number
  type: "income" | "expense"
  date: string
  icon: typeof ShoppingBag  // Lucide icon type
}
```

**Goal Type:**
```typescript
type Goal = {
  id: string
  title: string
  targetAmount: number
  currentAmount: number
  deadline: string
  category: string
  color: string
}
```

**Achievement Type:**
```typescript
type Achievement = {
  id: string
  title: string
  description: string
  icon: typeof Trophy
  points: number
  unlocked: boolean
  unlockedDate?: string
  progress?: number
  maxProgress?: number
  rarity: "common" | "rare" | "epic" | "legendary"
}
```

### 4. Form Patterns

**Current Implementation:**
- `AddTransactionDialog` uses uncontrolled form with `useState` for each field
- No validation library currently integrated
- Basic HTML form validation (required attributes)

**Infrastructure Ready For:**
- React Hook Form (already installed: `@hookform/resolvers`)
- Zod validation (already installed: `3.25.76`)
- Form component wrapper exists at `/components/ui/form.tsx` with full RHF integration pattern

**Example Form (AddTransactionDialog):**
```typescript
const [type, setType] = useState<"income" | "expense">("expense")
const [amount, setAmount] = useState("")
const [title, setTitle] = useState("")
const [category, setCategory] = useState("")

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  console.log({ type, amount, title, category })
  onOpenChange(false)
  // Reset form
  setAmount("")
  ...
}
```

### 5. Theme & Styling System

**Tailwind CSS v4 with OKLch Colors:**
- All colors use OKLch color space for perceptually uniform color gradients
- CSS variables defined in `:root` and `.dark` classes
- No separate theme config file needed (inline @theme directive in globals.css)

**Color Palette:**
- Primary, Secondary, Accent, Destructive colors
- Chart colors (chart-1 through chart-5) for data visualization
- Sidebar-specific colors for future layout variations
- Border, Input, Ring, Muted colors for UI elements

**Theme Provider:**
- Uses `next-themes` (v0.4.6) for dark mode support
- ThemeProvider is a simple wrapper around NextThemesProvider
- Not integrated into RootLayout yet (ready for adoption)

**Custom Scrollbar:**
- OKLch-based scrollbar styling in globals.css
- Consistent with overall design system

### 6. Data Visualization

**Recharts Integration:**
- Used for all charts in SpendingDashboard
- Chart types implemented:
  - AreaChart (Income vs Expenses, 6-month comparison)
  - PieChart (Spending by Category breakdown)
  - BarChart (Weekly Spending Pattern)
- Custom ChartContainer wrapper for config management
- ChartTooltip with custom ChartTooltipContent component

**Sample Data:**
- monthlyData: 6 months of income/expense tracking
- categoryData: 6 spending categories with OKLch colors
- weeklySpending: 7-day spending breakdown

### 7. Dialog/Modal Pattern

**Controlled Dialogs:**
All dialogs use controlled state pattern:
```typescript
<Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent>...</DialogContent>
</Dialog>
```

**Example (AddTransactionDialog):**
- Props: `open: boolean`, `onOpenChange: (open: boolean) => void`
- Parent controls visibility via state
- Dialog closes on form submission or cancel button click

### 8. Mobile Responsiveness

**Responsive Patterns:**
- Sidebar navigation hidden on mobile (`hidden md:block`)
- Bottom navigation bar appears only on mobile (`block md:hidden`)
- Grid layouts use responsive columns: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
- Custom `useIsMobile()` hook for viewport detection (768px breakpoint)

**DashboardView Structure:**
```
Header (sticky)
├─ Sidebar (desktop only)
├─ Main Content (responsive grid)
└─ Bottom Navigation (mobile only)
Floating Action Button (add transaction)
```

### 9. Custom Hooks

**useToast Hook** (`/hooks/use-toast.ts`):
- Reducer-based state management for toast notifications
- Implements pub/sub pattern with in-memory state
- Actions: ADD_TOAST, UPDATE_TOAST, DISMISS_TOAST, REMOVE_TOAST
- Automatic removal after 1000000ms (configurable)
- Limited to 1 active toast (TOAST_LIMIT = 1)
- Independent of the UI implementation (no specific toast component imported)

**useIsMobile Hook** (`/hooks/use-mobile.ts`):
- Detects mobile viewport (< 768px)
- Uses MediaQueryList API
- Updates state on viewport change
- Prevents hydration mismatch by initializing as undefined

### 10. Utility Functions

**cn() Helper** (`/lib/utils.ts`):
- Combines clsx + tailwind-merge
- Handles conditional Tailwind classes with conflict resolution
- Standard shadcn/ui utility pattern
- Used throughout all UI components

### 11. Internationalization (i18n)

**Multi-language Support** (`/lib/i18n/`):
- Full internationalization system supporting English and Portuguese
- Context-based language management with localStorage persistence
- Automatic browser language detection on first load
- Custom `useLanguage()` hook for accessing translations

**Architecture:**
```typescript
// Usage in components
const { t, language, setLanguage } = useLanguage()
<h1>{t.dashboard.title}</h1>
```

**Key Files:**
- `/lib/i18n/types.ts` - TypeScript definitions for Language and Translations
- `/lib/i18n/context.tsx` - LanguageProvider with React Context
- `/lib/i18n/translations/en.ts` - All English translations
- `/lib/i18n/translations/pt.ts` - All Portuguese translations
- `/components/language-selector.tsx` - UI component to toggle languages

**Translation Structure:**
- `common` - Common actions (cancel, save, delete, edit, etc.)
- `navigation` - Navigation menu items
- `dashboard` - Dashboard page and charts
- `transactions` - Transactions page and categories
- `goals` - Goals tracking page
- `gamification` - Achievements and challenges

**Implementation Details:**
- Provider wraps entire app in `app/layout.tsx`
- All user-facing text uses translations via `t.*` syntax
- Code remains in English (variables, functions, types)
- Language preference persists across sessions via localStorage
- LanguageSelector button in header for easy switching

---

## Configuration Files

### tsconfig.json
- Target: ES6
- Module: ESNext
- JSX: preserve (Next.js handles JSX)
- Path alias: `@/*` -> root directory
- Strict mode enabled
- Isolated modules enabled
- noEmit: true (no direct TS compilation)

### next.config.mjs
```javascript
{
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true }
}
```
- Ignores TypeScript errors during build (development aid)
- Disables Next.js image optimization (PWA compatibility)

### components.json (shadcn/ui config)
- Style: new-york (minimal, clean design)
- RSC: true (React Server Components - infrastructure ready, not used yet)
- Tailwind CSS variables enabled
- Aliases configured for components, utils, ui, lib, hooks

### postcss.config.mjs
- Single plugin: @tailwindcss/postcss
- Handles Tailwind CSS v4 processing

---

## Notable Patterns & Conventions

### 1. "use client" Directive
All interactive components have `"use client"` at the top - this codebase is **client-side only** despite being in a Next.js app directory.

### 2. Component Composition
- Large components (~200-300 lines) with inline JSX
- No component decomposition into smaller sub-components
- Heavy use of shadcn/ui primitives to reduce code

### 3. Type Definitions
- Inline interface/type definitions within components
- No centralized types file
- Props interfaces defined per component

### 4. Icon Library
- Lucide React (v0.454.0) for all icons
- Icons imported as React components
- Icon types exposed for type-safe component references: `icon: typeof Trophy`

### 5. Color Scheme
- All hardcoded colors use OKLch format strings
- Example: `"oklch(0.65 0.25 285)"` (lightness, chroma, hue)
- Theme colors integrated into Tailwind via CSS variables

### 6. Floating Action Button Pattern
- FAB positioned `fixed bottom-6 right-6`
- Used to trigger "Add Transaction" dialog
- Hidden/shown globally without controller
- Shadow effect: `shadow-lg shadow-primary/50`

### 7. Card-Based UI
- All major sections use Card components
- Consistent styling: `border-border/40 bg-card/50 backdrop-blur`
- Backdrop blur for modern aesthetic

### 8. Badge System
- Badge component for status indicators
- Used in transaction lists and achievements
- Dynamic styling based on transaction type

### 9. Date Handling
- Uses standard JavaScript Date API
- date-fns library installed but not actively used (v4.1.0)
- Deadline calculation: `getDaysRemaining()` function in GoalsTracker

### 10. Analytics Integration
- Vercel Analytics imported in root layout
- `<Analytics />` component renders but no custom tracking

---

## Forms & Validation Infrastructure

### Available but Not Yet Implemented:
- **React Hook Form** v7.60.0 - full form wrapper at `/components/ui/form.tsx`
- **Zod** v3.25.76 - schema validation ready
- **Form Component Utilities** - FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage

### To Migrate AddTransactionDialog to RHF+Zod:
1. Define Zod schema
2. Create form instance with useForm()
3. Wrap with <Form>
4. Use <FormField> for each input
5. Replace manual handleSubmit with form.handleSubmit()

---

## Data Flow Patterns

### 1. View Switching (DashboardView)
```
User clicks button → setCurrentView(newView) → Re-render appropriate component
```

### 2. Transaction Management (AddTransactionDialog)
```
FAB clicked → setShowAddDialog(true) → Dialog opens → Form submission → 
console.log() [currently no state update] → Dialog closes
```

### 3. Goals Management (GoalsTracker)
```
Click "Add Goal" → setShowAddDialog(true) → Form filled → 
handleAddGoal() → setGoals([...goals, newGoal]) → Re-render list
```

### 4. Toast Notifications (use-toast hook)
```
toast({ title: "...", description: "..." }) → dispatch(ADD_TOAST) → 
listeners notified → UI updates → Timer removes after delay
```

---

## Current Limitations & Future Considerations

### 1. No Backend Integration
- All data is hardcoded mock data
- No API routes or server functions
- Ready for REST/GraphQL integration

### 2. Limited Global State Management
- Context API used only for language/i18n (LanguageProvider)
- Financial data still isolated per component
- Future: Consider extending Context or adding state library for:
  - User authentication
  - Global financial data
  - Cross-component transaction sharing

### 3. Limited Persistence
- localStorage used only for language preference
- Financial data not persisted (resets on page refresh)
- Future: Add localStorage for offline capability or connect to backend for data persistence

### 4. No Authentication
- No user accounts or authentication system
- App Router supports middleware for future auth integration

### 5. Limited Form Validation
- Only HTML5 validation (required, type, step)
- No client-side validation logic
- Form submission does nothing (console.log only)

### 6. Mock Icons for Transactions
- Uses hardcoded Lucide icons mapped to transaction types
- Future: Could be data-driven from categories

### 7. No Error Handling
- No try-catch blocks
- No error boundaries
- Future: Add error handling for API calls and user interactions

---

## Dependencies Overview

### Core Framework
- **next** 16.0.0 - React framework
- **react** 19.2.0, **react-dom** 19.2.0 - UI library
- **react-is** (latest) - Required peer dependency for recharts

### UI Components & Styling
- **@radix-ui/** (15 packages) - Accessible primitive components
- **tailwindcss** 4.1.9 - Utility-first CSS
- **class-variance-authority** 0.7.1 - Component variant management
- **clsx** 2.1.1 - Conditional className helper
- **tailwind-merge** 2.5.5 - Merge conflicting Tailwind classes
- **lucide-react** 0.454.0 - Icon library
- **tailwindcss-animate** 1.0.7 - Animation utilities
- **autoprefixer** 10.4.20 - PostCSS vendor prefixes

### Forms & Validation
- **react-hook-form** 7.60.0 - Form state management
- **@hookform/resolvers** 3.10.0 - Validation resolvers
- **zod** 3.25.76 - Schema validation

### Data & Visualization
- **recharts** (latest) - Chart library
- **date-fns** 4.1.0 - Date manipulation
- **embla-carousel-react** 8.5.1 - Carousel/slider

### UI Enhancements
- **next-themes** 0.4.6 - Dark mode provider
- **sonner** 1.7.4 - Toast notifications
- **vaul** 0.9.9 - Drawer/sheet component
- **cmdk** 1.0.4 - Command palette
- **input-otp** 1.4.1 - OTP input
- **react-day-picker** 9.8.0 - Date picker
- **react-resizable-panels** 2.1.7 - Resizable layout panels

### Analytics
- **@vercel/analytics** 1.3.1 - Vercel analytics

### Development
- **typescript** 5 - Type safety
- **postcss** 8.5 - CSS processing
- **@tailwindcss/postcss** 4.1.9 - Tailwind CSS processor

---

## How to Extend the Architecture

### Adding a New Feature Component
1. Create component in `/components/[feature-name].tsx`
2. Add `"use client"` directive
3. Use existing UI components from `/components/ui/`
4. Define local types for data
5. Manage state with `useState`
6. Add navigation link in DashboardView sidebar and mobile nav

### Integrating an API
1. Create API route in `app/api/[route]/route.ts`
2. Use fetch() in components with useEffect for data loading
3. Consider migrating to React Server Components for better performance
4. Implement error boundaries and loading states

### Adding Form Validation
1. Define Zod schema
2. Import form components and useFormContext
3. Replace useState pattern with react-hook-form
4. Wrap form with <Form provider>
5. Use <FormField> for each input with validation rules

### Implementing Global State
1. Create Context wrapper component in `/components/providers/`
2. Define context value type
3. Wrap app in provider in root layout
4. Use useContext hook in components
5. Alternative: Add state management library (Zustand, Redux, etc.)

### Adding New Translations
1. Add new translation keys to `/lib/i18n/types.ts` Translations interface
2. Add translations to `/lib/i18n/translations/en.ts` (English)
3. Add translations to `/lib/i18n/translations/pt.ts` (Portuguese)
4. Use in components via `const { t } = useLanguage()` and access with `t.section.key`
5. To add a new language: create new translation file, add to Language type, update context.tsx

---

## Summary of Key Files to Edit for Common Tasks

| Task | Files to Edit |
|------|---------------|
| Add new page/view | `components/dashboard-view.tsx`, create new component |
| Add UI component | `components/ui/[component].tsx`, import in feature |
| Change theme colors | `app/globals.css` or `styles/globals.css` |
| Add form validation | `AddTransactionDialog.tsx`, migrate to React Hook Form |
| Add API endpoint | Create `app/api/[route]/route.ts` |
| Add persistent state | Wrap in Context provider or add localStorage |
| Add new hook | Create in `/hooks/[hook-name].ts` |
| Add utility function | Add to `/lib/utils.ts` or create new file |
| Add translations | `lib/i18n/types.ts`, `translations/en.ts`, `translations/pt.ts` |
| Change language | Use `<LanguageSelector />` component in header |

---

## File Sizes & Complexity

- **components/spending-dashboard.tsx** - ~275 lines (most complex, multiple charts)
- **components/dashboard-view.tsx** - ~145 lines (main orchestrator)
- **components/goals-tracker.tsx** - ~200+ lines (state management with dialogs)
- **components/transactions-list.tsx** - ~150+ lines (filtering & list rendering)
- **components/gamification-panel.tsx** - ~150+ lines (achievements display)
- **components/add-transaction-dialog.tsx** - ~130 lines (form modal)
- **hooks/use-toast.ts** - ~190 lines (complex reducer logic)
- **UI components** - 20-60 lines each (wrapper patterns)

---

## Browser & Environment Support

- **Node.js**: Requires modern version (v16+ for pnpm)
- **Package Manager**: pnpm (specified in lock file)
- **Modern Browsers**: All modern browsers supporting ES2020+
- **PWA Features**: Ready but not configured (no manifest or service worker currently)

