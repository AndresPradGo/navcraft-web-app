import { createBrowserRouter } from "react-router-dom";

import AircraftList from "./pages/AircraftList";
import Flights from "./pages/Flights";
import Layout from "./pages/Layout";
import Users from "./pages/Users";
import Waypoints from "./pages/Waypoints";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Flights /> },
      { path: "flights", element: <Flights /> },
      { path: "waypoints", element: <Waypoints /> },
      { path: "aircraft-list", element: <AircraftList /> },
      { path: "users", element: <Users /> },
    ],
  },
]);

export default router;
