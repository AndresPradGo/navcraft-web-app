import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "./login";

const MasterRoutes = () => {
  const user = useAuth();
  const userIsMaster = user && user.is_master;
  if (!userIsMaster) return <Navigate to="/notFound" />;

  return <Outlet />;
};

export default MasterRoutes;
