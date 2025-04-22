import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from "./components/Error/ErrorBoundary.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import AppLayout from "./App.tsx";
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
      <BrowserRouter>
        <ErrorBoundary>
          <ThemeProvider>
            <QueryClientProvider client={queryClient}>
              <AppLayout />
            </QueryClientProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </BrowserRouter>
    </Provider>
);
