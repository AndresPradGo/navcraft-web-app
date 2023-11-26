import { PiAirplaneInFlightDuotone } from "react-icons/pi";
import { IoAdd } from "react-icons/io5";
import { styled } from "styled-components";

import { ContentLayout } from "../layout";
import Table from "../../components/common/table";
import Button from "../../components/common/button/index";
import { Modal, useModal } from "../../components/common/modal";
import AddFlightForm from "./AddFlightForm";
import useAircraftDataList from "../../hooks/useAircraftDataList";
import Loader from "../../components/Loader";
import useAerodromesData from "../../hooks/useAerodromesData";
import useFlightsList from "./useFlightsList";
import formatUTCDate from "../../utils/formatUTCDate";
import formatUTCTime from "../../utils/formatUTCTime";

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
  const {
    data: aircraftList,
    isLoading: aircraftListIsLoading,
    error: aircraftListError,
  } = useAircraftDataList(true);

  const {
    data: aerodromes,
    isLoading: aerodromesIsLoading,
    error: aerodromesError,
  } = useAerodromesData();

  const {
    data: flights,
    isLoading: flightsIsLoading,
    error: flightsError,
  } = useFlightsList();

  if (flightsIsLoading || aircraftListIsLoading || aerodromesIsLoading)
    return <Loader />;
  if (flightsError || aircraftListError || aerodromesError) throw new Error("");

  const tableData = {
    keys: ["route", "aircraft", "date", "etd", "duration", "waypoints"],
    headers: {
      route: "Route",
      aircraft: "Aircraft",
      date: "Date",
      etd: "ETD",
      waypoints: "Waypoints",
    },
    rows:
      flights && aerodromes && aircraftList
        ? flights.map((flight) => {
            const departure =
              aerodromes.find((a) => a.id === flight.departure_aerodrome_id)
                ?.code || "";
            const arrival =
              aerodromes.find((a) => a.id === flight.arrival_aerodrome_id)
                ?.code || "";
            const aircraft =
              aircraftList.find((a) => a.id === flight.aircraft_id)
                ?.registration || "";

            const waypoints = flight.legs
              .filter((l) => !!l.waypoint)
              .map((l) => l.waypoint?.code || "");

            return {
              id: flight.id,
              route: `${departure} - ${arrival}`,
              departure: departure,
              destination: arrival,
              aircraft: aircraft,
              date: formatUTCDate(flight.departure_time),
              dateSort: flight.departure_time,
              etd: formatUTCTime(flight.departure_time),
              waypoints: waypoints.length > 0 ? waypoints.join(", ") : "-",
              handleEdit: `flight/${flight.id}`,
              handleDelete: () => {},
              permissions: "open-delete" as "open-delete",
            };
          })
        : [],
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
      key: "dateSort",
    },
    {
      title: "ETD",
      key: "etd",
    },
  ];

  const searchBarParameters = {
    placeHolder: "Search Flights",
    columnKeys: ["departure", "destination", "aircraft", "waypoints"],
  };

  const flightsAircraft = flights.map((f) => {
    const registration =
      aircraftList.find((a) => a.id === f.aircraft_id)?.registration || "";
    return {
      key: "aircraft",
      title: `Aircraft: ${registration}`,
      value: registration,
    };
  });

  const departures = flights.map((f) => {
    const code =
      aerodromes.find((a) => a.id === f.departure_aerodrome_id)?.code || "";
    return {
      key: "departure",
      title: `Departure: ${code}`,
      value: code,
    };
  });

  const destinations = flights.map((f) => {
    const code =
      aerodromes.find((a) => a.id === f.arrival_aerodrome_id)?.code || "";
    return {
      key: "destination",
      title: `Destination: ${code}`,
      value: code,
    };
  });

  const filterParameters = {
    text: "Filter Flights",
    filters: [...departures, ...destinations, ...flightsAircraft],
  };

  return (
    <>
      <Modal isOpen={modal.isOpen} fullHeight={true}>
        <AddFlightForm closeModal={modal.handleClose} isOpen={modal.isOpen} />
      </Modal>
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
