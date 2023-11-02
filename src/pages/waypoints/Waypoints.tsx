import { useState } from "react";
import { AiOutlineSwap } from "react-icons/ai";
import { FaMapLocationDot } from "react-icons/fa6";
import { GiRoad } from "react-icons/gi";
import { MdOutlineConnectingAirports } from "react-icons/md";
import { TbMapPin, TbRoad } from "react-icons/tb";
import { styled } from "styled-components";

import { ContentLayout } from "../layout";
import useAuth from "../../hooks/useAuth";
import SideBarContent from "./SideBarContent";
import useUserWaypointsData from "../../hooks/useUserWaypointsData";
import useVfrWaypointsData from "../../hooks/useVfrWaypointsData";
import Loader from "../../components/Loader";
import useAerodromeStatusList from "../../hooks/useAerodromeStatusList";
import useGetTableStructure from "./useGetTableStructure";
import useAerodromesData from "../../hooks/useAerodromesData";
import useRunwaysData from "./useRunwaysData";
import Table from "../../components/common/table";
import { useModal, Modal } from "../../components/common/modal";
import EditUserWaypointForm from "../../components/editUserWaypointForm";
import EditVfrWaypointForm from "../../components/editVfrWaypointForm";
import DeleteUserWaypointForm from "../../components/deleteUserWaypointForm";
import DeleteVfrWaypointForm from "../../components/deleteVfrWaypointForm";
import DeleteUserAerodromeForm from "../../components/deleteUserAerodromeForm/index";
import EditRunwayForm from "../../components/editRunwayForm/index";
import DeleteRunwayForm from "../../components/deleteRunwayForm/index";
import EditOfficialAerodromeForm from "../../components/editOfficialAerodromeForm";
import EditUserAerodromeForm from "../../components/editUserAerodromeForm";
import FileForm from "../../components/common/fileForm/index";
import getCsvUploadingInstructions from "../../utils/getCsvUploadingInstructions";

const HtmlContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-wrap: wrap;
  text-wrap: nowrap;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const HtmlTitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 238px;

  & h1:first-of-type {
    display: flex;
    align-items: center;
    margin: 10px 0;
    font-size: 25px;
    text-wrap: wrap;
    line-height: 0.98;

    & svg {
      flex-shrink: 0;
      font-size: 40px;
      margin: 0 5px 0 0;
    }
  }

  @media screen and (min-width: 425px) {
    width: 310px;
    justify-content: flex-end;
    & h1:first-of-type {
      font-size: 35px;

      & svg {
        margin: 0 10px 0 0;
        font-size: 50px;
      }
    }
  }
`;

const HtmlTableContainer = styled.div`
  margin: 50px 0 0;
  width: 100%;
`;

const ChangeIcon = styled(AiOutlineSwap)`
  color: var(--color-contrast);
  cursor: pointer;
  font-size: 30px;
  margin-left: 5px;

  &:hover,
  &:focus {
    color: var(--color-contrast-hover);
  }

  @media screen and (min-width: 425px) {
    font-size: 35px;
  }
`;

const WaypointIcon = styled(TbMapPin)`
  flex-shrink: 0;
  font-size: 35px;
  margin: 0 10px 0 0;

  @media screen and (min-width: 510px) {
    font-size: 40px;
  }
`;

const AerodromeIcon = styled(MdOutlineConnectingAirports)`
  flex-shrink: 0;
  font-size: 35px;
  margin: 0 10px 0 0;

  @media screen and (min-width: 510px) {
    font-size: 40px;
  }
`;

const RunwayIcon = styled(TbRoad)`
  flex-shrink: 0;
  font-size: 35px;
  margin: 0 10px 0 0;

  @media screen and (min-width: 510px) {
    font-size: 40px;
  }
`;

const Waypoints = () => {
  const user = useAuth();
  const userIsAdmin = user && user.is_active && user.is_admin;

  const [tableIndex, setTableIndex] = useState<number>(0);
  const [rowToEditId, setRowToEditId] = useState<number>(0);
  const [typeItemToEdit, setTypeItemToEdit] = useState<
    | "VFR Waypoint"
    | "userWaypoint"
    | "Official Aerodrome"
    | "userAerodrome"
    | "Runway"
    | null
  >(null);

  const editModal = useModal();
  const deleteModal = useModal();
  const editRunwayModal = useModal();
  const uploadCsvModal = useModal();

  const {
    data: statusList,
    isLoading: statusListIsLoading,
    error: statusListError,
  } = useAerodromeStatusList();

  const {
    data: userWaypoints,
    isLoading: userWaypointsLoading,
    error: userWaypointsError,
  } = useUserWaypointsData();

  const {
    data: vfrWaypoints,
    isLoading: vfrWaypointsLoading,
    error: vfrWaypointsError,
  } = useVfrWaypointsData(!!userIsAdmin);

  const {
    data: aerodromes,
    isLoading: aerodromesLoading,
    error: aerodromesError,
  } = useAerodromesData();

  const {
    data: runways,
    isLoading: runwaysLoading,
    error: runwaysError,
  } = useRunwaysData(!!userIsAdmin);

  if (
    statusListIsLoading ||
    userWaypointsLoading ||
    vfrWaypointsLoading ||
    aerodromesLoading ||
    (runwaysLoading && userIsAdmin)
  )
    return <Loader />;

  if (
    statusListError ||
    vfrWaypointsError ||
    userWaypointsError ||
    aerodromesError ||
    (runwaysError && !!userIsAdmin)
  )
    throw new Error("");

  const tableStructure = useGetTableStructure(
    !!userIsAdmin,
    statusList.map((item) => item.status)
  );

  const tableOptions = [
    {
      key: "waypoints",
      title: "Waypoints",
      icon: <FaMapLocationDot />,
    },
    {
      key: "aerodromes",
      title: "Aerodromes",
      icon: <MdOutlineConnectingAirports />,
    },
  ];
  if (userIsAdmin)
    tableOptions.push({ key: "runways", title: "Runways", icon: <GiRoad /> });

  const sortData = tableStructure[tableIndex].sortData;
  const searchBarParameters = tableStructure[tableIndex].searchBarParameters;
  const filterParameters = tableStructure[tableIndex].filterParameters;

  const tableData = {
    keys: tableStructure[tableIndex].keys,
    headers: tableStructure[tableIndex].headers as unknown as {
      [key: string]: string;
    },
    rows:
      tableOptions[tableIndex].title === "Waypoints" &&
      userWaypoints &&
      vfrWaypoints
        ? [
            ...vfrWaypoints.map((vw) => ({
              id: vw.id,
              code: vw.code,
              name: vw.name,
              type: "Official",
              latitude: `${vw.lat_direction}${vw.lat_degrees}\u00B0${vw.lat_minutes}'${vw.lat_seconds}"`,
              longitude: `${vw.lon_direction}${vw.lon_degrees}\u00B0${vw.lon_minutes}'${vw.lon_seconds}"`,
              variation: `${Math.abs(
                vw.magnetic_variation ? vw.magnetic_variation : 0
              )}\u00B0${
                vw.magnetic_variation
                  ? vw.magnetic_variation < 0
                    ? "E"
                    : vw.magnetic_variation > 0
                    ? "W"
                    : ""
                  : ""
              }`,
              visible: !vw.hidden ? "Yes" : "No",
              handleEdit: () => {
                setTypeItemToEdit("VFR Waypoint");
                setRowToEditId(vw.id);
                editModal.handleOpen();
              },
              handleDelete: () => {
                setTypeItemToEdit("VFR Waypoint");
                setRowToEditId(vw.id);
                deleteModal.handleOpen();
              },
              permissions: !userIsAdmin ? undefined : ("delete" as "delete"),
            })),
            ...userWaypoints.map((uw) => ({
              id: uw.id,
              code: uw.code,
              name: uw.name,
              type: "User Added",
              latitude: `${uw.lat_direction}${uw.lat_degrees}\u00B0${uw.lat_minutes}'${uw.lat_seconds}"`,
              longitude: `${uw.lon_direction}${uw.lon_degrees}\u00B0${uw.lon_minutes}'${uw.lon_seconds}"`,
              variation: `${Math.abs(
                uw.magnetic_variation ? uw.magnetic_variation : 0
              )}\u00B0${
                uw.magnetic_variation
                  ? uw.magnetic_variation < 0
                    ? "E"
                    : uw.magnetic_variation > 0
                    ? "W"
                    : ""
                  : ""
              }`,
              visible: "Yes",
              handleEdit: () => {
                setTypeItemToEdit("userWaypoint");
                setRowToEditId(uw.id);
                editModal.handleOpen();
              },
              handleDelete: () => {
                setTypeItemToEdit("userWaypoint");
                setRowToEditId(uw.id);
                deleteModal.handleOpen();
              },
              permissions: "delete" as "delete",
            })),
          ]
        : tableOptions[tableIndex].title === "Aerodromes" && aerodromes
        ? aerodromes.map((a) => ({
            id: a.id,
            code: a.code,
            name: a.name,
            type: a.registered ? "Official" : "User Added",
            latitude: `${a.lat_direction}${a.lat_degrees}\u00B0${a.lat_minutes}'${a.lat_seconds}"`,
            longitude: `${a.lon_direction}${a.lon_degrees}\u00B0${a.lon_minutes}'${a.lon_seconds}"`,
            variation: `${Math.abs(
              a.magnetic_variation ? a.magnetic_variation : 0
            )}\u00B0${
              a.magnetic_variation
                ? a.magnetic_variation < 0
                  ? "E"
                  : a.magnetic_variation > 0
                  ? "W"
                  : ""
                : ""
            }`,
            status: a.status,
            elevation_ft: a.elevation_ft,
            runways: a.runways.length
              ? a.runways
                  .map(
                    (r) =>
                      `${r.number.toString().padStart(2, "0")}${
                        r.position ? r.position : ""
                      }`
                  )
                  .join(", ")
              : "-",
            weather: a.has_taf
              ? `TAF${(a.has_metar && ", METAR") || ""}${
                  (a.has_fds && ", FDs") || ""
                }`
              : a.has_metar
              ? `METAR${(a.has_fds && ", FDs") || ""}`
              : a.has_fds
              ? "FDs"
              : "-",
            visible: !a.hidden ? "Yes" : "No",
            has_taf: a.has_taf ? "Yes" : "No",
            has_metar: a.has_metar ? "Yes" : "No",
            has_fds: a.has_fds ? "Yes" : "No",
            handleEdit: a.registered
              ? `/waypoints/aerodrome/${a.id}`
              : `/waypoints/private-aerodrome/${a.id}`,
            handleDelete: () => {
              if (a.registered) setTypeItemToEdit("Official Aerodrome");
              else setTypeItemToEdit("userAerodrome");
              setRowToEditId(a.id);
              deleteModal.handleOpen();
            },
            permissions:
              !userIsAdmin && a.registered
                ? ("open" as "open")
                : ("open-delete" as "open-delete"),
          }))
        : tableOptions[tableIndex].title === "Runways" && runways
        ? runways.map((r) => ({
            id: r.id,
            aerodrome: r.aerodrome,
            aerodrome_name:
              aerodromes.find((a) => a.id === r.aerodrome_id)?.name || "-",
            aerodrome_status:
              aerodromes.find((a) => a.id === r.aerodrome_id)?.status ||
              "Unknown",
            runway: `${r.number < 10 ? "0" : ""}${r.number}${r.position || ""}`,
            length_ft: r.length_ft,
            thld_displ: r.landing_length_ft
              ? r.length_ft - r.landing_length_ft
              : "-",
            intersection_departure_length_ft: `${
              r.intersection_departure_length_ft || "-"
            }`,
            surface: r.surface,
            handleEdit: () => {
              setTypeItemToEdit("Runway");
              setRowToEditId(r.id);
              editRunwayModal.handleOpen();
            },
            handleDelete: () => {
              setTypeItemToEdit("Runway");
              setRowToEditId(r.id);
              deleteModal.handleOpen();
            },
            permissions: !userIsAdmin ? undefined : ("delete" as "delete"),
          }))
        : [],
    breakingPoint: 0,
  };

  const handleChangeTable = () => {
    if (tableIndex >= tableOptions.length - 1) setTableIndex(0);
    else setTableIndex(tableIndex + 1);
  };

  const vfrWaypointData = vfrWaypoints?.find((item) => item.id === rowToEditId);
  const userWaypointData = userWaypoints?.find(
    (item) => item.id === rowToEditId
  );
  const aerodromeData = aerodromes?.find((item) => item.id === rowToEditId);
  const runwayData = runways?.find((item) => item.id === rowToEditId);

  return (
    <>
      <Modal isOpen={editModal.isOpen}>
        {typeItemToEdit === "VFR Waypoint" && userIsAdmin ? (
          <EditVfrWaypointForm
            closeModal={editModal.handleClose}
            waypointData={
              vfrWaypointData
                ? {
                    id: vfrWaypointData.id,
                    code: vfrWaypointData.code,
                    name: vfrWaypointData.name,
                    lat_degrees: vfrWaypointData.lat_degrees,
                    lat_minutes: vfrWaypointData.lat_minutes,
                    lat_seconds: vfrWaypointData.lat_seconds,
                    lat_direction:
                      vfrWaypointData.lat_direction === "S" ? "South" : "North",
                    lon_degrees: vfrWaypointData.lon_degrees,
                    lon_minutes: vfrWaypointData.lon_minutes,
                    lon_seconds: vfrWaypointData.lon_seconds,
                    lon_direction:
                      vfrWaypointData.lon_direction === "E" ? "East" : "West",
                    magnetic_variation: vfrWaypointData.magnetic_variation,
                    hide: vfrWaypointData.hidden,
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
                    hide: true,
                  }
            }
            isOpen={editModal.isOpen}
          />
        ) : typeItemToEdit === "userWaypoint" ? (
          <EditUserWaypointForm
            isAdmin={!!userIsAdmin}
            closeModal={editModal.handleClose}
            waypointData={
              userWaypointData
                ? {
                    id: userWaypointData.id,
                    code: userWaypointData.code,
                    name: userWaypointData.name,
                    lat_degrees: userWaypointData.lat_degrees,
                    lat_minutes: userWaypointData.lat_minutes,
                    lat_seconds: userWaypointData.lat_seconds,
                    lat_direction:
                      userWaypointData.lat_direction === "S"
                        ? "South"
                        : "North",
                    lon_degrees: userWaypointData.lon_degrees,
                    lon_minutes: userWaypointData.lon_minutes,
                    lon_seconds: userWaypointData.lon_seconds,
                    lon_direction:
                      userWaypointData.lon_direction === "E" ? "East" : "West",
                    magnetic_variation: userWaypointData.magnetic_variation,
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
        ) : typeItemToEdit === "Official Aerodrome" && userIsAdmin ? (
          <EditOfficialAerodromeForm
            closeModal={editModal.handleClose}
            isOpen={editModal.isOpen}
            statusList={statusList}
            aerodromeData={{
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
              elevation_ft: 0,
              magnetic_variation: NaN,
              hide: true,
              has_taf: false,
              has_metar: false,
              has_fds: false,
              status:
                statusList.find((status) => status.id === 3)?.status ||
                "Unknown",
              status_id: 3,
            }}
          />
        ) : typeItemToEdit === "userAerodrome" ? (
          <EditUserAerodromeForm
            isAdmin={!!userIsAdmin}
            closeModal={editModal.handleClose}
            isOpen={editModal.isOpen}
            queryKey="all"
            aerodromeData={{
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
              elevation_ft: 0,
              magnetic_variation: NaN,
              status: 3,
            }}
          />
        ) : null}
      </Modal>
      {userIsAdmin ? (
        <Modal isOpen={editRunwayModal.isOpen}>
          <EditRunwayForm
            fromAerodrome={false}
            closeModal={editRunwayModal.handleClose}
            aerodromeName={
              aerodromes?.find((item) => item.id === runwayData?.aerodrome_id)
                ?.code || ""
            }
            runwayData={
              runwayData
                ? {
                    id: runwayData.id,
                    aerodromeId: runwayData.aerodrome_id,
                    number: runwayData.number,
                    position:
                      runwayData.position === "R"
                        ? "Right"
                        : runwayData.position === "L"
                        ? "Left"
                        : runwayData.position === "C"
                        ? "Center"
                        : "",
                    length_ft: runwayData.length_ft,
                    thld_displ: runwayData.landing_length_ft
                      ? runwayData.length_ft - runwayData.landing_length_ft
                      : null,
                    intersection_departure_length_ft:
                      runwayData.intersection_departure_length_ft
                        ? runwayData.intersection_departure_length_ft
                        : null,
                    surface: runwayData.surface,
                  }
                : {
                    id: 0,
                    aerodromeId: 0,
                    number: NaN,
                    position: "",
                    length_ft: NaN,
                    thld_displ: NaN,
                    intersection_departure_length_ft: NaN,
                    surface: "",
                  }
            }
            isOpen={editRunwayModal.isOpen}
          />
        </Modal>
      ) : null}
      <Modal isOpen={deleteModal.isOpen}>
        {typeItemToEdit === "userWaypoint" ? (
          <DeleteUserWaypointForm
            isAdmin={!!userIsAdmin}
            closeModal={deleteModal.handleClose}
            name={userWaypointData ? userWaypointData.name : ""}
            id={userWaypointData ? userWaypointData.id : 0}
          />
        ) : typeItemToEdit === "VFR Waypoint" && userIsAdmin ? (
          <DeleteVfrWaypointForm
            closeModal={deleteModal.handleClose}
            name={vfrWaypointData ? vfrWaypointData.name : ""}
            id={vfrWaypointData ? vfrWaypointData.id : 0}
          />
        ) : typeItemToEdit === "Official Aerodrome" && userIsAdmin ? (
          <DeleteVfrWaypointForm
            closeModal={deleteModal.handleClose}
            name={aerodromeData ? aerodromeData.name : ""}
            id={aerodromeData ? aerodromeData.id : 0}
            isAerodrome={true}
          />
        ) : typeItemToEdit === "userAerodrome" ? (
          <DeleteUserAerodromeForm
            isAdmin={!!userIsAdmin}
            closeModal={deleteModal.handleClose}
            name={aerodromeData ? aerodromeData.name : ""}
            id={aerodromeData ? aerodromeData.id : 0}
            queryKey="all"
          />
        ) : typeItemToEdit === "Runway" ? (
          <DeleteRunwayForm
            fromAerodrome={false}
            aerodromeName={
              aerodromes?.find((item) => item.id === runwayData?.aerodrome_id)
                ?.code || ""
            }
            closeModal={deleteModal.handleClose}
            name={
              runwayData
                ? `${runwayData.number < 10 ? "0" : ""}${runwayData.number}${
                    runwayData.position || ""
                  }`
                : ""
            }
            id={rowToEditId}
            aerodromeId={runwayData ? runwayData.aerodrome_id : 0}
          />
        ) : null}
      </Modal>
      <Modal isOpen={uploadCsvModal.isOpen} fullHeight={true}>
        {userIsAdmin ? (
          <FileForm
            closeModal={uploadCsvModal.handleClose}
            title={`Import ${typeItemToEdit}s from CSV File`}
            icon={
              typeItemToEdit === "Official Aerodrome" ? (
                <AerodromeIcon />
              ) : typeItemToEdit === "Runway" ? (
                <RunwayIcon />
              ) : (
                <WaypointIcon />
              )
            }
            instructions={getCsvUploadingInstructions(
              typeItemToEdit === "Official Aerodrome"
                ? "aerodromes"
                : typeItemToEdit === "Runway"
                ? "runways"
                : "waypoints"
            )}
            submissionData={
              typeItemToEdit === "Official Aerodrome"
                ? {
                    path: "manage-waypoints/aerodromes",
                    successMessage: "Official Aerodromes'",
                    queryKey: [],
                  }
                : typeItemToEdit === "Runway"
                ? {
                    path: "runways/csv",
                    successMessage: "Runways'",
                    queryKey: [],
                  }
                : {
                    path: "manage-waypoints",
                    successMessage: "VFR Waypoints'",
                    queryKey: [],
                  }
            }
            modalIsOpen={uploadCsvModal.isOpen}
          />
        ) : null}
      </Modal>
      <ContentLayout
        sideBarContent={
          <SideBarContent
            handleAddUserAerodrome={() => {
              setTypeItemToEdit("userAerodrome");
              setRowToEditId(0);
              editModal.handleOpen();
            }}
            handleAddUserWaypoint={() => {
              setTypeItemToEdit("userWaypoint");
              setRowToEditId(0);
              editModal.handleOpen();
            }}
            handleAddOfficialAerodrome={() => {
              setTypeItemToEdit("Official Aerodrome");
              setRowToEditId(0);
              editModal.handleOpen();
            }}
            handleAddVFRWaypoint={() => {
              setTypeItemToEdit("VFR Waypoint");
              setRowToEditId(0);
              editModal.handleOpen();
            }}
            handleManageAerodromes={() => {
              setTypeItemToEdit("Official Aerodrome");
              uploadCsvModal.handleOpen();
            }}
            handleManageWaypoints={() => {
              setTypeItemToEdit("VFR Waypoint");
              uploadCsvModal.handleOpen();
            }}
            handleManageRunways={() => {
              setTypeItemToEdit("Runway");
              uploadCsvModal.handleOpen();
            }}
            isAdmin={!!userIsAdmin}
          />
        }
      >
        <HtmlContainer>
          <HtmlTitleContainer>
            <h1>
              {tableOptions[tableIndex].icon}
              {tableOptions[tableIndex].title}
            </h1>
            <ChangeIcon onClick={handleChangeTable} />
          </HtmlTitleContainer>
          <HtmlTableContainer>
            <Table
              tableData={tableData}
              sortColumnOptions={sortData}
              pageSize={10}
              searchBarParameters={searchBarParameters}
              filterParameters={filterParameters}
              emptyTableMessage={`No ${tableOptions[tableIndex].title}...`}
            />
          </HtmlTableContainer>
        </HtmlContainer>
      </ContentLayout>
    </>
  );
};

export default Waypoints;