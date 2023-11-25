import { PiAirplaneInFlightDuotone } from "react-icons/pi";
import { IoAdd } from "react-icons/io5";
import { styled } from "styled-components";

import { ContentLayout } from "../layout";
import Table from "../../components/common/table";
import Button from "../../components/common/button/index";
import { Modal, useModal } from "../../components/common/modal";

const HtmlContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  text-wrap: nowrap;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const HtmlTitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 228px;

  & h1:first-of-type {
    display: flex;
    align-items: center;
    margin: 10px 0;
    font-size: 25px;
    text-wrap: wrap;
    line-height: 0.98;

    & svg {
      flex-shrink: 0;
      font-size: 40px;
      margin: 0 5px 0 0;
    }
  }

  @media screen and (min-width: 425px) {
    width: 300px;
    & h1:first-of-type {
      font-size: 35px;

      & svg {
        margin: 0 10px 0 0;
        font-size: 50px;
      }
    }
  }
`;

const AddIcon = styled(IoAdd)`
  font-size: 25px;
`;

const flights = () => {
  const modal = useModal();
  const tableData = {
    keys: ["route", "aircraft", "date", "etd", "duration"],
    headers: {
      route: "Route",
      aircraft: "Aircraft",
      date: "Date",
      etd: "ETD",
      duration: "Duration",
    },
    rows: [
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
    ],
  };
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

  const searchBarParameters = {
    placeHolder: "Search Flights",
    columnKeys: ["departure", "destination", "aircraft"],
  };

  const filterParameters = {
    text: "Filter Flights",
    filters: [
      {
        key: "departure",
        title: "Official",
        value: "Official",
      },
      {
        key: "aircraft",
        title: "User Added",
        value: "User Added",
      },
    ],
  };

  return (
    <>
      <Modal isOpen={modal.isOpen}>Form</Modal>
      <ContentLayout>
        <HtmlContainer>
          <HtmlTitleContainer>
            <h1>
              <PiAirplaneInFlightDuotone />
              Flights
            </h1>
          </HtmlTitleContainer>
        </HtmlContainer>
        <Button
          color="var(--color-primary-dark)"
          hoverColor="var(--color-grey-dark)"
          backgroundColor="var(--color-contrast)"
          backgroundHoverColor="var(--color-contrast-hover)"
          width="250px"
          height="45px"
          fontSize={18}
          shadow={true}
          spaceChildren="space-evenly"
          borderRadious={5}
          margin="50px 10px 20px"
          handleClick={() => {
            modal.handleOpen();
          }}
        >
          Add New Flight
          <AddIcon />
        </Button>
        <Table
          tableData={tableData}
          sortColumnOptions={sortData}
          pageSize={10}
          searchBarParameters={searchBarParameters}
          filterParameters={filterParameters}
          emptyTableMessage="There are no saved flights..."
        />
      </ContentLayout>
    </>
  );
};

export default flights;
