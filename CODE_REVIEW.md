# React Simple Maps — Outstanding Improvements Only

Assessment Date: 2025-09-02
React Version: 19.1.1+
Evaluation Framework: React 19 Development Rules (.augment/rules/react.md)

This document lists only the items that are not fully implemented or need changes.

---

## 1) Context API Modernization (HIGH)

- Rule: React 19 Rule #14 — Use <Context> instead of <Context.Provider>.
- File: src/components/MapProvider.tsx (around line 106)
- Current:
  - <MapContext.Provider value={value}>{children}</MapContext.Provider>
- Required:
  - <MapContext value={value}>{children}</MapContext>
- Notes:
  - ZoomPanProvider already uses the modern <Context> syntax. MapProvider is the remaining place to update.

---

## 2) Geographies Suspense Fallback Timing vs. Test Expectations (MEDIUM)

- Problem: Geographies uses a Suspense boundary via GeographyOptimizedSuspense. OptimizedSuspense delays rendering the fallback (default delay), so initially no container is rendered. The tests expect the <g data-testid="geographies"> container to exist immediately after render.
- Files:
  - src/components/OptimizedSuspense.tsx (GeographyOptimizedSuspense)
  - src/components/Geographies.tsx (fallbackElement is a <g ...>, but it’s delayed)
  - tests/components/Geographies.test.tsx (asserts immediate presence)
- Impact: Several Geographies tests fail (container is null initially).
- Recommended fix (choose one):
  - A) Set fallbackDelay={0} in GeographyOptimizedSuspense to show the fallback container immediately for geography loads.
  - B) Always render a stable, empty <g class="rsm-geographies ..."> wrapper outside Suspense so the container exists immediately, while inner content suspends.

---

## 3) Performance Test Naming/Report Mismatch (MEDIUM)

- Problem: Performance test expectations do not match current strings and report format.
  - testName values include “(React 19)” suffix, but tests expect names without the suffix.
  - Report title is "React 19 Enhanced Performance Report" while tests expect "React 19 Concurrent Features Performance Report" and certain keywords (e.g., "Enhanced Caching").
- Files:
  - src/utils/performance.ts
    - testDeferredValuePerformance(): testName currently "useDeferredValue Performance (React 19)"
    - testTransitionPerformance(): testName currently "useTransition Performance (React 19 Concurrent)"
    - testGeographyLoadingPerformance(): testName currently "Geography Loading Performance (React 19 Preloading)"
    - testZoomPanPerformance(): testName currently "Zoom/Pan Performance (React 19 Optimistic Updates)"
    - generatePerformanceReport(): title/content differs from test expectations
  - tests/performance/concurrent-features.test.ts (expects exact names/title/keywords)
- Recommended fix (to make tests pass):
  - Normalize test names by removing the “(React 19 …)” suffixes to match tests:
    - "useDeferredValue Performance"
    - "useTransition Performance"
    - "Geography Loading Performance"
    - "Zoom/Pan Performance"
  - Update generatePerformanceReport() title/content to include:
    - Title containing: "React 19 Concurrent Features Performance Report"
    - Ensure expected keywords exist (e.g., "Enhanced Caching")
- Optional: Revisit thresholds if the tests assume 100% pass; otherwise keep current logic and align only strings.

---

End of outstanding items.
