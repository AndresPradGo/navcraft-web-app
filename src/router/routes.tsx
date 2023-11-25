import { createBrowserRouter, Navigate } from "react-router-dom";

import AircraftListPage from "../pages/aircraftListPage";
import Flights from "../pages/flights/Flights";
import Layout from "../pages/layout";
import Profile from "../pages/profile";
import Users from "../pages/users/Users";
import Waypoints from "../pages/waypoints";
import ErrorPage from "../pages/ErrorPage";
import LoginPage from "../pages/login";
import MasterRoutes from "../pages/MasterRoutes";
import RegisterPage from "../pages/register/index";
import AerodromePage from "../pages/aerodromePage";
import AircraftPage from "../pages/aircraftPage";
import PerformanceProfilePage from "../pages/performanceProfilePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Navigate to="/flights" /> },
      { path: "aircraft", element: <AircraftListPage /> },
      { path: "aircraft/:id", element: <AircraftPage /> },
      {
        path: "aircraft/:aircraftId/profile/:id",
        element: <PerformanceProfilePage />,
      },
      {
        path: "aircraft/model/:id",
        element: <PerformanceProfilePage />,
      },
      { path: "flights", element: <Flights /> },
      { path: "profile", element: <Profile /> },
      { path: "waypoints", element: <Waypoints /> },
      { path: "waypoints/private-aerodrome/:id", element: <AerodromePage /> },
      { path: "waypoints/aerodrome/:id", element: <AerodromePage /> },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
    errorElement: <ErrorPage />,
  },
  {
    element: <MasterRoutes />,
    children: [
      {
        path: "/",
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [{ path: "users", element: <Users /> }],
      },
    ],
  },
]);

export default router;
