import ContentLayout from "./ContentLayout";
import WithSideBar from "../components/sidebar/WithSideBar";

const flights = () => {
  return (
    <WithSideBar>
      <ContentLayout>Flights</ContentLayout>
    </WithSideBar>
  );
};

export default flights;
