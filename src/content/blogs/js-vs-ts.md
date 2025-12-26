---
title: "TypeScript vs JavaScript: What’s the Difference?"
date: "2025-12-26"
description: "Learn the real differences between TypeScript and JavaScript, including static typing, the build process, runtime behavior, and when to use each."
---

# TypeScript vs JavaScript: What’s the Difference?

If you’re building modern web applications, you’ll usually have to decide between writing raw **JavaScript** or adopting **TypeScript**. Both eventually run as JavaScript in the browser, but they differ drastically in how you write code and when errors are caught.

## What each one does

### JavaScript
JavaScript is the **core scripting language** of the web. It is dynamically typed and interpreted directly by browsers and Node.js.
- Variables can change types on the fly (e.g., a number can become a string)
- No setup is required; browsers understand it natively
- Errors are generally found **at runtime** (when the code actually runs)

### TypeScript
TypeScript is a **superset** of JavaScript created by Microsoft. It adds static syntax on top of JS.
- Adds **Type Annotations** (e.g., `string`, `number`, `interface`)
- Requires a **compiler** (tsc) to turn TypeScript into JavaScript
- Errors are found **at compile time** (while you are writing the code)

## The core difference (and why it matters)

### TypeScript enforces safety before execution
The defining feature of TypeScript is **Static Typing**.
- If you define a variable as a number, TypeScript will yell at you if you try to assign a string to it later
- This happens *before* you even save or run the file
- It provides "IntelliSense" (autocomplete), allowing your code editor to understand your data structures

### JavaScript offers flexibility at runtime
JavaScript is **Dynamically Typed**.
- You can pass any data to any function
- This makes it incredibly flexible and fast to prototype
- However, if you make a typo or pass the wrong object, the app won't crash until a user actually triggers that specific line of code

**Note:** Browsers cannot execute TypeScript. TypeScript must always be "transpiled" (compiled) down to standard JavaScript before it can run in a browser.

## Pros and cons

### JavaScript
**Pros**
- **Zero setup:** Write a `.js` file and run it in the browser immediately
- **Flexibility:** Great for small scripts or quick prototypes
- **Huge ecosystem:** Every library works natively without needing extra type definitions

**Cons**
- **Runtime errors:** You might not know a function is broken until the app crashes in production
- **Maintenance:** In large codebases, it’s hard to know exactly what data an object contains without documentation

### TypeScript
**Pros**
- **Safety:** Catches typos and type errors while you code
- **Refactoring:** You can rename a function across 100 files with confidence
- **Self-documenting:** The type definitions tell you exactly what an API expects

**Cons**
- **Complexity:** Requires a build step (configuration files like `tsconfig.json`)
- **Learning curve:** You need to learn how to define interfaces, generics, and types
- **Boilerplate:** You write more code upfront (types) to save time debugging later

## When to use which

### Use JavaScript when
- You are building a very small project or a simple script
- You are just learning the fundamentals of web development
- You need to prototype something instantly without setting up a build pipeline

### Use TypeScript when
- You are working in a team (types act as contracts between developers)
- The project is large or will be maintained for a long time
- You want robust autocomplete and refactoring tools
- You are using a modern framework like React, Angular, or Vue (which have first-class TS support)

## Code examples

### JavaScript example
In JavaScript, types are loose. This code runs, but might produce unexpected results (like "510" instead of 15) without warning.

```javascript
function add(a, b) {
  return a + b;
}

// No error warnings here, even though we are mixing types
const result = add("5", 10); 
console.log(result); // Output: "510" (String concatenation)
```

### TypeScript example
In TypeScript, types are strict. This code will fail to compile if you mix types.

```typescript
function add(a: number, b: number): number {
  return a + b;
}

// Error: Argument of type 'string' is not assignable to parameter of type 'number'
const result = add("5", 10); 
console.log(result); // Output: "510" (String concatenation)
```

## Summary

JavaScript = Flexible, runs natively in browsers, but errors catch you at runtime.

TypeScript = Strict, requires a build step, but catches errors while you write to prevent crashes later.
