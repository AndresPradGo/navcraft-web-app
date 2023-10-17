import { ContentLayout } from "./layout";
import Table from "../components/common/table";

const flights = () => {
  const flights = [
    {
      id: 1,
      handleEdit: "flight/1",
      handleDelete: () => {},
      permissions: "open" as "open",
      route: "CZBB - CAT1",
      departure: "CZBB",
      destination: "CAT1",
      aircraft: "C-GQSS",
      date: "March 6, 2023",
      etd: "17:00 UTC",
      duration: "00d:03h:30m",
    },
    {
      id: 2,
      handleEdit: "flights/2",
      handleDelete: () => {},
      permissions: "delete" as "delete",

      route: "CYXX - CYPW",
      departure: "CYXX",
      destination: "CYPW",
      aircraft: "C-GBJD",
      date: "March 6, 2023",
      etd: "17:00 UTC",
      duration: "00d:02h:40m",
    },
  ];

  const headings = {
    route: "Route",
    aircraft: "Aircraft",
    date: "Date",
    etd: "ETD",
    duration: "Duration",
  };

  const keys = ["route", "aircraft", "date", "etd", "duration"];

  const sortData = [
    {
      title: "Departure",
      key: "departure",
    },
    {
      title: "Destination",
      key: "destination",
    },
    {
      title: "Aircraft",
      key: "aircraft",
    },
    {
      title: "Date",
      key: "date",
    },
    {
      title: "ETD",
      key: "etd",
    },
    {
      title: "Duration",
      key: "duration",
    },
  ];

  return (
    <ContentLayout sideBarContent="Sidebar">
      <Table
        tableData={{
          keys: keys,
          headers: headings,
          rows: flights,
          breakingPoint: 1000,
        }}
        sortColumnOptions={sortData}
        emptyTableMessage="There are no saved flights..."
      />
    </ContentLayout>
  );
};

export default flights;
