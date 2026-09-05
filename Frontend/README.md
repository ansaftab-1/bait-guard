# 🚀 Frontend Development Guidelines

> **Purpose:** This document defines the mandatory standards for developing the frontend of this project. Every contributor and AI coding assistant (e.g., Cursor AI, GitHub Copilot) must follow these rules to maintain a clean, scalable, reusable, and production-ready codebase.

---

# 📌 Core Principles

Every piece of frontend code must be:

- Clean
- Modular
- Reusable
- Scalable
- Maintainable
- Responsive
- Accessible
- Optimised
- Easy to extend
- Production-ready

---

# 🚨 Mandatory Rules

## Rule 1: Never Build Pages Directly

**Pages are not for writing UI.**

A page should only:

- Import components
- Arrange components
- Pass props
- Handle page routing if required

A page should **never** contain:

- Large JSX blocks
- Repeated UI
- Business logic
- API requests
- Large forms
- Complex state management

---

## Rule 2: Create Components First

Before creating any page:

1. Analyse the UI.
2. Break it into reusable sections.
3. Create each section as an individual component.
4. Reuse existing components whenever possible.
5. Finally assemble the page using those components.

---

## Example

❌ Incorrect

```jsx
HomePage.jsx

Hero
Features
Services
Testimonials
FAQ
Footer
```

Everything inside one file.

---

✅ Correct

```
components/
    home/
        Hero.jsx
        Features.jsx
        Services.jsx
        Testimonials.jsx
        FAQ.jsx
```

Then:

```jsx
export default function HomePage() {
    return (
        <>
            <Hero />
            <Features />
            <Services />
            <Testimonials />
            <FAQ />
        </>
    );
}
```

The page should simply compose components.

---

# 🧩 Every UI Section Must Be a Component

Every visible section must be isolated into its own reusable component.

Examples:

- Navbar
- Sidebar
- Header
- Footer
- Hero
- Banner
- Search Bar
- Filter Panel
- Cards
- Tables
- Charts
- Statistics
- Profile
- Settings
- Forms
- Pagination
- Tabs
- Modal
- Drawer
- Dialog
- Toast
- Loader
- Skeleton
- Empty State
- Error State
- Not Found
- Breadcrumb
- Avatar
- Badge

Never write these directly inside a page.

---

# 🏗 Component Rules

Every component should have **one responsibility**.

Good

```
UserCard.jsx

Displays a user card only.
```

Bad

```
UserCard.jsx

Displays UI
Fetches API
Deletes users
Updates users
Shows modal
Contains business logic
```

---

# ♻️ Reusability Rules

If you duplicate UI,

➡ Create a reusable component.

If you duplicate logic,

➡ Create a custom hook.

If you duplicate API requests,

➡ Create a service.

If you duplicate helper functions,

➡ Move them to utilities.

If you duplicate constants,

➡ Move them to constants.

Never duplicate code.

---

# 📁 Recommended Folder Structure

```
src/

├── assets/
│
├── components/
│   ├── common/
│   ├── layout/
│   ├── shared/
│   ├── ui/
│   └── features/
│
├── hooks/
│
├── pages/
│
├── routes/
│
├── services/
│
├── utils/
│
├── constants/
│
├── context/
│
├── styles/
│
├── types/
│
└── App.jsx
```

---

# 📄 Page Guidelines

A page should ideally be between **20–80 lines**.

A page should only:

- Import reusable components
- Arrange layout
- Pass props
- Export the page

Nothing else.

---

# 📦 Shared Components

Always create reusable UI components.

Examples:

```
Button
Input
Textarea
Select
Checkbox
Radio
Card
Avatar
Badge
Chip
Tooltip
Dropdown
Accordion
Tabs
Table
Pagination
Breadcrumb
Modal
Dialog
Toast
Spinner
Loader
Skeleton
EmptyState
ErrorState
```

Reuse them throughout the application.

---

# 🎨 Styling Guidelines

- Use Tailwind CSS consistently.
- Avoid inline styles.
- Keep utility classes readable.
- Extract repeated styles into reusable components.
- Use consistent spacing and typography.
- Follow the project design system.

---

# 📱 Responsive Design

Every component must support:

- Mobile
- Tablet
- Desktop
- Large screens

Always use a **mobile-first** approach.

Never build desktop-only layouts.

---

# ⚡ Performance

Optimise every page.

Use:

- Lazy Loading
- Dynamic Imports
- Code Splitting
- React.memo (when appropriate)
- useMemo (when needed)
- useCallback (when needed)
- Image optimisation
- Pagination
- Infinite scrolling (if appropriate)
- Debouncing
- Throttling
- Virtualisation for large lists

---

# ♿ Accessibility

Every component must include:

- Semantic HTML
- Keyboard navigation
- Focus indicators
- Proper labels
- ARIA attributes where required
- Accessible colour contrast
- Screen reader support

---

# 🧼 Clean Code Rules

Always:

- Use descriptive names.
- Keep files small.
- Keep functions small.
- Follow the Single Responsibility Principle.
- Remove duplicate code.
- Separate UI from logic.
- Keep imports organised.
- Write readable code.
- Remove unused code.
- Keep components reusable.

---

# 📏 Component Size

Recommended:

- **50–150 lines**

Maximum:

- **200 lines**

If a component exceeds 200 lines, split it into smaller components.

---

# 🔤 Naming Convention

Use meaningful names.

✅ Good

```
UserCard.jsx
DashboardHeader.jsx
RecentOrdersTable.jsx
ProfileInformation.jsx
```

❌ Bad

```
Component.jsx
Box.jsx
Test.jsx
New.jsx
File1.jsx
```

---

# 🔄 Development Workflow

For **every frontend feature**:

1. Analyse the design.
2. Identify reusable UI sections.
3. Check if reusable components already exist.
4. Reuse existing components whenever possible.
5. Create new reusable components only when necessary.
6. Build shared UI components.
7. Build layouts if required.
8. Assemble the page using components.
9. Verify responsiveness.
10. Test loading, empty, and error states.
11. Optimise performance.
12. Refactor duplicated code.

---

# 🚫 Things You Must Never Do

- ❌ Build an entire page inside one file.
- ❌ Copy and paste JSX.
- ❌ Duplicate components.
- ❌ Duplicate styling.
- ❌ Write API calls inside UI components.
- ❌ Mix UI with business logic.
- ❌ Create components with multiple responsibilities.
- ❌ Ignore responsiveness.
- ❌ Ignore accessibility.
- ❌ Create unnecessary components when reusable ones already exist.

---

# 🏆 Golden Rule

> **Never build a page directly.**
>
> Always analyse the design first, break it into reusable components, reuse existing components whenever possible, create new components only when necessary, and finally assemble the page using those reusable components.
>
> Every frontend screen in this project must follow these standards to ensure a clean, maintainable, scalable, and production-ready codebase.
