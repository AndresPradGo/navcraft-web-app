import { ContentLayout } from "./layout";
import WithSideBar from "../components/sidebar/WithSideBar";

const Users = () => {
  return (
    <WithSideBar>
      <ContentLayout>users</ContentLayout>
    </WithSideBar>
  );
};

export default Users;
