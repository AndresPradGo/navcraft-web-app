import { useQueryClient } from "@tanstack/react-query";
import { LiaTachometerAltSolid } from "react-icons/lia";
import { PiClipboardTextDuotone } from "react-icons/pi";
import { styled } from "styled-components";

import Table from "../../../components/common/ExpandibleTable";
import DataTableList from "../../../components/common/DataTableList";
import { FuelCalculationsData } from "../hooks/useFuelCalculations";
import FlightWarningList from "../../../components/FlightWarningList";

const ReportIcon = styled(PiClipboardTextDuotone)`
  font-size: 30px;
  margin: 0 5px 0 0;
  flex-shrink: 0;

  @media screen and (min-width: 425px) {
    margin-right: 20px;
  }
`;

const PumpIcon = styled(LiaTachometerAltSolid)`
  font-size: 40px;
  margin: 0 10px 0 0;
  flex-shrink: 0;
`;

interface Props {
  flightId: number;
  isLoading: boolean;
}

const FuelCalculationsSection = ({ flightId, isLoading }: Props) => {
  const queryClient = useQueryClient();

  const fuelCalculationsData = queryClient.getQueryData<FuelCalculationsData>([
    "fuelCalculations",
    flightId,
  ]);

  const dataListData = fuelCalculationsData
    ? [
        {
          key: "average_gph",
          title: "Average Cruise GPH",
          icon: <PumpIcon />,
          data: fuelCalculationsData.average_gph,
        },
      ]
    : [];

  const tableData = {
    keys: ["item", "hours", "gallons"],
    headers: {
      item: "",
      hours: "Hours",
      gallons: "Gallons",
    },
    rows: fuelCalculationsData
      ? [
          {
            id: 1,
            item: "Start to Takeoff",
            hours: "",
            gallons: fuelCalculationsData.pre_takeoff_gallons,
            handleEdit: () => {},
            handleDelete: () => {},
            permissions: undefined,
            isResult: false,
          },
          {
            id: 2,
            item: "Climb",
            hours: "",
            gallons: fuelCalculationsData.climb_gallons,
            handleEdit: () => {},
            handleDelete: () => {},
            permissions: undefined,
            isResult: false,
          },
          {
            id: 3,
            item: "Enroute",
            hours: fuelCalculationsData.enroute_fuel.hours,
            gallons: fuelCalculationsData.enroute_fuel.gallons,
            handleEdit: () => {},
            handleDelete: () => {},
            permissions: undefined,
            isResult: false,
          },
          {
            id: 4,
            item: "Added Flight Time",
            hours: fuelCalculationsData.additional_fuel.hours,
            gallons: fuelCalculationsData.additional_fuel.gallons,
            handleEdit: () => {},
            handleDelete: () => {},
            permissions: undefined,
            isResult: false,
          },
          {
            id: 5,
            item: "Reserves",
            hours: fuelCalculationsData.reserve_fuel.hours,
            gallons: fuelCalculationsData.reserve_fuel.gallons,
            handleEdit: () => {},
            handleDelete: () => {},
            permissions: undefined,
            isResult: false,
          },
          {
            id: 6,
            item: "Contingency",
            hours: fuelCalculationsData.contingency_fuel.hours,
            gallons: fuelCalculationsData.contingency_fuel.gallons,
            handleEdit: () => {},
            handleDelete: () => {},
            permissions: undefined,
            isResult: false,
          },
          {
            id: 7,
            item: "Total Required",
            hours: "",
            gallons:
              fuelCalculationsData.pre_takeoff_gallons +
              fuelCalculationsData.climb_gallons +
              fuelCalculationsData.enroute_fuel.gallons +
              fuelCalculationsData.additional_fuel.gallons +
              fuelCalculationsData.reserve_fuel.gallons +
              fuelCalculationsData.contingency_fuel.gallons,
            handleEdit: () => {},
            handleDelete: () => {},
            permissions: undefined,
            isResult: true,
          },
          {
            id: 8,
            item: "Fuel on Board",
            hours: "",
            gallons: fuelCalculationsData.gallons_on_board,
            handleEdit: () => {},
            handleDelete: () => {},
            permissions: undefined,
            isResult: false,
          },
          {
            id: 9,
            item: "Fuel Used",
            hours: "",
            gallons:
              fuelCalculationsData.pre_takeoff_gallons +
              fuelCalculationsData.climb_gallons +
              fuelCalculationsData.enroute_fuel.gallons +
              fuelCalculationsData.additional_fuel.gallons,
            handleEdit: () => {},
            handleDelete: () => {},
            permissions: undefined,
            isResult: true,
          },
          {
            id: 10,
            item: "Remaining Fuel",
            hours: "",
            gallons:
              fuelCalculationsData.gallons_on_board -
              (fuelCalculationsData.pre_takeoff_gallons +
                fuelCalculationsData.climb_gallons +
                fuelCalculationsData.enroute_fuel.gallons +
                fuelCalculationsData.additional_fuel.gallons),
            handleEdit: () => {},
            handleDelete: () => {},
            permissions: undefined,
            isResult: true,
          },
        ]
      : [],
    breakingPoint: 0,
  };

  const notEnoughFuel = fuelCalculationsData
    ? fuelCalculationsData.pre_takeoff_gallons +
        fuelCalculationsData.climb_gallons +
        fuelCalculationsData.enroute_fuel.gallons +
        fuelCalculationsData.additional_fuel.gallons +
        fuelCalculationsData.reserve_fuel.gallons +
        fuelCalculationsData.contingency_fuel.gallons >
      fuelCalculationsData.gallons_on_board
    : false;

  const warnings = notEnoughFuel
    ? ["There is not enough fuel on board to complete this flight."]
    : [];

  return (
    <>
      <DataTableList dataList={dataListData} margin="0 0 40px" />
      <Table
        title={
          isLoading ? "Fuel Calculations Report" : "Fuel Calculations Report"
        }
        hanldeAdd={() => {}}
        disableAdd={true}
        tableData={tableData}
        emptyTableMessage=""
        notExpandible={true}
        icon={<ReportIcon />}
        otherComponent={<FlightWarningList warnings={[warnings]} />}
      />
    </>
  );
};

export default FuelCalculationsSection;
