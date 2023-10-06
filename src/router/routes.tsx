import { createBrowserRouter, Navigate } from "react-router-dom";

import Aircraft from "../pages/Aircraft";
import Flights from "../pages/Flights";
import Layout from "../pages/layout";
import Users from "../pages/Users";
import Waypoints from "../pages/Waypoints";
import ErrorPage from "../pages/ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Navigate to="/flights" /> },
      { path: "flights", element: <Flights /> },
      { path: "waypoints", element: <Waypoints /> },
      { path: "aircraft", element: <Aircraft /> },
      { path: "users", element: <Users /> },
    ],
  },
]);

export default router;
