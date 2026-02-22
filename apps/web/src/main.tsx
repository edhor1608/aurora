import { RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import { router } from "./router";
import "./styles.css";

const rootElement = document.getElementById("app");

if (!rootElement) {
  throw new Error("Web root element #app was not found");
}

ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />);
