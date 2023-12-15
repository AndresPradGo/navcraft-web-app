import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { PiClipboardTextDuotone } from "react-icons/pi";
import _ from "lodash";
import { styled } from "styled-components";

import { WeightBalanceReportType } from "../hooks/useWeightBalanceReport";
import { FuelCalculationsData } from "../hooks/useFuelCalculations";
import useWeightBalanceData from "../../../hooks/useWeightBalanceData";
import WeightBalanceGraph from "../../../components/WeightBalanceGraph";
import Loader from "../../../components/Loader";
import Table from "../../../components/common/ExpandibleTable";
import usePersonsOnBoard from "../hooks/usePersonsOnBoard";
import useLuggage from "../hooks/useLuggage";
import useFuelOnBoard from "../hooks/useFuelOnBoard";
import useAircraftArrangementData from "../../../hooks/useAircraftArrangementData";
import FlightWarningList from "../../../components/FlightWarningList";
import { Modal, useModal } from "../../../components/common/modal";
import AddFuelForm from "./AddFuelForm";
import AddLuggageForm from "./AddLuggageForm";

const HtmlLoaderContainer = styled.div`
  margin: 35px 0 0;
  align-self: center;
  width: 100%;
`;

const ReportIcon = styled(PiClipboardTextDuotone)`
  font-size: 30px;
  margin: 0 5px 0 0;
  flex-shrink: 0;

  @media screen and (min-width: 425px) {
    margin-right: 20px;
  }
`;

interface Props {
  profileId: number;
  flightId: number;
  isLoading: boolean;
}

const WeightBalanceSection = ({ profileId, flightId, isLoading }: Props) => {
  const [typeItemToEdit, setTypeItemToEdit] = useState<
    "fuel" | "luggage" | null
  >(null);

  const [fuelToEditData, setFuelToEditData] = useState<{
    id: number;
    name: string;
    capacity: number;
    value: number;
  }>({
    id: 0,
    capacity: 0,
    value: 0,
    name: "",
  });

  const [luggageToEditData, setLuggageToEditData] = useState<{
    id: number;
    compartmentName: string;
    compartmentId: number;
    totalMaxWeight?: number;
    compartmentMaxWeight?: number;
    value: number;
  }>({
    id: 0,
    compartmentName: "",
    compartmentId: 0,
    value: 0,
  });

  const queryClient = useQueryClient();

  const weightBalanceData = queryClient.getQueryData<WeightBalanceReportType>([
    "weightBalanceReport",
    flightId,
  ]);

  const fuelCalculationsData = queryClient.getQueryData<FuelCalculationsData>([
    "fuelCalculations",
    flightId,
  ]);

  const modal = useModal();

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
            size: 30,
            label: `(${limit.cg_location_in}, ${
              Math.round(limit.weight_lb * 100) / 100000
            })`,
          })),
        };
      })
    : [];

  const seatsWeightSummary = weightBalanceData?.seats.reduce(
    (total, seat) => ({
      weight_lb: Math.round((total.weight_lb + seat.weight_lb) * 100) / 100,
      arm_in: total.arm_in,
      moment_lb_in:
        Math.round((total.moment_lb_in + seat.weight_lb * seat.arm_in) * 100) /
        100,
    }),
    { weight_lb: 0, arm_in: 0, moment_lb_in: 0 }
  );
  if (seatsWeightSummary)
    seatsWeightSummary.arm_in =
      seatsWeightSummary.weight_lb === 0
        ? 0
        : Math.round(
            (seatsWeightSummary.moment_lb_in / seatsWeightSummary.weight_lb) *
              100
          ) / 100;

  const luggageWeightSummary = weightBalanceData?.compartments.reduce(
    (total, compartment) => ({
      weight_lb:
        Math.round((total.weight_lb + compartment.weight_lb) * 100) / 100,
      arm_in: total.arm_in,
      moment_lb_in:
        Math.round(
          (total.moment_lb_in + compartment.weight_lb * compartment.arm_in) *
            100
        ) / 100,
    }),
    { weight_lb: 0, arm_in: 0, moment_lb_in: 0 }
  );
  if (luggageWeightSummary)
    luggageWeightSummary.arm_in =
      luggageWeightSummary.weight_lb === 0
        ? 0
        : Math.round(
            (luggageWeightSummary.moment_lb_in /
              luggageWeightSummary.weight_lb) *
              100
          ) / 100;

  const fuelOnBoardWeightSummary = weightBalanceData?.fuel_on_board.reduce(
    (total, tank) => ({
      gallons: Math.round((total.gallons + tank.gallons) * 100) / 100,
      weight_lb: Math.round((total.weight_lb + tank.weight_lb) * 100) / 100,
      arm_in: total.arm_in,
      moment_lb_in:
        Math.round((total.moment_lb_in + tank.weight_lb * tank.arm_in) * 100) /
        100,
    }),
    { gallons: 0, weight_lb: 0, arm_in: 0, moment_lb_in: 0 }
  );
  if (fuelOnBoardWeightSummary)
    fuelOnBoardWeightSummary.arm_in =
      fuelOnBoardWeightSummary.weight_lb === 0
        ? 0
        : Math.round(
            (fuelOnBoardWeightSummary.moment_lb_in /
              fuelOnBoardWeightSummary.weight_lb) *
              100
          ) / 100;

  const fuelBurnWeightSummary = weightBalanceData?.fuel_burned.reduce(
    (total, tank) => ({
      gallons: Math.round((total.gallons + tank.gallons) * 100) / 100,
      weight_lb: Math.round((total.weight_lb + tank.weight_lb) * 100) / 100,
      arm_in: total.arm_in,
      moment_lb_in:
        Math.round((total.moment_lb_in + tank.weight_lb * tank.arm_in) * 100) /
        100,
    }),
    { gallons: 0, weight_lb: 0, arm_in: 0, moment_lb_in: 0 }
  );
  if (fuelBurnWeightSummary)
    fuelBurnWeightSummary.arm_in =
      fuelBurnWeightSummary.weight_lb === 0
        ? 0
        : Math.round(
            (fuelBurnWeightSummary.moment_lb_in /
              fuelBurnWeightSummary.weight_lb) *
              100
          ) / 100;

  const weightBalanceTable = {
    keys: ["item", "weight_lb", "arm_in", "moment_lb_in"],
    headers: {
      item: "Item",
      weight_lb: "Weight [lb]",
      arm_in: "Arm [in]",
      moment_lb_in: "Moment [lb-in]",
    },
    rows: [
      {
        item: "Empty Weight",
        id: 1,
        weight_lb: weightBalanceData?.empty_weight.weight_lb || "-",
        arm_in: weightBalanceData?.empty_weight.arm_in || "-",
        moment_lb_in: weightBalanceData?.empty_weight.moment_lb_in || "-",
        handleEdit: () => {},
        handleDelete: () => {},
        permissions: undefined,
      },
      {
        item: "Passengers/Crew",
        id: 2,
        weight_lb: seatsWeightSummary?.weight_lb || "-",
        arm_in: seatsWeightSummary?.arm_in || "-",
        moment_lb_in: seatsWeightSummary?.moment_lb_in || "-",
        handleEdit: () => {},
        handleDelete: () => {},
        permissions: undefined,
      },
      {
        item: "Luggage",
        id: 3,
        weight_lb: luggageWeightSummary?.weight_lb || "-",
        arm_in: luggageWeightSummary?.arm_in || "-",
        moment_lb_in: luggageWeightSummary?.moment_lb_in || "-",
        handleEdit: () => {},
        handleDelete: () => {},
        permissions: undefined,
      },
      {
        item: "Zero Fuel Weight",
        id: 4,
        weight_lb: weightBalanceData?.zero_fuel_weight.weight_lb || "-",
        arm_in: weightBalanceData?.zero_fuel_weight.arm_in || "-",
        moment_lb_in: weightBalanceData?.zero_fuel_weight.moment_lb_in || "-",
        handleEdit: () => {},
        handleDelete: () => {},
        permissions: undefined,
        isResult: true,
      },
      {
        item: `Fuel on Board (${
          fuelOnBoardWeightSummary ? fuelOnBoardWeightSummary.gallons : 0
        } gal)`,
        id: 5,
        weight_lb: fuelOnBoardWeightSummary?.weight_lb || "-",
        arm_in: fuelOnBoardWeightSummary?.arm_in || "-",
        moment_lb_in: fuelOnBoardWeightSummary?.moment_lb_in || "-",
        handleEdit: () => {},
        handleDelete: () => {},
        permissions: undefined,
      },
      {
        item: `Ramp Weight (Max: ${aircraftWeightBalanceData.max_ramp_weight_lb}lb)`,
        id: 6,
        weight_lb: weightBalanceData?.ramp_weight.weight_lb || "-",
        arm_in: weightBalanceData?.ramp_weight.arm_in || "-",
        moment_lb_in: weightBalanceData?.ramp_weight.moment_lb_in || "-",
        handleEdit: () => {},
        handleDelete: () => {},
        permissions: undefined,
        isResult: true,
      },
      {
        item: `Taxi Fuel (${
          weightBalanceData
            ? weightBalanceData.fuel_burned_pre_takeoff.gallons
            : 0
        } gal)`,
        id: 7,
        weight_lb: weightBalanceData?.fuel_burned_pre_takeoff.weight_lb || "-",
        arm_in: weightBalanceData?.fuel_burned_pre_takeoff.arm_in || "-",
        moment_lb_in:
          weightBalanceData?.fuel_burned_pre_takeoff.moment_lb_in || "-",
        handleEdit: () => {},
        handleDelete: () => {},
        permissions: undefined,
      },
      {
        item: `Takeoff Weight (Max: ${aircraftWeightBalanceData.max_takeoff_weight_lb}lb)`,
        id: 8,
        weight_lb: weightBalanceData?.takeoff_weight.weight_lb || "-",
        arm_in: weightBalanceData?.takeoff_weight.arm_in || "-",
        moment_lb_in: weightBalanceData?.takeoff_weight.moment_lb_in || "-",
        handleEdit: () => {},
        handleDelete: () => {},
        permissions: undefined,
        isResult: true,
      },
      {
        item: `Fuel Burn (${
          fuelBurnWeightSummary ? fuelBurnWeightSummary.gallons : 0
        } gal)`,
        id: 9,
        weight_lb: fuelBurnWeightSummary?.weight_lb || "-",
        arm_in: fuelBurnWeightSummary?.arm_in || "-",
        moment_lb_in: fuelBurnWeightSummary?.moment_lb_in || "-",
        handleEdit: () => {},
        handleDelete: () => {},
        permissions: undefined,
      },
      {
        item: `Landing Weight (Max: ${aircraftWeightBalanceData.max_landing_weight_lb}lb)`,
        id: 10,
        weight_lb: weightBalanceData?.landing_weight.weight_lb || "-",
        arm_in: weightBalanceData?.landing_weight.arm_in || "-",
        moment_lb_in: weightBalanceData?.landing_weight.moment_lb_in || "-",
        handleEdit: () => {},
        handleDelete: () => {},
        permissions: undefined,
        isResult: true,
      },
    ],
    breakingPoint: 768,
  };

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
      const bag = luggage.find((b) => b.baggage_compartment_id === item.id);
      const weight = bag ? bag.weight_lb : 0;
      return {
        id: item.id,
        compartment: item.name,
        weight_lb: weight,
        arm_in: item.arm_in,
        moment_lb_in: Math.round(item.arm_in * weight * 100) / 100,
        handleEdit: () => {
          setLuggageToEditData({
            id: bag ? bag.id : 0,
            compartmentName: item.name,
            compartmentId: item.id,
            totalMaxWeight: aircraftWeightBalanceData?.baggage_allowance_lb,
            compartmentMaxWeight: item.weight_limit_lb
              ? item.weight_limit_lb
              : undefined,
            value: weight,
          });
          setTypeItemToEdit("luggage");
          modal.handleOpen();
        },
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
        handleEdit: () => {
          setFuelToEditData({
            id: fuel ? fuel.id : 0,
            capacity: tank.fuel_capacity_gallons,
            value: fuel ? fuel.gallons : 0,
            name: tank.name,
          });
          setTypeItemToEdit("fuel");
          modal.handleOpen();
        },
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

  const notEnoughFuel = fuelCalculationsData
    ? fuelCalculationsData.pre_takeoff_gallons +
        fuelCalculationsData.climb_gallons +
        fuelCalculationsData.enroute_fuel.gallons +
        fuelCalculationsData.additional_fuel.gallons +
        fuelCalculationsData.reserve_fuel.gallons +
        fuelCalculationsData.contingency_fuel.gallons >
      fuelCalculationsData.gallons_on_board
    : false;

  return (
    <>
      <Modal isOpen={modal.isOpen}>
        {typeItemToEdit === "fuel" ? (
          <AddFuelForm
            flightId={flightId}
            fuelData={{
              id: fuelToEditData.id,
              gallons: fuelToEditData.value,
            }}
            tank={fuelToEditData.name}
            usableCapacity={fuelToEditData.capacity}
            closeModal={modal.handleClose}
            isOpen={modal.isOpen}
          />
        ) : typeItemToEdit === "luggage" ? (
          <AddLuggageForm
            flightId={flightId}
            luggageData={{
              id: luggageToEditData.id,
              weight_lb: luggageToEditData.value,
            }}
            compartment={{
              id: luggageToEditData.compartmentId,
              name: luggageToEditData.compartmentName,
            }}
            maxWeight={{
              total: luggageToEditData.totalMaxWeight,
              compartment: luggageToEditData.compartmentMaxWeight,
            }}
            closeModal={modal.handleClose}
            isOpen={modal.isOpen}
          />
        ) : null}
      </Modal>
      <WeightBalanceGraph
        showMTOW={true}
        profiles={profiles}
        title="Weight & Balance Graph"
        maxTakeoff={aircraftWeightBalanceData?.max_takeoff_weight_lb}
        margin={"0"}
        weightBalance={
          weightBalanceData
            ? {
                zfw: {
                  weight_lb:
                    weightBalanceData?.zero_fuel_weight.weight_lb / 1000,
                  cg_location_in: weightBalanceData?.zero_fuel_weight.arm_in,
                  size: 100,
                  label: "ZFW",
                },
                landing: {
                  weight_lb: weightBalanceData?.landing_weight.weight_lb / 1000,
                  cg_location_in: weightBalanceData?.landing_weight.arm_in,
                  size: 100,
                  label: "LDW",
                },
                takeoff: {
                  weight_lb: weightBalanceData?.takeoff_weight.weight_lb / 1000,
                  cg_location_in: weightBalanceData?.takeoff_weight.arm_in,
                  size: 100,
                  label: "TOW",
                },
              }
            : undefined
        }
      />
      <Table
        title={
          isLoading ? "Weight & Balance Report" : "Weight & Balance Report"
        }
        hanldeAdd={() => {}}
        disableAdd={true}
        tableData={weightBalanceTable}
        emptyTableMessage=""
        notExpandible={true}
        icon={<ReportIcon />}
        otherComponent={
          <FlightWarningList
            warnings={[
              weightBalanceData?.warnings || [],
              notEnoughFuel
                ? ["There is not enough fuel on board to complete this flight."]
                : [],
            ]}
          />
        }
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
