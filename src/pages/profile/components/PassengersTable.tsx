import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import { styled } from "styled-components";

import usePassengersData from "../../../hooks/usePassengersData";
import Table from "../../../components/common/table";
import Loader from "../../../components/Loader";
import Button from "../../../components/common/button/index";
import { useModal, Modal } from "../../../components/common/modal";
import PassengerForm from "../../../components/passengerForm";
import DeletePassengerForm from "./DeletePassengerForm";

interface HtmlTagProps {
  $isOpen: boolean;
}
const HtmlContainer = styled.div`
  margin-top: 100px;
  width: 100%;
`;

const HtmlTitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 5px;
  padding: 0 0 10px 5px;
  border-bottom: 1px solid var(--color-grey);

  & div {
    display: flex;
    align-items: center;

    & h3:first-of-type {
      margin: 0;
      color: var(--color-grey-bright);
    }
  }

  @media screen and (min-width: 425px) {
    padding: 0 0 10px 20px;
  }
`;

const ToggleIcon = styled(BsChevronDown)<HtmlTagProps>`
  color: var(--color-grey);
  cursor: pointer;
  margin-right: 5px;
  font-size: 25px;
  transform: rotate(${(props) => (props.$isOpen ? "-180deg" : "0deg")});
  transition: 0.3s transform linear;

  &:hover,
  &:focus {
    color: var(--color-white);
  }

  @media screen and (min-width: 425px) {
    margin-right: 20px;
  }
`;

const HtmlTableContainer = styled.div<HtmlTagProps>`
  transition: padding 0.6s, max-height 0.3s, opacity 0.6s;
  border-bottom: 1px solid var(--color-grey);
  padding: ${(props) => (props.$isOpen ? "15px" : "0px 15px")};
  max-height: ${(props) => (props.$isOpen ? "10000vh" : "0px")};
  opacity: ${(props) => (props.$isOpen ? "1" : "0")};
  overflow: hidden;
`;

const PassengersTable = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [passengerId, setPassengerId] = useState<number>(0);
  const { data: passengers, isLoading } = usePassengersData();
  const editModal = useModal();
  const deleteModal = useModal();

  const passengerData = passengers?.find((item) => item.id === passengerId);

  const tableData = {
    keys: ["name", "weight_lb"],
    headers: {
      name: "Name",
      weight_lb: "Weight [lb]",
    },
    rows: passengers
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
      <HtmlContainer>
        <HtmlTitleContainer>
          <div>
            <ToggleIcon onClick={() => setIsOpen(!isOpen)} $isOpen={isOpen} />
            <h3>Frequent Passengers</h3>
          </div>
          <Button
            borderRadious={100}
            padding="5px"
            height="30px"
            backgroundColor="var(--color-grey)"
            backgroundHoverColor="var(--color-white)"
            color="var(--color-primary-dark)"
            hoverColor="var(--color-primary-dark)"
            margin="0 20px 0 0px"
            fontSize={18}
            handleClick={handleAddNewClick}
          >
            <AiOutlinePlus />
          </Button>
        </HtmlTitleContainer>
        <HtmlTableContainer $isOpen={isOpen}>
          {isLoading ? (
            <Loader />
          ) : (
            <Table
              tableData={tableData}
              sortColumnOptions={sortData}
              pageSize={5}
              emptyTableMessage="No Passengers saved..."
            />
          )}
        </HtmlTableContainer>
      </HtmlContainer>
    </>
  );
};

export default PassengersTable;
