import { createBrowserRouter } from "react-router-dom";

import Aircraft from "./pages/Aircraft";
import Flights from "./pages/Flights";
import Layout from "./pages/Layout";
import Users from "./pages/Users";
import Waypoints from "./pages/Waypoints";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true },
      { path: "flights", element: <Flights /> },
      { path: "waypoints", element: <Waypoints /> },
      { path: "aircraft", element: <Aircraft /> },
      { path: "users", element: <Users /> },
    ],
  },
]);

export default router;
