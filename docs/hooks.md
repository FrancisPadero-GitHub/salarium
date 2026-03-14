Think of React performance as a balance between **rendering** (generating the UI) and **reconciliation** (figuring out what changed). Most "bottlenecks" happen because React is doing more work than necessary.

Here is your master guide to the performance toolkit.

---

## 1. The "Big Three" Hooks

### `useMemo`: Memoize a **Value**

Use this when you have a complex calculation that doesn't need to run on every single render.

- **The Trap:** Don't use it for simple math (like $2 + 2$). The overhead of the hook is more expensive than the calculation.
- **The Use Case:** Filtering a massive list or processing data.

```javascript
const filteredData = useMemo(() => {
  return expensiveSearch(data, query);
}, [data, query]); // Only re-runs if data or query change
```

### `useCallback`: Memoize a **Function**

Functions in JavaScript are objects. Every time a component renders, a new function is created. If you pass that function to a child component, the child thinks the props changed and re-renders.

- **The Use Case:** Passing functions to components wrapped in `React.memo`.

```javascript
const handleSave = useCallback(() => {
  console.log("Saving...", id);
}, [id]); // Function identity stays the same unless 'id' changes
```

### `useRef`: The "Escape Hatch"

`useRef` holds a value that persists between renders but **does not trigger a re-render** when it changes.

- **The Use Case:** Storing a timer ID, a DOM element, or a "previous value" without causing a visual update.

---

## 2. Higher-Order Optimization: `React.memo`

Hooks optimize _logic_, but `React.memo` optimizes the **Component** itself. It tells React: "Only re-render this component if its props have actually changed."

```javascript
const ChildComponent = React.memo(({ name }) => {
  console.log("Rendered!");
  return <div>{name}</div>;
});
```

---

## 3. External Performance Tweaks

### Debouncing (Wait for the pause)

Used for search inputs or window resizing. It delays the execution of a function until after a specific amount of time has passed since the last call.

- **Why:** You don't want to fire an API call for every single keystroke.

```javascript
// Using a library like lodash or a custom hook
const debouncedSearch = debounce((query) => {
  fetchResults(query);
}, 300);
```

### Throttling (Limit the rate)

Limits how often a function can run. If a user scrolls, you might only want to run a scroll handler once every **100ms**, even if the event fires 50 times.

---

## 4. Advanced "Secret" Tweaks

### State Colocation

Move state as close to where it is used as possible.

- **Bad:** Putting "Search Input Text" in the Global App State (the whole app re-renders on every letter).
- **Good:** Keeping it inside the SearchBar component.

### Transition API (`useTransition`)

Introduced in React 18, this allows you to mark a state update as **non-urgent**. It keeps the UI responsive while a heavy update happens in the background.

```javascript
const [isPending, startTransition] = useTransition();

const handleChange = (e) => {
  // Urgent: Update the input field immediately
  setInputValue(e.target.value);

  // Non-urgent: Update the heavy list in the background
  startTransition(() => {
    setList(filterHeavyData(e.target.value));
  });
};
```

---

## The Performance Strategy Checklist

1. **Measurement first:** Use the Profiler. Don't optimize what isn't slow.
2. **Fix Prop Drilling:** Use Context or Zustand, but be careful of "Mega-Contexts" that re-render everything.
3. **Virtualization:** If rendering a list of 1,000+ items, use a library like `react-window` or `tanstack-virtual`. It only renders the items currently on screen.
4. **Lazy Loading:** Use `React.lazy()` and `Suspense` to split your code so users only download what they need.

**Would you like me to create a "Debounce" hook from scratch for you to use in your project?**
