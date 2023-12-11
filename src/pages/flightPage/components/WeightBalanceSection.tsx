import { useQueryClient } from "@tanstack/react-query";
import _ from "lodash";
import { styled } from "styled-components";

import { WeightBalanceReportType } from "../hooks/useWeightBalanceReport";
import useWeightBalanceData from "../../../hooks/useWeightBalanceData";
import WeightBalanceGraph from "../../../components/WeightBalanceGraph";
import Loader from "../../../components/Loader";
import Table from "../../../components/common/ExpandibleTable";
import usePersonsOnBoard from "../hooks/usePersonsOnBoard";
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
    data: aircraftWeightBalanceData,
    error: aircraftWeightBalanceError,
    isLoading: aircraftWeightBalanceLoading,
  } = useWeightBalanceData(profileId);

  const {
    data: arrangementData,
    error: arrangementError,
    isLoading: arrangementLoading,
  } = useAircraftArrangementData(profileId);

  if (aircraftWeightBalanceError || personsOnBoardError || arrangementError)
    throw new Error("");
  if (
    aircraftWeightBalanceLoading ||
    personsOnBoardLoading ||
    arrangementLoading
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
    keys: ["seat", "weight_lb", "arm_in", "moment_lb_in"],
    headers: {
      seat: "Seat",
      weight_lb: "Weight [lb]",
      arm_in: "Arm [in]",
      moment_lb_in: "Moment [lb-in]",
    },
    rows: seats.map((seat) => {
      const weight = personsOnBoard.find(
        (p) => p.seat_row_id === seat.id && p.seat_number === p.seat_number
      )?.weight_lb;
      return {
        id: seat.id + seat.seatNumber / 10,
        seat: seat.name,
        seatRow: seat.seatRow,
        weight_lb: weight ? weight : 0,
        arm_in: seat.arm_in,
        moment_lb_in:
          Math.round(seat.arm_in * (weight ? weight : 0) * 100) / 100,
        handleEdit: () => {},
        handleDelete: () => {},
        permissions: "edit" as "edit",
      };
    }),
    breakingPoint: 0,
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

  return (
    <>
      <WeightBalanceGraph
        showMTOW={true}
        profiles={profiles}
        title="Weight & Balance Graph"
        maxTakeoff={aircraftWeightBalanceData?.max_takeoff_weight_lb}
        margin={"35px 0 0"}
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
    </>
  );
};

export default WeightBalanceSection;
