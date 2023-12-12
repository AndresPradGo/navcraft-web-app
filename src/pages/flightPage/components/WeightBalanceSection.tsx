import { useQueryClient } from "@tanstack/react-query";
import _ from "lodash";
import { styled } from "styled-components";

import { WeightBalanceReportType } from "../hooks/useWeightBalanceReport";
import useWeightBalanceData from "../../../hooks/useWeightBalanceData";
import WeightBalanceGraph from "../../../components/WeightBalanceGraph";
import Loader from "../../../components/Loader";
import Table from "../../../components/common/ExpandibleTable";
import usePersonsOnBoard from "../hooks/usePersonsOnBoard";
import useLuggage from "../hooks/useLuggage";
import useFuelOnBoard from "../hooks/useFuelOnBoard";
import useAircraftArrangementData from "../../../hooks/useAircraftArrangementData";

const HtmlLoaderContainer = styled.div`
  margin: 35px 0 0;
  align-self: center;
  width: 100%;
`;

interface Props {
  profileId: number;
  flightId: number;
  isLoading: boolean;
}

const WeightBalanceSection = ({ profileId, flightId, isLoading }: Props) => {
  const queryClient = useQueryClient();
  const weightBalanceData = queryClient.getQueryData<WeightBalanceReportType>([
    "weightBalanceReport",
    flightId,
  ]);

  const {
    data: personsOnBoard,
    error: personsOnBoardError,
    isLoading: personsOnBoardLoading,
  } = usePersonsOnBoard(flightId);

  const {
    data: luggage,
    error: luggageError,
    isLoading: luggageLoading,
  } = useLuggage(flightId);

  const {
    data: fuelOnBoard,
    error: fuelOnBoardError,
    isLoading: fuelOnBoardLoading,
  } = useFuelOnBoard(flightId);

  const {
    data: aircraftWeightBalanceData,
    error: aircraftWeightBalanceError,
    isLoading: aircraftWeightBalanceLoading,
  } = useWeightBalanceData(profileId);

  const {
    data: arrangementData,
    error: arrangementError,
    isLoading: arrangementLoading,
  } = useAircraftArrangementData(profileId);

  if (
    aircraftWeightBalanceError ||
    personsOnBoardError ||
    arrangementError ||
    luggageError ||
    fuelOnBoardError
  )
    throw new Error("");
  if (
    aircraftWeightBalanceLoading ||
    personsOnBoardLoading ||
    arrangementLoading ||
    luggageLoading ||
    fuelOnBoardLoading
  )
    return (
      <HtmlLoaderContainer>
        <Loader />
      </HtmlLoaderContainer>
    );

  const profiles = aircraftWeightBalanceData
    ? aircraftWeightBalanceData.weight_balance_profiles.map((profile) => {
        const orderLimits = _.orderBy(profile.limits, ["sequence"], ["asc"]);

        return {
          name: profile.name,
          limits: orderLimits.map((limit) => ({
            cg_location_in: limit.cg_location_in,
            weight_lb: Math.round(limit.weight_lb * 100) / 100000,
            label: `(${limit.cg_location_in}, ${
              Math.round(limit.weight_lb * 100) / 100000
            })`,
          })),
        };
      })
    : [];

  const seats = [];
  for (const row of arrangementData.seat_rows || []) {
    for (let i = 1; i <= row.number_of_seats; i++) {
      seats.push({
        id: row.id,
        seatNumber: i,
        seatRow: row.name,
        name: row.number_of_seats === 1 ? row.name : `${row.name} Seat ${i}`,
        arm_in: row.arm_in,
      });
    }
  }
  const seatsTableData = {
    keys: ["seat", "name", "weight_lb", "arm_in", "moment_lb_in"],
    headers: {
      seat: "Seat",
      name: "Name",
      weight_lb: "Weight [lb]",
      arm_in: "Arm [in]",
      moment_lb_in: "Moment [lb-in]",
    },
    rows: seats.map((seat) => {
      const person = personsOnBoard.find(
        (p) => p.seat_row_id === seat.id && p.seat_number === p.seat_number
      );
      return {
        id: seat.id + seat.seatNumber / 10,
        name: person ? person.name : "-",
        seat: seat.name,
        seatRow: seat.seatRow,
        weight_lb: person ? person.weight_lb : 0,
        arm_in: seat.arm_in,
        moment_lb_in:
          Math.round(seat.arm_in * (person ? person.weight_lb : 0) * 100) / 100,
        handleEdit: () => {},
        handleDelete: () => {},
        permissions: "edit" as "edit",
      };
    }),
    breakingPoint: 1024,
  };
  const seatsSortData = [
    {
      title: "Arm",
      key: "arm_in",
    },
    {
      title: "Seat",
      key: "seat",
    },
    {
      title: "Name",
      key: "name",
    },
    {
      title: "Weight",
      key: "weight_lb",
    },
  ];
  const seatsFilterData = {
    text: "Filter by Seat Rows",
    filters: arrangementData.seat_rows
      .filter((row) => row.number_of_seats >= 2)
      .map((row) => ({
        key: "seatRow",
        value: row.name,
        title: row.name,
      })),
  };

  const luggageTableData = {
    keys: ["compartment", "weight_lb", "arm_in", "moment_lb_in"],
    headers: {
      compartment: "Compartment",
      weight_lb: "Weight [lb]",
      arm_in: "Arm [in]",
      moment_lb_in: "Moment [lb-in]",
    },
    rows: arrangementData.baggage_compartments.map((item) => {
      const weight = luggage.reduce(
        (total, bag) =>
          (total += bag.baggage_compartment_id === item.id ? bag.weight_lb : 0),
        0
      );
      return {
        id: item.id,
        compartment: item.name,
        weight_lb: weight,
        arm_in: item.arm_in,
        moment_lb_in: Math.round(item.arm_in * weight * 100) / 100,
        handleEdit: () => {},
        handleDelete: () => {},
        permissions: "edit" as "edit",
      };
    }),
    breakingPoint: 1024,
  };
  const luggageSortData = [
    {
      title: "Arm",
      key: "arm_in",
    },
    {
      title: "Compartment",
      key: "compartment",
    },
    {
      title: "Weight",
      key: "weight_lb",
    },
  ];

  const fuelOnBoardTableData = {
    keys: ["tank", "gallons", "weight_lb", "arm_in", "moment_lb_in"],
    headers: {
      tank: "Tank",
      gallons: "Gallons",
      weight_lb: "Weight [lb]",
      arm_in: "Arm [in]",
      moment_lb_in: "Moment [lb-in]",
    },
    rows: arrangementData.fuel_tanks.map((tank) => {
      const fuel = fuelOnBoard.find((item) => item.fuel_tank_id === tank.id);
      return {
        id: tank.id,
        tank: tank.name,
        gallons: fuel ? fuel.gallons : 0,
        weight_lb: fuel ? fuel.weight_lb : 0,
        arm_in: tank.arm_in,
        moment_lb_in:
          Math.round(tank.arm_in * (fuel ? fuel.weight_lb : 0) * 100) / 100,
        handleEdit: () => {},
        handleDelete: () => {},
        permissions: "edit" as "edit",
      };
    }),
    breakingPoint: 1024,
  };
  const fuelOnBoardSortData = [
    {
      title: "Arm",
      key: "arm_in",
    },
    {
      title: "Tank",
      key: "tank",
    },
    {
      title: "Weight",
      key: "weight_lb",
    },
  ];

  return (
    <>
      <WeightBalanceGraph
        showMTOW={true}
        profiles={profiles}
        title="Weight & Balance Graph"
        maxTakeoff={aircraftWeightBalanceData?.max_takeoff_weight_lb}
        margin={"0"}
      />
      <Table
        title="Passengers / Crew"
        hanldeAdd={() => {}}
        disableAdd={true}
        tableData={seatsTableData}
        emptyTableMessage=""
        sortColumnOptions={seatsSortData}
        filterParameters={
          seatsFilterData.filters.length >= 1 ? seatsFilterData : undefined
        }
        pageSize={10}
      />
      <Table
        title="Luggage"
        hanldeAdd={() => {}}
        disableAdd={true}
        tableData={luggageTableData}
        emptyTableMessage=""
        sortColumnOptions={luggageSortData}
        pageSize={10}
      />
      <Table
        title="Fuel on Board"
        hanldeAdd={() => {}}
        disableAdd={true}
        tableData={fuelOnBoardTableData}
        emptyTableMessage=""
        sortColumnOptions={fuelOnBoardSortData}
        pageSize={10}
      />
    </>
  );
};

export default WeightBalanceSection;
