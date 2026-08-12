# Coding Standards & Guidelines

> **Purpose:** Ensure consistent, production-quality code regardless of who is prompting the AI assistant.
> **Audience:** Developers and non-developers using AI to contribute to this codebase.

---

## Golden Rules

1. **Reuse before creating** - Check if similar code exists before writing new
2. **Type everything** - Never use `any`, always define proper types
3. **Use design tokens** - Never hardcode colors, spacing, fonts
4. **Keep it simple** - No over-engineering, solve the current problem
5. **Security first** - Validate inputs, never expose secrets

---

## TypeScript Standards

### ✅ DO

```typescript
// Define explicit types
interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

// Use type inference where obvious
const count = 0; // inferred as number

// Use generics for reusable code
function getItem<T>(items: T[], id: string): T | undefined {
  return items.find(item => (item as any).id === id);
}

// Import types with `type` keyword
import type { ReactNode } from 'react';
```

### ❌ DON'T

```typescript
// Never use any
const data: any = fetchData(); // BAD

// Don't ignore TypeScript errors
// @ts-ignore // BAD - fix the actual issue

// Don't use object or {}
const config: object = {}; // BAD - use Record<string, unknown>
```

---

## React Patterns

### Component Structure

```typescript
// 1. Imports (external, then internal, then types)
import { useState, useCallback } from 'react';
import { Button } from '@/components';
import type { FormData } from './types';

// 2. Types/Interfaces
interface Props {
  title: string;
  onSubmit: (data: FormData) => void;
}

// 3. Component
export function MyComponent({ title, onSubmit }: Props) {
  // 3a. Hooks first
  const [value, setValue] = useState('');

  // 3b. Derived state / memos
  const isValid = value.length > 0;

  // 3c. Callbacks
  const handleSubmit = useCallback(() => {
    onSubmit({ value });
  }, [value, onSubmit]);

  // 3d. Effects (if needed)

  // 3e. Render
  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={handleSubmit} disabled={!isValid}>
        Submit
      </Button>
    </div>
  );
}
```

### ✅ DO

```typescript
// Use existing components
import { Button, Input, Checkbox } from '@/components';

// Memoize expensive computations
const filtered = useMemo(() =>
  items.filter(item => item.active),
[items]);

// Memoize callbacks passed to children
const handleClick = useCallback(() => {
  doSomething();
}, [dependency]);

// Use React Query for data fetching
const { data, isLoading } = useBusinesses();
```

### ❌ DON'T

```typescript
// Don't fetch in useEffect
useEffect(() => {
  fetch('/api/data').then(setData); // BAD - use React Query
}, []);

// Don't create new objects in render
<Button style={{ color: 'red' }} /> // BAD - creates new object each render

// Don't ignore dependencies
useEffect(() => {
  doSomething(value);
}, []); // BAD - missing 'value' dependency
```

---

## Styling Rules

### ✅ ALWAYS Use CSS Variables

```css
/* GOOD */
.button {
  background: var(--color-primary-gradient);
  color: var(--color-text-primary);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-lg);
  font-family: var(--font-primary);
  font-weight: var(--font-weight-semibold);
  transition: background var(--transition-default);
}
```

### ❌ NEVER Hardcode Values

```css
/* BAD */
.button {
  background: #6E7BFF;           /* Use --color-primary */
  color: #EEF0FA;                /* Use --color-text-primary */
  padding: 12px 16px;            /* Use --spacing-md --spacing-lg */
  border-radius: 14px;           /* Use --radius-lg */
  font-family: 'Manrope';        /* Use --font-primary */
}
```

### Available Design Tokens

| Category | Examples |
|----------|----------|
| Colors | `--color-primary`, `--color-bg-card`, `--color-text-secondary` |
| Spacing | `--spacing-xs` (4px) → `--spacing-5xl` (56px) |
| Radius | `--radius-sm` (6px) → `--radius-full` (999px) |
| Shadows | `--shadow-card`, `--shadow-button-primary`, `--shadow-input` |
| Fonts | `--font-primary`, `--font-mono` |
| Weights | `--font-weight-regular` → `--font-weight-extrabold` |
| Transitions | `--transition-fast`, `--transition-default`, `--transition-slow` |

---

## Code Reuse Checklist

Before writing new code, check:

| Need | Check First |
|------|-------------|
| UI Component | `src/components/` - Button, Input, Checkbox, etc. |
| Icon | `src/components/shared/Icons/` |
| API call | `src/api/hooks/` - useBusinesses, useConsultations |
| Form validation | `src/constants/validation.ts` |
| Routes | `src/constants/routes.ts` |
| Auth state | `useAuth()` hook |
| UI state | `src/stores/uiStore.ts` - notifications, modals |
| Loading spinner | `<LoadingSpinner />` |
| Error display | `<ErrorMessage />` |

---

## API & Data Fetching

### ✅ DO

```typescript
// Use React Query hooks
import { useBusinesses, useCreateBusiness } from '@/api';

function MyComponent() {
  const { data, isLoading, error } = useBusinesses();
  const createBusiness = useCreateBusiness();

  const handleCreate = () => {
    createBusiness.mutate(formData, {
      onSuccess: () => addNotification({ type: 'success', title: 'Created!' }),
      onError: (err) => addNotification({ type: 'error', title: err.message }),
    });
  };
}
```

### ❌ DON'T

```typescript
// Don't use fetch/axios directly in components
useEffect(() => {
  axios.get('/api/businesses').then(setData); // BAD
}, []);

// Don't manage loading/error state manually
const [loading, setLoading] = useState(false); // BAD - React Query handles this
```

---

## File & Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Component | PascalCase | `BusinessCard.tsx` |
| Hook | camelCase with `use` | `useLoginForm.ts` |
| Utility | camelCase | `formatDate.ts` |
| Constant | SCREAMING_SNAKE | `VALIDATION_MESSAGES` |
| CSS Module | PascalCase.module.css | `BusinessCard.module.css` |
| Type/Interface | PascalCase | `interface BusinessData` |

### Folder Structure for Components

**Simple components** (Button, Input, Checkbox):
```
src/components/Button/
├── Button.tsx                # Component logic + types inline
├── Button.module.css         # Scoped styles
└── index.ts                  # Export: export { Button } from './Button'
```

**Complex pages** (multi-section, significant state, multiple handlers):
```
src/pages/BusinessOnboarding/
├── BusinessOnboarding.tsx          # Component JSX only
├── BusinessOnboarding.types.ts     # Types and interfaces
├── BusinessOnboarding.hooks.ts     # Custom hook with state, handlers, mock data
├── BusinessOnboarding.module.css   # Scoped styles
└── index.ts                        # Exports component, hook, and types
```

### When to Use Separate Files

| Criteria | Inline (single file) | Separate files |
|----------|---------------------|----------------|
| Lines of code | < 150 | > 150 |
| State variables | 0-2 | 3+ |
| Handler functions | 0-3 | 4+ |
| Types/interfaces | 1-2 simple | 3+ or complex |
| Mock data | None | Present |
| Reusable hook | No | Yes |

### Example: Complex Page Hook

```typescript
// BusinessOnboarding.hooks.ts
export function useBusinessOnboarding(): UseBusinessOnboardingReturn {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State
  const [selectedBusiness, setSelectedBusiness] = useState<string | null>(null);

  // Derived values
  const userInitials = useMemo(() => /* ... */, [user]);

  // Handlers
  const handleSelectBusiness = useCallback((id: string) => {
    setSelectedBusiness(id);
  }, []);

  return {
    userInitials,
    selectedBusiness,
    handleSelectBusiness,
    // ... other values and handlers
  };
}
```

---

## Security Guidelines

### ✅ DO

```typescript
// Validate all inputs with Zod
import { createBusinessSchema } from '@/server/validation';
const validated = createBusinessSchema.parse(userInput);

// Use parameterized queries (when we add DB)
db.query('SELECT * FROM users WHERE id = $1', [userId]);

// Sanitize displayed user content
<div>{sanitize(userContent)}</div>
```

### ❌ DON'T

```typescript
// Never expose secrets
const API_KEY = 'sk-123...'; // BAD - use env variables

// Never trust client input
const userId = req.body.userId; // BAD without validation
db.query(`SELECT * FROM users WHERE id = ${userId}`); // SQL INJECTION

// Never use dangerouslySetInnerHTML with user content
<div dangerouslySetInnerHTML={{ __html: userContent }} /> // XSS risk
```

---

## Performance Guidelines

### ✅ DO

```typescript
// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Memoize expensive components
export const ExpensiveList = memo(function ExpensiveList({ items }) {
  return items.map(item => <Item key={item.id} {...item} />);
});

// Use proper keys in lists
{items.map(item => <Item key={item.id} />)} // Good - stable ID

// Debounce search inputs
const debouncedSearch = useMemo(
  () => debounce(handleSearch, 300),
  [handleSearch]
);
```

### ❌ DON'T

```typescript
// Don't use index as key for dynamic lists
{items.map((item, index) => <Item key={index} />)} // BAD

// Don't create functions in render
<Button onClick={() => handleClick(id)} /> // Creates new function each render

// Don't fetch without caching
useEffect(() => { fetch(); }, []); // No caching - use React Query
```

---

## Git Commit Guidelines

```
Format: <type>: <description>

Types:
- feat: New feature
- fix: Bug fix
- refactor: Code change that neither fixes nor adds
- style: CSS/formatting changes
- docs: Documentation
- chore: Build/config changes

Examples:
- feat: Add business registration form
- fix: Resolve JWT verification in production
- refactor: Extract validation to Zod schemas
- style: Update button hover states
```

---

## Checklist Before Submitting Code

- [ ] No `any` types
- [ ] No hardcoded colors/spacing (using CSS variables)
- [ ] Reused existing components where possible
- [ ] Added proper TypeScript types
- [ ] Used React Query for data fetching
- [ ] Validated inputs with Zod (server-side)
- [ ] No console.log left in code
- [ ] No commented-out code
- [ ] Build passes (`npm run build`)
- [ ] Lint passes (`npm run lint`)

---

## Quick Reference: Imports

```typescript
// Components
import { Button, Input, Checkbox } from '@/components';
import { LoadingSpinner, ErrorMessage, Icons } from '@/components/shared';

// Hooks
import { useAuth } from '@/providers';
import { useBusinesses, useCreateBusiness } from '@/api';

// State
import { useAddNotification, useModal } from '@/stores';

// Constants
import { ROUTES } from '@/constants';

// Types
import type { Business, Consultation } from '@/api/types';
```

---

## After Every Feature

**IMPORTANT:** Update documentation after completing any significant work.

### Update CONTEXT.md when:
- Adding a new page/route
- Creating new components that others should reuse
- Adding new API endpoints or hooks
- Making architectural decisions
- Changing environment variables
- Adding new dependencies

### What to update:
```markdown
## Pages Implemented        ← Add new pages
## Folder Structure         ← If new folders created
## Decision Log             ← Add the what and why
## Pending / Future Work    ← Check off completed items
## Environment Variables    ← If new vars added
```

### Example Decision Log entry:
```markdown
| 2026-08-13 | Added file upload component | Reusable for documents, supports drag-drop |
```

---

## When In Doubt

1. **Read CONTEXT.md** for project overview
2. **Search existing code** before creating new
3. **Follow existing patterns** in similar files
4. **Ask for clarification** rather than guessing
5. **Keep changes minimal** - solve the stated problem only
