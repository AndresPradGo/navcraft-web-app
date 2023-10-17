import { Navigate } from "react-router-dom";

import { ContentLayout } from "./layout";
import WithSideBar from "../components/sidebar/WithSideBar";
import useAuth from "../hooks/useAuth";

const Users = () => {
  const user = useAuth();
  const userIsMaster = user && user.is_master;
  if (!userIsMaster) return <Navigate to="/flights" />;

  return (
    <WithSideBar sideBarContent="Sidebar">
      <ContentLayout>users</ContentLayout>
    </WithSideBar>
  );
};

export default Users;
