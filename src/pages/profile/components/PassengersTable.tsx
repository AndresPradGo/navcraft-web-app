import { Dispatch, SetStateAction } from "react";

import usePassengersData from "../../../hooks/usePassengersData";
import {
  useModal,
  Modal,
  UseModalType,
} from "../../../components/common/modal";
import PassengerForm from "../../../components/passengerForm";
import DeletePassengerForm from "./DeletePassengerForm";
import ExpandibleTable from "../../../components/common/ExpandibleTable";

interface Props {
  editModal: UseModalType;
  passengerId: number;
  setPassengerId: Dispatch<SetStateAction<number>>;
}

const PassengersTable = ({ editModal, passengerId, setPassengerId }: Props) => {
  const { data: passengers, isLoading, error } = usePassengersData();
  const deleteModal = useModal();

  const passengerData = passengers?.find((item) => item.id === passengerId);

  const tableData = {
    keys: ["name", "weight_lb"],
    headers: {
      name: "Name",
      weight_lb: "Weight [lb]",
    },
    rows:
      !error && passengers
        ? passengers.map((passenger) => ({
            ...passenger,
            handleEdit: () => {
              setPassengerId(passenger.id);
              editModal.handleOpen();
            },
            handleDelete: () => {
              setPassengerId(passenger.id);
              deleteModal.handleOpen();
            },
            permissions: "delete" as "delete",
          }))
        : [],
    breakingPoint: 0,
  };

  const sortData = [
    {
      key: "name",
      title: "Name",
    },
  ];

  const handleAddNewClick = () => {
    setPassengerId(0);
    editModal.handleOpen();
  };

  return (
    <>
      <Modal isOpen={editModal.isOpen}>
        <PassengerForm
          closeModal={editModal.handleClose}
          passengerData={
            passengerData ? passengerData : { id: 0, name: "", weight_lb: NaN }
          }
          isOpen={editModal.isOpen}
        />
      </Modal>
      <Modal isOpen={deleteModal.isOpen}>
        <DeletePassengerForm
          closeModal={deleteModal.handleClose}
          name={passengerData?.name || ""}
          id={passengerData?.id || 0}
        />
      </Modal>
      <ExpandibleTable
        tableData={tableData}
        sortColumnOptions={sortData}
        pageSize={5}
        emptyTableMessage="No Passengers saved..."
        title="Frequent Passengers"
        hanldeAdd={handleAddNewClick}
        dataIsLoading={isLoading}
        marginTop={100}
      />
    </>
  );
};

export default PassengersTable;
