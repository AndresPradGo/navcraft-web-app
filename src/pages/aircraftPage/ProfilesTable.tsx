import { Dispatch, SetStateAction } from "react";
import { FaCheck } from "react-icons/fa6";
import { styled } from "styled-components";

import { useModal, Modal, UseModalType } from "../../components/common/modal";
import { PerformanceProfileBaseData } from "../../services/aircraftClient";
import { FuelTypeData } from "../../hooks/useFuelTypes";
import DeletePerformanceProfileForm from "../../components/deletePerformanceProfileForm";
import formatUTCDate from "../../utils/formatUTCDate";
import ExpandibleTable from "../../components/common/ExpandibleTable";

const HtmlInstructionsList = styled.ul`
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
  const deleteModal = useModal();
  const tableData = {
    keys: ["name", "fuel", "complete", "selected", "updated"],
    headers: {
      name: "Description",
      fuel: "Fuel",
      complete: "State",
      selected: "Selected",
      updated: "Date Updated",
    },
    rows: profiles.map((p) => ({
      id: p.id,
      name: p.performance_profile_name,
      fuel: fuelTypes.find((item) => item.id === p.fuel_type_id)?.name || "-",
      complete: p.is_complete ? "Complete" : "Incomplete",
      selected: p.is_preferred ? <CheckIcon /> : "-",
      updated: formatUTCDate(p.last_updated_utc),
      date: p.last_updated_utc,
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
        <DeletePerformanceProfileForm
          closeModal={deleteModal.handleClose}
          id={profileId}
          name={
            profiles.find((p) => p.id === profileId)
              ?.performance_profile_name || ""
          }
          aircraftId={aircraftId}
        />
      </Modal>
      <ExpandibleTable
        tableData={tableData}
        title="Performance Profiles"
        hanldeAdd={() => {
          setProfileId(0);
          addModal.handleOpen();
        }}
        disableAdd={profiles.length >= 3}
        otherComponent={
          <HtmlInstructionsList>
            <li>
              You can add up to 3 different performance profiles for this
              aircraft.
            </li>
            <li>Only the selected profile will be used for flight planning.</li>
          </HtmlInstructionsList>
        }
      />
    </>
  );
};

export default ProfilesTable;
