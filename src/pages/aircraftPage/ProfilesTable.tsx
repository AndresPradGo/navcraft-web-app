import { useState, Dispatch, SetStateAction } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import { FaCheck } from "react-icons/fa6";
import { styled } from "styled-components";

import Table from "../../components/common/table";
import Button from "../../components/common/button";
import { useModal, Modal, UseModalType } from "../../components/common/modal";
import { PerformanceProfileBaseData } from "../../services/aircraftClient";
import { FuelTypeData } from "../../hooks/useFuelTypes";
import DeleteProfileForm from "../../components/deleteProfileForm";

interface HtmlTagProps {
  $isOpen: boolean;
}
const HtmlContainer = styled.div`
  margin: 100px 0 50px;
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

  & ul {
    text-wrap: wrap;
  }
`;

const CheckIcon = styled(FaCheck)`
  color: var(--color-white);
  font-size: 30px;
  margin-right: 8px;
  padding-bottom: 3px;
`;

interface Props {
  profiles: PerformanceProfileBaseData[];
  aircraftId: number;
  addModal: UseModalType;
  profileId: number;
  setProfileId: Dispatch<SetStateAction<number>>;
  fuelTypes: FuelTypeData[];
}

const ProfilesTable = ({
  profiles,
  addModal,
  aircraftId,
  profileId,
  fuelTypes,
  setProfileId,
}: Props) => {
  const [isOpen, setIsOpen] = useState(true);
  const deleteModal = useModal();
  const tableData = {
    keys: ["name", "fuel", "complete", "selected"],
    headers: {
      name: "Description",
      fuel: "Fuel",
      complete: "State",
      selected: "Selected",
    },
    rows: profiles.map((p) => ({
      id: p.id,
      name: p.performance_profile_name,
      fuel: fuelTypes.find((item) => item.id === p.fuel_type_id)?.name || "-",
      complete: p.is_complete ? "Complete" : "Incomplete",
      selected: p.is_preferred ? <CheckIcon /> : "-",
      handleEdit: `profile/${p.id}`,
      handleDelete: () => {
        setProfileId(p.id);
        deleteModal.handleOpen();
      },
      permissions: "open-delete" as "open-delete",
    })),
    breakingPoint: 1000,
  };

  return (
    <>
      <Modal isOpen={deleteModal.isOpen}>
        <DeleteProfileForm
          closeModal={deleteModal.handleClose}
          id={profileId}
          name={
            profiles.find((p) => p.id === profileId)
              ?.performance_profile_name || ""
          }
          aircraftId={aircraftId}
        />
      </Modal>
      <HtmlContainer>
        <HtmlTitleContainer>
          <div>
            <ToggleIcon onClick={() => setIsOpen(!isOpen)} $isOpen={isOpen} />
            <h3>Performance Profiles</h3>
          </div>
          {profiles.length < 3 ? (
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
              handleClick={() => {
                setProfileId(0);
                addModal.handleOpen();
              }}
            >
              <AiOutlinePlus />
            </Button>
          ) : null}
        </HtmlTitleContainer>
        <HtmlTableContainer $isOpen={isOpen}>
          <ul>
            <li>
              You can add up to 3 different performance profiles for this
              aircraft.
            </li>
            <li>Only the selected profile will be used for flight planning.</li>
          </ul>
          <Table tableData={tableData} />
        </HtmlTableContainer>
      </HtmlContainer>
    </>
  );
};

export default ProfilesTable;
