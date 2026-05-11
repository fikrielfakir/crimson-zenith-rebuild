import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";

createRoot(document.getElementById("root")!).render(<App />);
