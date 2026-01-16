---
name: Todo App React Vite
overview: Build a Todo app with React and Vite, featuring CRUD operations and local storage persistence. The app will follow the design mock pixel-perfect and maintain separation of concerns with clear boundaries between data layer, business logic, and UI components.
todos: []
---

# Todo App Implementation Plan

## Design Reference

Use the design mock as the UI target:

![Todo app design mock](./design.png)

## Architecture Overview

The app will follow separation of concerns with three main layers:

1. **Data Layer**: Local storage service for persistence
2. **Business Logic Layer**: Custom hooks for todo operations
3. **Presentation Layer**: React components for UI

## Project Structure

```
shouldweusereact/
└── reactapp/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx
    │   ├── index.css (styles matching design)
    │   ├── services/
    │   │   └── localStorage.js (data persistence layer)
    │   ├── hooks/
    │   │   └── useTodos.js (business logic layer)
    │   └── components/
    │       ├── TodoList.jsx (list container)
    │       ├── TodoItem.jsx (individual todo display/edit)
    │       ├── TodoForm.jsx (add/edit form)
    │       └── TodoFilters.jsx (optional: filter by date/status)
```

## Implementation Details

### 1. Project Setup

- Create `reactapp` folder in project root
- Initialize Vite project with React template inside `reactapp`
- Configure `reactapp/package.json` with React and Vite only
- Set up `reactapp/index.html` entry point
- Create base CSS reset and typography matching design

### 2. Data Layer (`reactapp/src/services/localStorage.js`)

- `getTodos()`: Retrieve todos from localStorage
- `saveTodos(todos)`: Persist todos to localStorage
- `STORAGE_KEY`: Constant for localStorage key
- Handle JSON parsing errors gracefully
- Return empty array if no data exists

### 3. Business Logic Layer (`reactapp/src/hooks/useTodos.js`)

Custom hook managing todo state and operations:

- `todos`: State array of todo objects
- `addTodo(todo)`: Add new todo (name, description?, limitDate)
- `updateTodo(id, updates)`: Update existing todo
- `deleteTodo(id)`: Remove todo
- `loadTodos()`: Load from localStorage on mount
- Auto-save to localStorage on state changes

Todo object structure:

```javascript
{
  id: string (timestamp-based),
  name: string,
  description: string | null,
  limitDate: string (ISO date),
  completed: boolean,
  createdAt: string (ISO date)
}
```

### 4. UI Components

#### `App.jsx`

- Main container component
- Uses `useTodos` hook
- Renders `TodoForm` and `TodoList`
- Handles layout structure

#### `TodoForm.jsx`

- Form for adding/editing todos
- Fields: name (required), description (optional textarea), limitDate (date input)
- Submit handler calls `addTodo` or `updateTodo`
- Validation for required fields
- Form layout matching design

#### `TodoList.jsx`

- Displays list of todos
- Maps over todos array
- Renders `TodoItem` for each todo
- Empty state when no todos
- Grid/list layout matching design

#### `TodoItem.jsx`

- Individual todo card/item
- Shows name, description (if exists), limitDate
- Edit mode toggle (inline editing)
- Delete button
- Complete/checkbox toggle
- Date formatting (relative dates: "Today", "Tomorrow", or formatted date)
- Visual indicators for overdue/upcoming dates

### 5. Styling (`reactapp/src/index.css`)

Pixel-perfect implementation of design mock:

- Match design exactly (colors, spacing, typography, layout)
- Typography matching design specifications
- Color scheme from design
- Card-based layout for todos as shown in design
- Button sizes and styles matching design
- Smooth transitions and hover states
- Flexbox/Grid for layout as specified in design

### 6. Features

**Add Todo:**

- Form with name (required), description (optional), limitDate
- Validation feedback
- Clear form after submission

**Edit Todo:**

- Click todo item to enter edit mode
- Inline editing preserves all fields
- Save/Cancel buttons

**Delete Todo:**

- Delete button on each todo item
- Confirmation (optional: simple confirm dialog)

**Persistence:**

- Auto-save to localStorage on any change
- Load todos on app initialization
- Handle localStorage errors gracefully

**Pixel-Perfect Design:**

- Match design mock exactly
- Consistent layout as specified in design
- Exact colors, spacing, and typography from design

## File Changes

1. **New files:**

   - `reactapp/package.json` - Dependencies (React, Vite, ReactDOM)
   - `reactapp/vite.config.js` - Vite configuration
   - `reactapp/index.html` - HTML entry point
   - `reactapp/src/main.jsx` - React entry point
   - `reactapp/src/App.jsx` - Main app component
   - `reactapp/src/index.css` - Global styles
   - `reactapp/src/services/localStorage.js` - Data persistence
   - `reactapp/src/hooks/useTodos.js` - Business logic
   - `reactapp/src/components/TodoList.jsx` - List container
   - `reactapp/src/components/TodoItem.jsx` - Individual todo
   - `reactapp/src/components/TodoForm.jsx` - Add/edit form

2. **Update:**

   - `.gitignore` - Add reactapp/node_modules, reactapp/dist, etc.

## Technical Decisions

- **ID Generation**: Use `Date.now().toString()` or `crypto.randomUUID()` if available
- **Date Handling**: Store dates as ISO strings, use native Date API for formatting
- **State Management**: React useState/useEffect hooks (no external state library)
- **Form Handling**: Controlled components with React state
- **Error Handling**: Try-catch blocks around localStorage operations
- **Accessibility**: Semantic HTML, ARIA labels where needed, keyboard navigation

## Testing Considerations

- Manual testing checklist:
  - Add todo with all fields
  - Add todo with only name
  - Edit todo
  - Delete todo
  - Refresh page (persistence check)
  - Verify pixel-perfect match with design mock
