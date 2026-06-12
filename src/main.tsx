import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import "./i18n/index.ts";
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";
import { loadStaticMedia } from "./lib/staticMedia";

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) ?? '';
if (API_BASE) {
  const _fetch = window.fetch.bind(window);
  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    if (typeof input === 'string' && input.startsWith('/api')) {
      input = `${API_BASE}${input}`;
    }
    return _fetch(input, init);
  };
}

loadStaticMedia().finally(() => {
  createRoot(document.getElementById("root")!).render(
    <HelmetProvider>
      <App />
    </HelmetProvider>
  );
});
