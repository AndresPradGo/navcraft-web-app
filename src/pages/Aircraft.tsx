import { ContentLayout } from "./layout";
import WithSideBar from "../components/sidebar/WithSideBar";

const Aircraft = () => {
  return (
    <WithSideBar sideBarContent="Sidebar">
      <ContentLayout>aircraft</ContentLayout>
    </WithSideBar>
  );
};

export default Aircraft;
