import "@testing-library/jest-dom/vitest";

// jsdom lacks the observers framer-motion's whileInView / layout features rely on.
class ObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
if (!("IntersectionObserver" in globalThis)) {
  globalThis.IntersectionObserver = ObserverStub as unknown as typeof IntersectionObserver;
}
if (!("ResizeObserver" in globalThis)) {
  globalThis.ResizeObserver = ObserverStub as unknown as typeof ResizeObserver;
}

Object.defineProperty(window, "scrollTo", {
  writable: true,
  value: () => {},
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});
