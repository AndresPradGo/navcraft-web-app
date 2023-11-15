import { useState } from "react";
import { BsFillFuelPumpFill } from "react-icons/bs";
import { GiMolecule } from "react-icons/gi";
import { styled } from "styled-components";

import DataTableList from "../../../components/common/DataTableList";
import ExpandibleTable from "../../../components/common/ExpandibleTable";
import { useModal, Modal } from "../../../components/common/modal";
import EditBaggageCompartmentForm from "./EditBaggageCompartmentForm";
import EditSeatRowForm from "./EditSeatRowForm";
import EditFuelTankForm from "./EditFuelTankForm";
import { AircraftArrangementDataFromAPI } from "../../../services/aircraftArrangementClient";
import DeleteArrangementItemForm from "./DeleteArrangementItemForm";

const HtmlInstructionsList = styled.ul`
  & ul {
    text-wrap: wrap;
  }
`;

const FuelIcon = styled(BsFillFuelPumpFill)`
  font-size: 20px;
  margin: 0 10px 0 0;
`;

const DensityIcon = styled(GiMolecule)`
  font-size: 20px;
  margin: 0 10px 0 0;
`;

interface Props {
  fuel: {
    density: number;
    name: string;
  };
  profileId: number;
  handleAddBaggage: () => void;
  handleAddSeat: () => void;
  handleAddFuel: () => void;
  arrangementData?: AircraftArrangementDataFromAPI;
  isLoading: boolean;
}

const ArrangementSection = ({
  fuel,
  profileId,
  handleAddBaggage,
  handleAddSeat,
  handleAddFuel,
  arrangementData,
  isLoading,
}: Props) => {
  const [selectedId, setSelectedId] = useState<number>(0);
  const [currentForm, setCurrentForm] = useState<
    | "addCompartment"
    | "addSeat"
    | "addTank"
    | "deleteCompartment"
    | "deleteTank"
    | "deleteSeat"
  >("addCompartment");

  const modal = useModal();

  const compartmentsTableData = {
    keys: ["name", "arm_in", "weight_limit_lb"],
    headers: {
      name: "Name",
      arm_in: "Arm [in]",
      weight_limit_lb: "Weight Limit [lb]",
    },
    rows: arrangementData
      ? arrangementData.baggage_compartments.map((compartment) => ({
          id: compartment.id,
          name: compartment.name,
          arm_in: compartment.arm_in,
          weight_limit_lb: compartment.weight_limit_lb
            ? compartment.weight_limit_lb
            : "-",
          handleEdit: () => {
            setSelectedId(compartment.id);
            setCurrentForm("addCompartment");
            modal.handleOpen();
          },
          handleDelete: () => {
            setSelectedId(compartment.id);
            setCurrentForm("deleteCompartment");
            modal.handleOpen();
          },
          permissions: "delete" as "delete",
        }))
      : [],
  };

  const compartmentsSortData = [
    {
      title: "Arm",
      key: "arm_in",
    },
    {
      title: "Name",
      key: "name",
    },
    {
      title: "Weight Limit",
      key: "weight_limit_lb",
    },
  ];

  const seatsTableData = {
    keys: ["name", "arm_in", "weight_limit_lb", "number_of_seats"],
    headers: {
      name: "Name",
      arm_in: "Arm [in]",
      weight_limit_lb: "Weight Limit [lb]",
      number_of_seats: "Number of Seats",
    },
    rows: arrangementData
      ? arrangementData.seat_rows.map((seat) => ({
          id: seat.id,
          name: seat.name,
          arm_in: seat.arm_in,
          weight_limit_lb: seat.weight_limit_lb ? seat.weight_limit_lb : "-",
          number_of_seats: seat.number_of_seats,
          handleEdit: () => {
            setSelectedId(seat.id);
            setCurrentForm("addSeat");
            modal.handleOpen();
          },
          handleDelete: () => {
            setSelectedId(seat.id);
            setCurrentForm("deleteSeat");
            modal.handleOpen();
          },
          permissions: "delete" as "delete",
        }))
      : [],
  };

  const seatsSortData = [
    {
      title: "Arm",
      key: "arm_in",
    },
    {
      title: "Name",
      key: "name",
    },
    {
      title: "Weight Limit",
      key: "weight_limit_lb",
    },
    {
      title: "Number of Seats",
      key: "number_of_seats",
    },
  ];

  const tanksTableData = {
    keys: [
      "name",
      "arm_in",
      "fuel_capacity_gallons",
      "burn_sequence",
      "unusable_fuel_gallons",
    ],
    headers: {
      name: "Name",
      arm_in: "Arm [in]",
      fuel_capacity_gallons: "Fuel Capacity [gal]",
      burn_sequence: "Burn Sequence",
      unusable_fuel_gallons: "Unusable Fuel [gal]",
    },
    rows: arrangementData
      ? arrangementData.fuel_tanks.map((tank) => ({
          id: tank.id,
          name: tank.name,
          arm_in: tank.arm_in,
          fuel_capacity_gallons: tank.fuel_capacity_gallons
            ? tank.fuel_capacity_gallons
            : "-",
          burn_sequence: tank.burn_sequence,
          unusable_fuel_gallons: tank.unusable_fuel_gallons
            ? tank.unusable_fuel_gallons
            : "-",
          handleEdit: () => {
            setSelectedId(tank.id);
            setCurrentForm("addTank");
            modal.handleOpen();
          },
          handleDelete: () => {
            setSelectedId(tank.id);
            setCurrentForm("deleteTank");
            modal.handleOpen();
          },
          permissions: "delete" as "delete",
        }))
      : [],
  };

  const tanksSortData = [
    {
      title: "Burn Sequence",
      key: "burn_sequence",
    },
    {
      title: "Arm",
      key: "arm_in",
    },
    {
      title: "Name",
      key: "name",
    },
  ];

  const selectedCompartment = arrangementData?.baggage_compartments.find(
    (compartment) => compartment.id === selectedId
  ) || {
    id: 0,
    name: "",
    arm_in: 0,
    weight_limit_lb: NaN,
  };

  const selectedSeat = arrangementData?.seat_rows.find(
    (seat) => seat.id === selectedId
  ) || {
    id: 0,
    name: "",
    arm_in: 0,
    number_of_seats: 1,
    weight_limit_lb: NaN,
  };

  const selectedTank = arrangementData?.fuel_tanks.find(
    (tank) => tank.id === selectedId
  ) || {
    id: 0,
    name: "",
    arm_in: 0,
    fuel_capacity_gallons: 0,
    unusable_fuel_gallons: 0,
    burn_sequence: 1,
  };

  return (
    <>
      <Modal isOpen={modal.isOpen}>
        {currentForm === "addCompartment" ? (
          <EditBaggageCompartmentForm
            compartmentData={selectedCompartment}
            closeModal={modal.handleClose}
            isOpen={modal.isOpen}
            profileId={profileId}
          />
        ) : currentForm === "addSeat" ? (
          <EditSeatRowForm
            seatRowData={selectedSeat}
            closeModal={modal.handleClose}
            isOpen={modal.isOpen}
            profileId={profileId}
          />
        ) : currentForm === "addTank" ? (
          <EditFuelTankForm
            fuelTankData={selectedTank}
            closeModal={modal.handleClose}
            isOpen={modal.isOpen}
            profileId={profileId}
          />
        ) : currentForm === "deleteCompartment" ? (
          <DeleteArrangementItemForm
            closeModal={modal.handleClose}
            type={"Baggage Compartment"}
            name={selectedCompartment.name}
            id={selectedId}
            profileId={profileId}
          />
        ) : currentForm === "deleteSeat" ? (
          <DeleteArrangementItemForm
            closeModal={modal.handleClose}
            type={"Seat Row"}
            name={selectedSeat.name}
            id={selectedId}
            profileId={profileId}
          />
        ) : currentForm === "deleteTank" ? (
          <DeleteArrangementItemForm
            closeModal={modal.handleClose}
            type={"Fuel Tank"}
            name={selectedTank.name}
            id={selectedId}
            profileId={profileId}
          />
        ) : null}
      </Modal>
      <DataTableList
        dataList={[
          {
            key: "fuel",
            title: "Fuel",
            icon: <FuelIcon />,
            data: fuel.name,
          },
          {
            key: "density",
            title: "Fuel Density [lb/gal]",
            icon: <DensityIcon />,
            data: `${fuel.density}`,
          },
        ]}
      />
      <ExpandibleTable
        tableData={compartmentsTableData}
        sortColumnOptions={compartmentsSortData}
        pageSize={5}
        emptyTableMessage="No Baggage Compartments have been added to this profile..."
        title="Baggage Compartments"
        hanldeAdd={handleAddBaggage}
        dataIsLoading={isLoading}
      />
      <ExpandibleTable
        tableData={seatsTableData}
        sortColumnOptions={seatsSortData}
        pageSize={5}
        emptyTableMessage="No Seat Rows have been added to this profile..."
        title="Seat Rows"
        hanldeAdd={handleAddSeat}
        dataIsLoading={isLoading}
      />
      <ExpandibleTable
        tableData={tanksTableData}
        sortColumnOptions={tanksSortData}
        disableAdd={tanksTableData.rows.length >= 4}
        pageSize={5}
        emptyTableMessage="No Fuel Tanks have been added to this profile..."
        title="Fuel Tanks"
        hanldeAdd={handleAddFuel}
        dataIsLoading={isLoading}
        otherComponent={
          <HtmlInstructionsList>
            <li>You can add up to 4 fuel tanks to this performance profile.</li>
            <li>
              Tanks with lower burn sequence, will be assumed to burn fuel
              first.
            </li>
            <li>
              Tanks with equal burn sequence, will be assumed to burn fuel
              simultaneously.
            </li>
          </HtmlInstructionsList>
        }
      />
    </>
  );
};

export default ArrangementSection;
