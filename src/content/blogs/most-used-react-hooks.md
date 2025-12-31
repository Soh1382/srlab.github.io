---
title: "Most Used React Hooks in 2026"
date: "2025-12-31"
description: "guide to the essential React hooks for 2026, covering classic fundamentals"
---

A pragmatic look at the hooks that actually survive contact with production.

The most expensive bug I shipped last year wasn’t a clever algorithm gone wrong. It was a `useEffect` that looked harmless in a PR, passed review, and quietly doubled our API traffic the moment a feature flag flipped on.

Nothing blew up instantly. Which, of course, made it worse — we got a slow, weird drift: extra requests, noisy logs, and a dashboard that felt “a bit sticky” after a few minutes. You know the type of incident: no single smoking gun, just a growing sense that something is… off.

React hooks didn’t cause that problem, but they made it easy to create. Hooks are power tools: brilliant when you know where the kickback is, unforgiving when you don’t.

## TL;DR

* Most teams “use” only a handful of hooks daily; the rest show up in edge cases and libraries.
* `useEffect` is for synchronising with the outside world — if it’s doing business logic, you’re likely about to suffer.
* `useMemo`/`useCallback` are optimisation tools, not a default habit; measure first, then pay the complexity tax.
* `useRef` is your escape hatch for mutable state and “latest value” problems — but it can hide bugs if you treat it as state.
* The best hook is often a custom hook that makes the boring, correct thing the easy thing.

## Table of contents

- [TL;DR](#tldr)
- [Table of contents](#table-of-contents)
- [What “most used” really means](#what-most-used-really-means)
- [useState: local state that stays local](#usestate-local-state-that-stays-local)
- [useEffect: synchronisation, not computation](#useeffect-synchronisation-not-computation)
- [useRef: the “latest value” escape hatch](#useref-the-latest-value-escape-hatch)
- [useMemo and useCallback: performance tools with a cost](#usememo-and-usecallback-performance-tools-with-a-cost)
- [useReducer: when state has rules](#usereducer-when-state-has-rules)
- [useContext: dependency injection, not a global store](#usecontext-dependency-injection-not-a-global-store)
- [useSyncExternalStore: subscribing to external state safely](#usesyncexternalstore-subscribing-to-external-state-safely)
- [Custom hooks: make correctness the default](#custom-hooks-make-correctness-the-default)
- [Hooks and AWS-backed front ends: failure modes you can’t ignore](#hooks-and-aws-backed-front-ends-failure-modes-you-cant-ignore)
  - [Timeouts and retries aren’t optional](#timeouts-and-retries-arent-optional)
  - [Correlation IDs make debugging possible](#correlation-ids-make-debugging-possible)
  - [Secure defaults: least privilege and predictable timeouts](#secure-defaults-least-privilege-and-predictable-timeouts)
  - [Observability: don’t wait until prod](#observability-dont-wait-until-prod)
- [Mini case study: the dashboard that quietly attacked its own API](#mini-case-study-the-dashboard-that-quietly-attacked-its-own-api)
- [Devil’s advocate](#devils-advocate)
- [Do this next week](#do-this-next-week)
- [Further reading](#further-reading)

## What “most used” really means

When people say “most used hooks”, they often mean “hooks I remember existing”. In practice, “most used” is about frequency in real codebases:

* Hooks you call directly in your components (`useState`, `useEffect`, `useRef`).
* Hooks you touch indirectly through libraries (a router, a form library, a data-fetching library).
* Hooks you use when you’ve already tried the obvious thing and it still hurts (`useReducer`, `useSyncExternalStore`).

Also: React keeps evolving. New hooks appear, old patterns get frowned upon, and entire app architectures shift. If you’re reading this in 2026 and thinking “wait, isn’t there a better official way now?”, you might be right — check the current React docs before you bake anything in as dogma.

## useState: local state that stays local

`useState` is still the workhorse. The trick is resisting the urge to turn every piece of information into state.

Use it when:

* The value is genuinely local to the component (or a small subtree).
* The UI needs it to render (selected tab, open/closed, input text, optimistic toggles).

Avoid it when:

* You’re mirroring props (“derived state”) without a good reason.
* You’re storing something that can be computed from existing state/props cheaply.

A clean, typed example:

```tsx
import * as React from "react";

type Status = "idle" | "loading" | "error" | "success";

export function SaveButton({ onSave }: { onSave: () => Promise<void> }) {
  const [status, setStatus] = React.useState<Status>("idle");
  const [error, setError] = React.useState<string | null>(null);

  const handleClick = async () => {
    setStatus("loading");
    setError(null);
    try {
      await onSave();
      setStatus("success");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Something went wrong");
    }
  };

  return (
    <div>
      <button onClick={handleClick} disabled={status === "loading"}>
        {status === "loading" ? "Saving…" : "Save"}
      </button>
      {status === "error" && <p role="alert">{error}</p>}
    </div>
  );
}
```

Small devil’s-advocate note: if your `useState` calls are piling up and you’re passing setters through three layers of components, the problem probably isn’t “we need more state”. It’s “we need a better boundary”.

## useEffect: synchronisation, not computation

`useEffect` is the hook people reach for when they’re not sure what else to do. That’s how you get incidents.

Use `useEffect` for:

* Talking to things outside React: network calls, subscriptions, timers, DOM APIs.
* Keeping something external in sync with React state.

Don’t use it to:

* Compute values for rendering (that’s what normal variables and memoisation are for).
* Orchestrate business logic (“when X changes, update Y and Z and then…”) unless you’re very sure about dependencies.

A practical pattern: safe fetch with cancellation, typed data, and explicit error handling.

```tsx
import * as React from "react";

type ApiResult<T> =
  | { status: "idle" | "loading"; data: null; error: null }
  | { status: "success"; data: T; error: null }
  | { status: "error"; data: null; error: string };

export function useJson<T>(url: string | null) {
  const [result, setResult] = React.useState<ApiResult<T>>({
    status: "idle",
    data: null,
    error: null,
  });

  React.useEffect(() => {
    if (!url) return;

    const controller = new AbortController();
    let cancelled = false;

    const run = async () => {
      setResult({ status: "loading", data: null, error: null });

      try {
        const res = await fetch(url, {
          method: "GET",
          signal: controller.signal,
          headers: {
            "accept": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`Request failed (${res.status})`);
        }

        const data = (await res.json()) as T;
        if (!cancelled) setResult({ status: "success", data, error: null });
      } catch (e) {
        if (controller.signal.aborted) return;
        const message = e instanceof Error ? e.message : "Unknown error";
        if (!cancelled) setResult({ status: "error", data: null, error: message });
      }
    };

    void run();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [url]);

  return result;
}
```

A few things to notice:

* Cancellation is real. Users navigate away, components unmount, and you don’t want to set state afterwards.
* The dependency list is honest. If the request depends on headers or query params, they need to be included (or intentionally stabilised).
* The result type forces the UI to handle loading/error/success explicitly.

If your effect depends on “the latest value” of something but you can’t include it in the dependency array without triggering loops, don’t “solve” it by lying in the dependency array. That’s what `useRef` is for.

## useRef: the “latest value” escape hatch

`useRef` is a funny one: it’s both a DOM handle (`ref={...}`) and a general “mutable box”.

Use cases that come up constantly:

* Referencing a DOM element (focus, measure, scroll).
* Holding a mutable value that shouldn’t cause re-renders (timeouts, sockets, “is mounted” flags).
* Reading the latest value inside callbacks without turning everything into dependencies.

The “latest value” pattern:

```tsx
import * as React from "react";

export function useLatest<T>(value: T) {
  const ref = React.useRef(value);
  React.useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref;
}
```

Then:

```tsx
const latestToken = useLatest(authToken);

const send = React.useCallback(async () => {
  // Always uses the current token, without making the callback re-create constantly.
  const token = latestToken.current;
  // ...
}, [latestToken]);
```

This is powerful, and also a great way to hide state changes from React. Treat it like nitroglycerin: useful, but don’t juggle it.

## useMemo and useCallback: performance tools with a cost

These two are often cargo-culted. You’ll see `useCallback` around every handler and `useMemo` around every object literal, “just in case”.

That “just in case” adds up:

* More code.
* More cognitive load.
* More dependency-list bugs.
* Often, no measurable benefit.

Use them when:

* You have a measured performance issue.
* You’re passing stable references to memoised children (or to a dependency that truly cares about identity).
* The computation is expensive enough to matter (and runs often enough to hurt).

A simple example: stabilising a complex options object passed to a chart component that does shallow prop checks.

```tsx
const options = React.useMemo(() => {
  return {
    showLegend: true,
    yAxisLabel: unit,
    smoothing: smoothingEnabled,
  };
}, [unit, smoothingEnabled]);
```

If you don’t know whether it matters, treat `useMemo` as suspect. Profile the component, check the React DevTools highlights, and then decide. Optimisation that isn’t paying rent is just clutter wearing a hi-vis vest.

## useReducer: when state has rules

When state transitions are more important than state values, `useReducer` keeps you sane.

Good fits:

* Forms with validation and “dirty/touched/submitting” logic.
* Wizards / multi-step flows.
* Complex UI states where “this action in this state does that” is the real story.

A reducer that stays readable:

```tsx
import * as React from "react";

type State =
  | { phase: "editing"; name: string; email: string; error: null }
  | { phase: "submitting"; name: string; email: string; error: null }
  | { phase: "error"; name: string; email: string; error: string }
  | { phase: "success"; name: string; email: string; error: null };

type Action =
  | { type: "change"; field: "name" | "email"; value: string }
  | { type: "submit" }
  | { type: "fail"; message: string }
  | { type: "succeed" }
  | { type: "reset" };

const initialState: State = { phase: "editing", name: "", email: "", error: null };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "change":
      if (state.phase === "submitting") return state; // ignore edits mid-flight
      return { ...state, [action.field]: action.value, error: null, phase: "editing" };

    case "submit":
      return { ...state, phase: "submitting", error: null };

    case "fail":
      return { ...state, phase: "error", error: action.message };

    case "succeed":
      return { ...state, phase: "success", error: null };

    case "reset":
      return initialState;
  }
}
```

The payoff isn’t magic performance. It’s clarity: fewer “how did we get here?” debugging sessions.

## useContext: dependency injection, not a global store

`useContext` is great — until it becomes “our state management solution”.

Use it for:

* App-wide dependencies: API clients, feature flag readers, auth helpers, locale, theming.
* Configuration that changes rarely.

Be cautious when:

* The context value changes frequently (every keystroke, every websocket tick).
* Lots of components read it and re-render in response.

A tidy pattern is to put *services* in context and keep *state* elsewhere:

```tsx
import * as React from "react";

type ApiClient = {
  get<T>(path: string, init?: RequestInit): Promise<T>;
  post<T>(path: string, body: unknown, init?: RequestInit): Promise<T>;
};

const ApiContext = React.createContext<ApiClient | null>(null);

export function useApi(): ApiClient {
  const api = React.useContext(ApiContext);
  if (!api) throw new Error("useApi must be used within ApiContext.Provider");
  return api;
}
```

Then your components can do:

```tsx
const api = useApi();
// api.get(...)
```

If you’re tempted to shove a big, mutable app state object into context, ask yourself what you’re really building. A store? A subscription system? If yes, you might want a tool designed for that, or at least `useSyncExternalStore`.

## useSyncExternalStore: subscribing to external state safely

Most teams meet `useSyncExternalStore` indirectly (via state libraries), but it’s worth knowing what it’s for: subscribing to data sources that live outside React while keeping rendering consistent.

It’s useful when you have:

* A global store with subscriptions.
* A “source of truth” that isn’t React state (for good reasons), and you need React to read it reliably.

A minimal (toy) example:

```tsx
import * as React from "react";

type Listener = () => void;

function createStore<T>(initial: T) {
  let value = initial;
  const listeners = new Set<Listener>();

  return {
    get: () => value,
    set: (next: T) => {
      value = next;
      listeners.forEach((l) => l());
    },
    subscribe: (listener: Listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

const authStore = createStore<string | null>(null);

export function useAuthToken() {
  return React.useSyncExternalStore(authStore.subscribe, authStore.get, authStore.get);
}
```

If you don’t already have an external store, don’t create one just to feel modern. But if you *do* have one (or a library does), this hook is the right bridge.

## Custom hooks: make correctness the default

The most “used hook” in any mature codebase is often a custom one — because teams wrap sharp edges.

Common candidates:

* `useDebouncedValue` (search boxes without spamming APIs)
* `useEvent`/`useLatest` patterns (stable callbacks with fresh values)
* `useQueryParam` (URL state that doesn’t fight the router)
* `useInterval` (timers without stale closures)

Here’s a `useDebouncedValue` that keeps behaviour obvious:

```tsx
import * as React from "react";

export function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(id);
  }, [value, delayMs]);

  return debounced;
}
```

And here’s the point: once you have a good custom hook, you can standardise behaviour (timeouts, aborts, error mapping, correlation IDs) across the app. That’s how you stop re-learning the same incident every quarter.

## Hooks and AWS-backed front ends: failure modes you can’t ignore

Most React hooks posts stop at “here is a counter component”. That’s fine for learning, but production front ends spend their lives negotiating with networks, edge caches, and services that fail in creative ways.

A few realities that change how you write hooks:

### Timeouts and retries aren’t optional

Browsers don’t give you a default request timeout. Your hook should.

If you’re using `fetch`, consider wrapping it:

```tsx
export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit & { timeoutMs: number }
) {
  const controller = new AbortController();
  const id = window.setTimeout(() => controller.abort(), init.timeoutMs);

  try {
    const res = await fetch(input, { ...init, signal: controller.signal });
    return res;
  } finally {
    window.clearTimeout(id);
  }
}
```

Retries are trickier: retrying a `GET` is usually OK; retrying a `POST` can duplicate work unless your backend is idempotent.

On AWS, that usually means:

* Design endpoints so repeated requests don’t create duplicate writes (idempotency keys).
* Use DynamoDB conditional writes or Postgres constraints to enforce it server-side.
* Return a stable response for repeated requests where sensible.

### Correlation IDs make debugging possible

When a user says “the page spun forever”, you want to follow the thread from browser to API Gateway to Lambda to database without guessing.

A simple approach:

* Generate a `requestId` per user action in the browser.
* Send it in a header (e.g. `x-correlation-id`).
* Log it on the backend and include it in structured logs.

Your hook can enforce that consistently.

### Secure defaults: least privilege and predictable timeouts

If you’re building the backend yourself, CDK v2 makes it easy to do the right thing. Here’s a small sketch of an API-backed Lambda with least-privilege DynamoDB access and explicit timeouts. (Check current AWS docs for exact properties and best practices, because these details do evolve.)

```ts
import * as cdk from "aws-cdk-lib";
import { Duration } from "aws-cdk-lib";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as iam from "aws-cdk-lib/aws-iam";

export class ApiStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, "Items", {
      partitionKey: { name: "pk", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      pointInTimeRecovery: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    const fn = new lambda.Function(this, "GetItemFn", {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("lambda/get-item"),
      timeout: Duration.seconds(10),
      memorySize: 256,
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    fn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["dynamodb:GetItem"],
        resources: [table.tableArn],
      })
    );

    const api = new apigw.RestApi(this, "ItemsApi", {
      deployOptions: {
        // Logging/metrics here depends on your standards; check current AWS docs.
        tracingEnabled: true,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigw.Cors.ALL_ORIGINS, // tighten this for real apps
        allowMethods: ["GET", "OPTIONS"],
      },
    });

    api.root.addResource("items").addMethod("GET", new apigw.LambdaIntegration(fn));
  }
}
```

On the front end, your hooks should assume the backend will sometimes:

* Return errors (4xx/5xx).
* Be slow.
* Be cached in surprising ways.
* Be deployed mid-session.

So your UI needs: loading states, cancellation, safe retries where appropriate, and a way to recover without a hard refresh.

### Observability: don’t wait until prod

In practice, you want:

* Client-side error reporting (whatever your org uses).
* Basic performance markers around expensive renders or network calls.
* Server logs structured enough to answer “what happened?” without archaeology.

A boring but effective pattern is to log one line per user action (client-side) and one line per request (server-side), both carrying the same correlation ID.

## Mini case study: the dashboard that quietly attacked its own API

We had an internal dashboard that displayed queue health, recent jobs, and a couple of charts. It wasn’t glamorous, but it was always open on someone’s second monitor — the exact kind of thing that turns a small inefficiency into an all-day drain.

We got it wrong at first.

The original implementation did something like:

* `useEffect` fetches the summary.
* Another `useEffect` fetches chart data.
* A third `useEffect` refetches when filters change.
* A “refresh” button flips state that triggers all of the above again.

In review, it looked fine. In reality, a couple of subtle issues combined:

* One effect depended on an object literal (`{ from, to, env }`), so it re-ran more often than we thought.
* We were updating a `lastUpdated` timestamp in state, which was included in a dependency list elsewhere.
* We had a naive retry in the client, and a caching layer at the edge that sometimes returned stale responses. Users hit refresh, saw old data, hit refresh again…

The result wasn’t an outage, but it was noisy and expensive: unnecessary requests, duplicate work, and a UI that felt unpredictable.

What fixed it:

* We created a single custom hook (`useDashboardData`) that owned fetching, cancellation, and a refresh trigger.
* We stabilised inputs properly (`useMemo` for filter objects *only where it mattered*).
* We made refresh idempotent and explicit: one user action → one request set.
* We added correlation IDs and logged them end-to-end. That alone cut debugging time dramatically.
* We built a “stale data” banner so the UI could admit uncertainty instead of pretending.

The lesson wasn’t “use fewer hooks”. It was “make the data flow legible, then enforce it with a hook”.

## Devil’s advocate

Hooks are not a universal solvent. A few cases where the usual hook-heavy approach is the wrong fit:

* **Highly interactive canvas/visualisation work**: if you’re doing custom rendering loops, you may be better off treating React as a shell and letting the visual layer manage its own lifecycle. Trying to wedge every frame into React state is a good way to invent jank.
* **Simple forms with minimal logic**: uncontrolled inputs and straightforward submit handlers can be clearer than a reducer-driven state machine. If you don’t need live validation and complex transitions, don’t build them.
* **Context as a store**: if you’re pushing frequently-changing values through context, you can cause broad re-renders and hard-to-predict performance issues. Use a dedicated store/subscription approach instead.
* **Premature memoisation everywhere**: `useMemo`/`useCallback` can make code harder to read and still not fix the real bottleneck. Measure, then optimise the hottest path.
* **Business rules hidden in effects**: if correctness matters (it does), burying rules in `useEffect` chains makes behaviour fragile. Consider moving logic into pure functions, reducers, or backend validation.

## Do this next week

1. **Audit `useEffect` usage**: for each effect, write a one-line comment describing the external thing it synchronises with. If you can’t, it probably shouldn’t be an effect.
2. **Ban “lying dependencies”** in review: no disabled lint rules or missing dependencies without a clear explanation and an alternative (often `useRef`/`useLatest`).
3. **Introduce one “golden path” data hook** for your app (or one feature): cancellation, timeout, error mapping, correlation ID, and an explicit `refresh()` API.
4. **Standardise request timeouts** in the browser. Pick a sane default for your app and make exceptions explicit.
5. **Define idempotency rules** for any mutating endpoints you call frequently. If retries are possible, the backend must be safe.
6. **Add correlation IDs** from UI action → API call → server logs. Make it easy to copy one ID into your log search.
7. **Set a rule of thumb for memoisation**: don’t add `useMemo`/`useCallback` without either (a) measured evidence or (b) a specific identity-sensitive dependency that benefits.
8. **Replace one “prop drilling” chain** with context for a service (API client, feature flags, auth helpers). Keep state out of it unless it’s stable.
9. **Write two small custom hooks** that remove repeated code (a debounced value, a safe interval, a “latest ref”, etc.). Document them with examples.
10. **Add a rollback-friendly deployment habit**: feature flags for risky UI changes, and a clear path to disable new fetching behaviour without redeploying.
11. **Create a failure-mode checklist** for new screens: loading, empty, error, slow, cancelled, partial data, and “backend deployed mid-session”.
12. **Do a 30-minute profiling session** on the busiest screen and write down what actually re-renders and why. Fix one thing; don’t start a performance crusade.

## Further reading

* React documentation on hooks and effects (check the current docs)
* React docs on state management and context guidance (check the current docs)
* Guidance on request cancellation and `AbortController` in browsers
* Patterns for idempotent APIs and safe retries
* AWS documentation for API Gateway + Lambda timeouts, retries, and observability (check current AWS docs)
* Your organisation’s standards for logging, correlation IDs, and client-side error reporting
* Postmortems/write-ups about runaway effects, polling, and accidental request storms

The boring truth is that most hook problems aren’t “we chose the wrong hook”. They’re “we didn’t decide what the data flow should be, so the code decided for us”. Decide it on purpose, wrap it in a couple of sharp custom hooks, and you’ll ship fewer surprises — and spend less time staring at a spinner that’s quietly doing something you didn’t mean.