import { Dispatch, SetStateAction } from "react";

import useUserWaypointsData from "../../../hooks/useUserWaypointsData";
import useAuth from "../../../hooks/useAuth";
import {
  useModal,
  Modal,
  UseModalType,
} from "../../../components/common/modal";
import EditUserWaypointForm from "../../../components/editUserWaypointForm";
import DeleteUserWaypointForm from "../../../components/deleteUserWaypointForm";
import formatUTCDate from "../../../utils/formatUTCDate";
import ExpandibleTable from "../../../components/common/ExpandibleTable";

interface Props {
  editModal: UseModalType;
  waypointId: number;
  setWaypointId: Dispatch<SetStateAction<number>>;
}

const WaypointsTable = ({ editModal, waypointId, setWaypointId }: Props) => {
  const user = useAuth();
  const userIsAdmin = user && user.is_active && user.is_admin;

  const { data: waypoints, isLoading, error } = useUserWaypointsData();

  const deleteModal = useModal();

  const waypointData = waypoints?.find((item) => item.id === waypointId);

  const tableData = {
    keys: ["code", "name", "latitude", "longitude", "variation", "updated"],
    headers: {
      code: "Code",
      name: "Name",
      latitude: "Latitude",
      longitude: "Longitude",
      variation: "Magnetic Var",
      updated: "Date Updated",
    },
    rows:
      !error && waypoints
        ? waypoints.map((w) => ({
            id: w.id,
            code: w.code,
            name: w.name,
            latitude: `${w.lat_direction}${w.lat_degrees}\u00B0${w.lat_minutes}'${w.lat_seconds}"`,
            longitude: `${w.lon_direction}${w.lon_degrees}\u00B0${w.lon_minutes}'${w.lon_seconds}"`,
            updated: formatUTCDate(w.last_updated_utc),
            date: w.last_updated_utc,
            variation: `${Math.abs(
              w.magnetic_variation ? w.magnetic_variation : 0
            )}\u00B0${
              w.magnetic_variation
                ? w.magnetic_variation < 0
                  ? "E"
                  : w.magnetic_variation > 0
                  ? "W"
                  : ""
                : ""
            }`,
            handleEdit: () => {
              setWaypointId(w.id);
              editModal.handleOpen();
            },
            handleDelete: () => {
              setWaypointId(w.id);
              deleteModal.handleOpen();
            },
            permissions: "edit-delete" as "edit-delete",
          }))
        : [],
    breakingPoint: 1400,
  };

  const sortData = [
    {
      key: "code",
      title: "Code",
    },
    {
      key: "name",
      title: "Name",
    },
    {
      title: "Date Updated",
      key: "date",
    },
  ];

  const handleAddNewClick = () => {
    setWaypointId(0);
    editModal.handleOpen();
  };

  return (
    <>
      <Modal isOpen={editModal.isOpen}>
        <EditUserWaypointForm
          isAdmin={!!userIsAdmin}
          closeModal={editModal.handleClose}
          waypointData={
            waypointData
              ? {
                  id: waypointData.id,
                  code: waypointData.code,
                  name: waypointData.name,
                  lat_degrees: waypointData.lat_degrees,
                  lat_minutes: waypointData.lat_minutes,
                  lat_seconds: waypointData.lat_seconds,
                  lat_direction:
                    waypointData.lat_direction === "S" ? "South" : "North",
                  lon_degrees: waypointData.lon_degrees,
                  lon_minutes: waypointData.lon_minutes,
                  lon_seconds: waypointData.lon_seconds,
                  lon_direction:
                    waypointData.lon_direction === "E" ? "East" : "West",
                  magnetic_variation: waypointData.magnetic_variation,
                }
              : {
                  id: 0,
                  code: "",
                  name: "",
                  lat_degrees: 0,
                  lat_minutes: 0,
                  lat_seconds: 0,
                  lat_direction: "North",
                  lon_degrees: 0,
                  lon_minutes: 0,
                  lon_seconds: 0,
                  lon_direction: "West",
                  magnetic_variation: NaN,
                }
          }
          isOpen={editModal.isOpen}
        />
      </Modal>
      <Modal isOpen={deleteModal.isOpen}>
        <DeleteUserWaypointForm
          isAdmin={!!userIsAdmin}
          closeModal={deleteModal.handleClose}
          name={waypointData?.name || ""}
          id={waypointData ? waypointData.id : 0}
        />
      </Modal>
      <ExpandibleTable
        tableData={tableData}
        sortColumnOptions={sortData}
        pageSize={5}
        emptyTableMessage="No Waypoints saved..."
        title="Saved Waypoints"
        hanldeAdd={handleAddNewClick}
        dataIsLoading={isLoading}
      />
    </>
  );
};

export default WaypointsTable;
