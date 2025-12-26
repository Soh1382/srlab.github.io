---
title: "BrowserRouter vs HashRouter in React"
date: "2025-12-22"
description: "Learn the real differences between BrowserRouter and HashRouter, including URL formats, refresh behavior, server setup, and when to use each."
---

If you’re using **React Router**, you’ll usually pick either **BrowserRouter** or **HashRouter**. Both handle client-side navigation, but they differ in how they build URLs and what your server needs to support.

## What each one does

### BrowserRouter
Uses the **HTML5 History API** to create clean URLs like:
- `/about`
- `/products/123`

So your full URL looks like:
- `https://example.com/about`

### HashRouter
Uses the URL **hash** (`#`) to store the route like:
- `#/about`
- `#/products/123`

So your full URL looks like:
- `https://example.com/#/about`

## The core difference (and why it matters)

### BrowserRouter depends on server support
With BrowserRouter, visiting `/about` looks like a real server path. That means:
- Clicking links in the app works fine
- But **refreshing** the page or opening `/about` directly makes the browser request `/about` from the server
- If your server isn’t configured to serve your React app for that path, you’ll get a **404**

To use BrowserRouter reliably, your server/host must route unknown requests back to your app’s `index.html` (often called an SPA fallback or rewrite rule).

### HashRouter avoids server issues
With HashRouter, everything after `#` is never sent to the server. The server only receives `/`, so:
- Refreshing `/#/about` still requests `/`
- Your app loads normally
- React Router reads the hash and shows the correct route
- No rewrites needed

## Pros and cons

### BrowserRouter
**Pros**
- Clean, modern URLs (`/about`)
- Better for sharing links that look “normal”
- Often preferable for SEO and analytics setups (clean paths)

**Cons**
- Requires server rewrites / SPA fallback
- Misconfigured hosting commonly causes refresh/direct-link 404s

### HashRouter
**Pros**
- Works on most static hosts without special configuration
- Refresh and direct links won’t 404 due to missing rewrites
- Great for demos, internal tools, or no-config deployments

**Cons**
- URLs include `#` (less clean)
- Some SEO/analytics flows may be less ideal with hash-based routing

## When to use which

### Use BrowserRouter when
- You control hosting/server config (or your platform supports SPA rewrites)
- You want clean URLs
- You’re building a production SPA with proper routing support

### Use HashRouter when
- You can’t configure rewrites (or want to avoid them)
- You’re on simple static hosting that only serves files as-is
- You want the most “it just works” setup

## Code examples

### BrowserRouter example
```tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### HashRouter example
```tsx
import { HashRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </HashRouter>
  );
}
```

## Summary

BrowserRouter = clean URLs, but needs server rewrites to prevent 404s on refresh/direct links.

HashRouter = # in the URL, but works without server configuration on most static hosts.
