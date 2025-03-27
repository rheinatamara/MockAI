import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router"; // Correct import
import { Provider as ReduxProvider } from "react-redux";
import store from "./store/index.js";

createRoot(document.getElementById("root")).render(
  <ReduxProvider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ReduxProvider>
);
