import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AppErrorBoundary from "./components/AppErrorBoundary";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId={clientId}>
        <AppErrorBoundary>
          <App />
        </AppErrorBoundary>
      </GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>,
);
