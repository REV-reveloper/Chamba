import { createBrowserRouter } from "react-router";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { ProviderProfile } from "./pages/ProviderProfile";
import { Chat } from "./pages/Chat";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "dashboard", Component: Dashboard },
      { path: "provider/:id", Component: ProviderProfile },
      { path: "chat/:id", Component: Chat },
    ],
  },
]);
