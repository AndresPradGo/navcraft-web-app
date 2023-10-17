import { Navigate } from "react-router-dom";

import { ContentLayout } from "./layout";
import useAuth from "../hooks/useAuth";

const Users = () => {
  const user = useAuth();
  const userIsMaster = user && user.is_master;
  if (!userIsMaster) return <Navigate to="/flights" />;

  return <ContentLayout sideBarContent="Sidebar">users</ContentLayout>;
};

export default Users;
