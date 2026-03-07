# Natural UI Component Library

## Component Patterns Used in Redesign

These are the reusable, production-ready patterns implemented in the Hotel Menu Manager.

---

## 🎨 Base Styles

### Color Palette
```css
Primary: orange-600 (#ea580c)
Background: gray-50 (#f9fafb)
Card: white (#ffffff)
Border: gray-200 (#e5e7eb)
Text: gray-900 (#111827)
Muted: gray-500 (#6b7280)
```

### Spacing Scale
```css
Extra Tight: gap-1, px-2, py-1
Tight: gap-2, px-3, py-1.5
Normal: gap-3, px-4, py-2
Comfortable: gap-4, px-6, py-3
```

---

## 📦 Component Library

### 1. **Card Component**
```tsx
<div className="card">
  <div className="card-hover">
    {/* Content */}
  </div>
</div>

// CSS
.card {
  @apply bg-white border border-gray-200 rounded-lg shadow-sm;
}
.card-hover {
  @apply transition-shadow duration-200 hover:shadow-md;
}
```

### 2. **Primary Button**
```tsx
<button className="btn-primary">
  Save Changes
</button>

// CSS
.btn-primary {
  @apply px-4 py-2 bg-orange-600 text-white rounded-md 
         font-medium hover:bg-orange-700 transition-colors 
         shadow-sm;
}
```

### 3. **Secondary Button**
```tsx
<button className="btn-secondary">
  Cancel
</button>

// CSS
.btn-secondary {
  @apply px-4 py-2 bg-white text-gray-700 border 
         border-gray-300 rounded-md font-medium 
         hover:bg-gray-50 transition-colors;
}
```

### 4. **Underline Tabs** (SaaS Standard)
```tsx
<div className="flex gap-1 border-b border-gray-200">
  <button
    className={`px-4 py-2 text-sm font-medium border-b-2 
                transition-colors ${
      active 
        ? 'border-orange-600 text-orange-600'
        : 'border-transparent text-gray-600 
           hover:text-gray-900 hover:border-gray-300'
    }`}
  >
    Tab Name
  </button>
</div>
```

### 5. **Data Table**
```tsx
<div className="card overflow-hidden">
  <table className="w-full">
    <thead>
      <tr className="bg-gray-50 border-b border-gray-200">
        <th className="text-left py-3 px-4 text-xs font-medium 
                       text-gray-700 uppercase tracking-wider">
          Column
        </th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200">
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="py-3.5 px-4 text-sm font-medium text-gray-900">
          Data
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### 6. **Status Badge**
```tsx
// Available (Green)
<span className="inline-flex items-center gap-1.5 text-xs 
               font-medium text-green-700">
  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
  Available
</span>

// Unavailable (Gray)
<span className="inline-flex items-center gap-1.5 text-xs 
               font-medium text-gray-500">
  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
  Unavailable
</span>
```

### 7. **Category Badge**
```tsx
<span className="inline-flex px-2.5 py-1 text-xs font-medium 
               rounded bg-amber-100 text-amber-800">
  Breakfast
</span>
```

### 8. **Action Buttons (Table)**
```tsx
// Edit
<button className="inline-flex items-center gap-1 px-3 py-1.5 
               text-xs font-medium text-blue-700 hover:bg-blue-50 
               rounded transition-colors">
  <svg className="w-3.5 h-3.5">...</svg>
  Edit
</button>

// Delete
<button className="inline-flex items-center gap-1 px-3 py-1.5 
               text-xs font-medium text-red-700 hover:bg-red-50 
               rounded transition-colors">
  <svg className="w-3.5 h-3.5">...</svg>
  Delete
</button>
```

### 9. **Sticky Header**
```tsx
<header className="bg-white border-b border-gray-200 
                   sticky top-0 z-50 shadow-sm">
  <div className="container-app py-4">
    {/* Header content */}
  </div>
</header>
```

### 10. **Loading Spinner**
```tsx
<div className="flex flex-col items-center justify-center py-16">
  <div className="animate-spin rounded-full h-12 w-12 
                  border-b-2 border-orange-600" />
  <p className="mt-4 text-sm text-gray-600">Loading...</p>
</div>
```

### 11. **Error Message**
```tsx
<div className="card p-6 border-red-200 bg-red-50">
  <div className="flex items-start gap-3">
    <svg className="w-5 h-5 text-red-600 mt-0.5">...</svg>
    <div>
      <p className="text-sm font-medium text-red-800">
        Error message
      </p>
      <button className="mt-2 text-sm text-red-600 
                         hover:text-red-700 font-medium underline">
        Try again
      </button>
    </div>
  </div>
</div>
```

### 12. **Empty State**
```tsx
<div className="card p-12 text-center">
  <svg className="w-16 h-16 mx-auto text-gray-400 mb-4">...</svg>
  <h3 className="text-lg font-semibold text-gray-900 mb-1">
    No items yet
  </h3>
  <p className="text-sm text-gray-600">
    Description text
  </p>
</div>
```

### 13. **User Avatar**
```tsx
<div className="w-7 h-7 bg-gradient-to-br from-orange-400 
                to-orange-600 rounded-full flex items-center 
                justify-center text-white text-sm font-medium">
  {username.charAt(0).toUpperCase()}
</div>
```

---

## 🎯 Design Guidelines

### Do's ✅
- Use consistent spacing from the scale
- Stick to the color palette
- Use subtle shadows (shadow-sm, shadow-md)
- Implement smooth transitions (transition-colors)
- Keep borders minimal (border-gray-200)
- Use natural font weights (font-medium, font-semibold)

### Don'ts ❌
- No gradient backgrounds everywhere
- No backdrop-blur or glass effects
- No transform animations on hover
- No excessive emojis in UI
- No overly rounded corners (rounded-2xl)
- No heavy shadows (shadow-xl)
- No animate-bounce or spinning effects

---

## 📱 Responsive Patterns

### Hide on Mobile
```tsx
<div className="hidden sm:flex">
  {/* Visible on sm and up */}
</div>
```

### Mobile-First Layout
```tsx
<div className="px-4 sm:px-6 lg:px-8">
  {/* Responsive padding */}
</div>
```

---

## 🚀 Usage

All components follow these patterns and can be easily reused across the application. They're designed to look **professionally handcrafted** while maintaining consistency and following modern SaaS design standards.
