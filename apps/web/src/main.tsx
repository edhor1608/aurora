import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./styles.css";

const rootElement = document.getElementById("app");

if (!rootElement) {
  throw new Error("Web root element #app was not found");
}

ReactDOM.createRoot(rootElement).render(<App />);
