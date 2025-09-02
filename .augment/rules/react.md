---
type: 'always_apply'
---

# React 19 Development Rules

**Strict and Specific Guidelines for React 19.1.1+ Development**

## Core Principles

### 1. React 19 Mandatory Features

- **ALWAYS** use React 19.1.1 or later - no exceptions for older versions
- **NEVER** use deprecated patterns from React 18 or earlier
- **ALWAYS** leverage new React 19 APIs when applicable
- **NEVER** implement custom solutions for problems React 19 solves natively

### 2. Component Architecture

- **ALWAYS** use function components exclusively - class components are forbidden
- **NEVER** use `React.forwardRef` - use `ref` as a prop directly
- **ALWAYS** use `<Context>` instead of `<Context.Provider>` for new code
- **NEVER** create components larger than 150 lines - split into focused components
- **ALWAYS** implement single responsibility principle per component
- **ALWAYS** handle `undefined` return values properly - React 19 allows components to return `undefined`

## Actions and State Management

### 3. Actions API (Mandatory)

- **ALWAYS** use Actions for async operations that update state
- **NEVER** manually handle pending states when Actions can do it automatically
- **ALWAYS** use `useActionState` instead of manual state management for forms
- **NEVER** use deprecated `useFormState` - migrate to `useActionState` immediately

```typescript
// ✅ CORRECT - Using Actions with form integration
const [error, submitAction, isPending] = useActionState(
  async (previousState: string | null, formData: FormData) => {
    const result = await updateData(formData.get("name") as string)
    if (result.error) return result.error
    redirect("/success")
    return null
  },
  null
)

// ✅ CORRECT - Form integration
<form action={submitAction}>
  <input type="text" name="name" />
  <button type="submit" disabled={isPending}>
    {isPending ? "Updating..." : "Update"}
  </button>
  {error && <p>{error}</p>}
</form>
```

### 4. Form Handling

- **ALWAYS** use `<form action={actionFunction}>` for form submissions
- **NEVER** use `onSubmit` handlers when Actions are applicable
- **ALWAYS** use `useFormStatus` for form state in design components
- **NEVER** prop-drill form status when `useFormStatus` is available
- **ALWAYS** use `requestFormReset` API for manual form resets

### 5. Optimistic Updates

- **ALWAYS** use `useOptimistic` for immediate UI feedback
- **NEVER** implement custom optimistic update logic
- **ALWAYS** handle automatic rollback on errors

```typescript
// ✅ CORRECT - Complete useOptimistic implementation
const [optimisticMessages, addOptimisticMessage] = useOptimistic(
  messages,
  (state, newMessage) => [{ text: newMessage, sending: true }, ...state],
);

const submitAction = async (formData: FormData) => {
  const message = formData.get('message') as string;
  addOptimisticMessage(message);

  startTransition(async () => {
    await sendMessage(message);
  });
};
```

## Resource Management

### 6. Resource Loading with `use` API

- **ALWAYS** use the `use` API for reading promises and context
- **NEVER** create promises inside render - use Suspense-compatible libraries only
- **ALWAYS** use `use` for conditional context reading after early returns
- **NEVER** use `useContext` when `use` is more appropriate
- **NEVER** call `use` in try-catch blocks - use Error Boundaries instead
- **ALWAYS** prefer `async/await` in Server Components over `use`

```typescript
// ✅ CORRECT - Using use API with proper error handling
function Comments({ commentsPromise }: { commentsPromise: Promise<Comment[]> }) {
  const comments = use(commentsPromise); // Wrapped in Suspense + ErrorBoundary
  return comments.map(comment => <p key={comment.id}>{comment.text}</p>);
}

// ✅ CORRECT - Conditional context reading
function Heading({ children }: { children: React.ReactNode }) {
  if (children == null) return null;

  const theme = use(ThemeContext); // Works after early return
  return <h1 style={{ color: theme.color }}>{children}</h1>;
}

// ❌ FORBIDDEN - use in try-catch
function BadComponent({ promise }: { promise: Promise<any> }) {
  try {
    const data = use(promise); // This will throw an error
    return <div>{data}</div>;
  } catch (error) {
    return <div>Error</div>;
  }
}
```

### 7. Resource Preloading

- **ALWAYS** use React 19 preloading APIs: `prefetchDNS`, `preconnect`, `preload`, `preinit`
- **NEVER** manually manage resource preloading when React APIs exist
- **ALWAYS** preload critical resources in components that need them

```typescript
import { prefetchDNS, preconnect, preload, preinit } from 'react-dom';

function MyComponent() {
  preinit('https://example.com/script.js', { as: 'script' });
  preload('https://example.com/font.woff', { as: 'font' });
  preload('https://example.com/styles.css', { as: 'style' });
  prefetchDNS('https://api.example.com');
  preconnect('https://cdn.example.com');
}
```

## Document Management

### 8. Metadata Handling

- **ALWAYS** use native React 19 metadata tags: `<title>`, `<link>`, `<meta>`
- **NEVER** use third-party libraries like `react-helmet` for simple metadata
- **ALWAYS** place metadata tags directly in components that need them

### 9. Stylesheet Management

- **ALWAYS** use React 19 stylesheet support with `precedence` attribute
- **NEVER** manually manage stylesheet insertion order
- **ALWAYS** co-locate stylesheets with components that depend on them

### 10. Async Scripts Support

- **ALWAYS** use React 19 native async script support
- **NEVER** manually manage script deduplication
- **ALWAYS** place async scripts in components that depend on them

```typescript
// ✅ CORRECT - Async script handling
function MyComponent() {
  return (
    <div>
      <script async src="https://example.com/analytics.js" />
      {/* Script will be deduplicated automatically */}
    </div>
  )
}
```

## TypeScript Integration

### 11. Strict TypeScript Requirements

- **NEVER** use `any` type - use proper generics or utility types
- **ALWAYS** define explicit interfaces for all props
- **ALWAYS** use strict TypeScript configuration
- **NEVER** disable TypeScript checks with `@ts-ignore`
- **ALWAYS** provide argument to `useRef` - it's now mandatory

### 12. Ref Handling

- **ALWAYS** use ref cleanup functions for proper resource management
- **NEVER** return anything other than cleanup functions from ref callbacks
- **ALWAYS** handle ref cleanup in useEffect-like patterns

```typescript
// ✅ CORRECT - Ref with cleanup
<input
  ref={(ref) => {
    if (ref) {
      const observer = new ResizeObserver(() => {});
      observer.observe(ref);

      // Return cleanup function
      return () => {
        observer.disconnect();
      };
    }
  }}
/>
```

## Performance Optimization

### 13. Deferred Values

- **ALWAYS** use `useDeferredValue` with `initialValue` for better UX
- **NEVER** implement custom debouncing when `useDeferredValue` suffices

```typescript
// ✅ CORRECT - useDeferredValue with initialValue
function Search({ query }: { query: string }) {
  const deferredQuery = useDeferredValue(query, ''); // initialValue prevents flash
  return <Results query={deferredQuery} />;
}
```

### 14. Suspense Integration

- **ALWAYS** wrap components using `use` with Suspense boundaries
- **NEVER** let Suspense boundaries be too granular or too broad
- **ALWAYS** provide meaningful fallback content
- **NEVER** ignore the default Suspense throttling - it's intentional behavior

### 15. Context Optimization

- **ALWAYS** render `<Context>` directly instead of `<Context.Provider>`
- **ALWAYS** provide `value` prop to avoid undefined context
- **NEVER** forget to wrap consumers with appropriate context providers

## Error Handling

### 16. Error Boundaries and Error Reporting

- **ALWAYS** implement error boundaries for Actions and `use` API
- **NEVER** let unhandled errors crash the application
- **ALWAYS** use React 19's improved error reporting with `onUncaughtError` and `onCaughtError`

```typescript
const root = createRoot(container, {
  onUncaughtError: (error, errorInfo) => {
    console.error('Uncaught error:', error);
  },
  onCaughtError: (error, errorInfo) => {
    console.error('Caught error:', error);
  },
});
```

### 17. Hydration

- **ALWAYS** handle hydration mismatches gracefully
- **NEVER** ignore hydration warnings - use React 19's improved diff reporting
- **ALWAYS** use React 19's single error message with diff instead of multiple errors

## Server Components

### 18. Server Component Rules

- **ALWAYS** use proper Server Component patterns when applicable
- **NEVER** mix client-side hooks in Server Components
- **ALWAYS** use Server Actions with `"use server"` directive
- **ALWAYS** leverage React 19's improved Server Component streaming
- **ALWAYS** prefer `async/await` in Server Components over `use` API

### 19. Static Site Generation

- **ALWAYS** use React DOM Static APIs for SSG: `prerender`, `prerenderToNodeStream`
- **NEVER** use deprecated `renderToString` for static generation
- **ALWAYS** leverage streaming capabilities for better performance

```typescript
// ✅ CORRECT - Using prerender for SSG
import { prerender } from 'react-dom/static';

async function handler(request) {
  const { prelude } = await prerender(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(prelude, {
    headers: { 'content-type': 'text/html' },
  });
}
```

## Custom Elements Support

### 20. Custom Elements Integration

- **ALWAYS** use React 19's native Custom Elements support
- **NEVER** manually handle Custom Element props/attributes
- **ALWAYS** leverage automatic property vs attribute detection

```typescript
// ✅ CORRECT - Custom Elements work automatically
function MyComponent() {
  return (
    <my-custom-element
      stringProp="value"        // Becomes attribute
      objectProp={{ key: 'value' }}  // Becomes property
      booleanProp={true}        // Becomes attribute
      functionProp={() => {}}   // Becomes property
    />
  );
}
```

## Migration Guidelines

### 21. Legacy Code Migration

- **ALWAYS** migrate `forwardRef` to ref props immediately
- **ALWAYS** replace `useFormState` with `useActionState`
- **ALWAYS** convert `<Context.Provider>` to `<Context>` where possible
- **NEVER** mix old and new patterns in the same codebase
- **ALWAYS** remove deprecated APIs: `propTypes`, `defaultProps` for function components

### 22. Testing Requirements

- **ALWAYS** test Actions with proper async handling
- **ALWAYS** test Suspense boundaries and fallbacks
- **ALWAYS** test error boundaries with Actions and `use` API
- **NEVER** skip testing new React 19 features
- **ALWAYS** use opt-in `act` warnings only for unit tests
- **NEVER** use `React.act` in production builds - it's not available

## Development Experience

### 23. Debugging Tools

- **ALWAYS** use React 19.1's Owner Stack for component debugging
- **ALWAYS** leverage `captureOwnerStack` in development mode for tracing render issues
- **NEVER** leave development debugging code in production builds

```typescript
// ✅ CORRECT - Owner Stack usage in development
import { captureOwnerStack } from 'react';

function MyComponent() {
  if (process.env.NODE_ENV !== 'production') {
    const ownerStack = captureOwnerStack();
    console.log('Component rendering hierarchy:', ownerStack);
  }
  // Regular component code...
}
```

## Code Quality Standards

### 24. General Rules

- **ALWAYS** use consistent naming conventions (camelCase for variables, PascalCase for components)
- **NEVER** exceed 100 characters per line
- **ALWAYS** use meaningful variable and function names
- **NEVER** leave console.log statements in production code
- **ALWAYS** handle all Promise rejections
- **NEVER** use deprecated React features
- **ALWAYS** follow the principle of least privilege
- **NEVER** expose sensitive data in client-side code
- **ALWAYS** return cleanup functions from `useEffect` when needed

---

**These rules are mandatory and non-negotiable for React 19.1.1+ development. Violations must be fixed immediately. All rules are based on official React 19.1.1 documentation and stable release features.**
