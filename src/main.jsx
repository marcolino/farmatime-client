import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.jsx"
import "./index.css"

createRoot(document.getElementById("root")).render(
  <StrictMode>{/* strictmode can be used in production too, it does not affect production builds */}
    <App />
  </StrictMode>
)
