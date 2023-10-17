import { ContentLayout } from "./layout";
import WithSideBar from "../components/sidebar/WithSideBar";

const Waypoints = () => {
  return (
    <WithSideBar sideBarContent="Sidebar">
      <ContentLayout>waypoints</ContentLayout>
    </WithSideBar>
  );
};

export default Waypoints;
