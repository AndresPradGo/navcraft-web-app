import { ReactNode, useState } from "react";
import { useParams } from "react-router-dom";
import { MdOutlineStart } from "react-icons/md";
import { SlBadge } from "react-icons/sl";
import { LiaMapSignsSolid, LiaMountainSolid } from "react-icons/lia";
import { ImCompass2 } from "react-icons/im";
import { PiEyeBold } from "react-icons/pi";
import { TbMapSearch, TbWorldLatitude, TbWorldLongitude } from "react-icons/tb";
import { GiWindsock } from "react-icons/gi";
import { MdOutlineConnectingAirports } from "react-icons/md";
import { styled } from "styled-components";

import { ContentLayout } from "../layout";
import useAerodromeData from "./useAerodromeData";
import Loader from "../../components/Loader";
import RunwaysTable from "./RunwaysTable";
import { Modal, useModal } from "../../components/common/modal";
import SideBarContent from "./SideBarContent";
import DeleteUserAerodromeForm from "../../components/deleteUserAerodromeForm";
import EditUserAerodromeForm from "../../components/editUserAerodromeForm";
import useAuth from "../../hooks/useAuth";
import usePathList from "../../router/usePathList";
import EditOfficialAerodromeForm from "../../components/editOfficialAerodromeForm";
import useAerodromeStatusList from "../../hooks/useAerodromeStatusList";
import DeleteVfrWaypointForm from "../../components/deleteVfrWaypointForm/index";

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

    @media screen and (min-width: 425px) {
      font-size: 35px;

      & svg {
        margin: 0 10px 0 0;
        font-size: 50px;
      }
    }
  }

  & div:first-of-type {
    margin: 0 10px 10px;
    padding-left: 10px;
    color: var(--color-grey);
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    align-content: flex-start;

    & span {
      margin: 0 0 10px;
      display: flex;
      align-items: center;

      & i {
        padding: 0;
      }

      & svg {
        font-size: 25px;
        margin: 0 10px;
      }
    }

    & span:last-of-type {
      flex-wrap: wrap;
      & i:last-of-type {
        color: var(--color-grey-bright);
        padding: 0 0 0 10px;
        text-wrap: wrap;
      }
    }
  }
`;

const HtmlDataList = styled.ul`
  margin: 35px 0;
  list-style: none;
  width: 100%;
  align-self: center;
  max-width: 800px;
  padding: 0;

  & li {
    width: 100%;
    margin: 5px 0;
    padding: 20px 5px 5px;
    border-bottom: 1px solid var(--color-grey);
    display: flex;
    justify-content: space-between;
    align-items: center;

    & h3 {
      padding-right: 8px;
      margin: 0;
      display: flex;
      align-items: center;
      color: var(--color-white);
    }

    & span {
      text-wrap: wrap;
      text-align: right;
      padding-left: 8px;
    }
  }

  @media screen and (min-width: 425px) {
    & li {
      padding: 20px 10px 5px;
    }
  }
`;

const CodeIcon = styled(TbMapSearch)`
  font-size: 25px;
  margin: 0 10px 0 0;
`;

const NameIcon = styled(LiaMapSignsSolid)`
  font-size: 25px;
  margin: 0 10px 0 0;
`;

const LatitudeIcon = styled(TbWorldLatitude)`
  font-size: 25px;
  margin: 0 10px 0 0;
`;

const LongitudeIcon = styled(TbWorldLongitude)`
  font-size: 25px;
  margin: 0 10px 0 0;
`;

const CompassIcon = styled(ImCompass2)`
  font-size: 25px;
  margin: 0 10px 0 0;
`;

const TerrainIcon = styled(LiaMountainSolid)`
  font-size: 30px;
  margin: 0 10px 0 0;
`;

const StatusIcon = styled(SlBadge)`
  font-size: 25px;
  margin: 0 10px 0 0;
`;

const VisibleIcon = styled(PiEyeBold)`
  font-size: 30px;
  margin: 0 10px 0 0;
`;

const WeatherIcon = styled(GiWindsock)`
  font-size: 30px;
  margin: 0 10px 0 0;
`;

const AerodromePage = () => {
  const user = useAuth();
  const pathname = usePathList();

  const privateEndpoint = pathname[1] === "private-aerodrome";
  const adminUser = !!user?.is_admin;

  const [runwayId, setRunwayId] = useState<number>(0);
  const { id } = useParams();
  const editRunwayModal = useModal();
  const editModal = useModal();
  const deleteModal = useModal();

  const {
    data: statusList,
    isLoading: statusListIsLoading,
    error: statusListError,
  } = useAerodromeStatusList();

  if (statusListError) throw new Error("");

  const {
    data: aerodromeData,
    error,
    isLoading,
  } = useAerodromeData(parseInt(id || "0") || 0);
  const isPrivateData = !aerodromeData?.registered;
  if (
    (error && error.message !== "Network Error") ||
    (isPrivateData !== privateEndpoint && aerodromeData !== undefined)
  )
    throw new Error("notFound");
  else if ((error && error.message === "Network Error") || statusListError)
    throw new Error("");
  if (isLoading || statusListIsLoading) return <Loader />;

  const userCanEdit = adminUser || isPrivateData;

  interface AerodromeDataDisplay {
    key: string;
    title: string;
    icon: ReactNode;
    data: string;
  }

  const aerodromeDataList = [
    {
      key: "code",
      title: "Code",
      icon: <CodeIcon />,
      data: aerodromeData?.code,
    },
    {
      key: "name",
      title: "Name",
      icon: <NameIcon />,
      data: aerodromeData?.name,
    },
    {
      key: "latitude",
      title: "Latitude",
      icon: <LatitudeIcon />,
      data: `${aerodromeData?.lat_direction} ${aerodromeData?.lat_degrees}\u00B0 ${aerodromeData?.lat_minutes}' ${aerodromeData?.lat_seconds}"`,
    },
    {
      key: "longitude",
      title: "Longitude",
      icon: <LongitudeIcon />,
      data: `${aerodromeData?.lon_direction} ${aerodromeData?.lon_degrees}\u00B0 ${aerodromeData?.lon_minutes}' ${aerodromeData?.lon_seconds}"`,
    },
    {
      key: "elevation_ft",
      title: "Elevation [ft]",
      icon: <TerrainIcon />,
      data: aerodromeData?.elevation_ft,
    },
    {
      key: "magnetic_variation",
      title: "Magnetic Var",
      icon: <CompassIcon />,
      data: `${Math.abs(
        aerodromeData?.magnetic_variation
          ? aerodromeData?.magnetic_variation
          : 0
      )}\u00B0${
        aerodromeData?.magnetic_variation
          ? aerodromeData?.magnetic_variation < 0
            ? "E"
            : aerodromeData?.magnetic_variation > 0
            ? "W"
            : ""
          : ""
      }`,
    },
    {
      key: "status",
      title: "Status",
      icon: <StatusIcon />,
      data: aerodromeData?.status,
    },
  ] as AerodromeDataDisplay[];

  if (!isPrivateData) {
    aerodromeDataList.push({
      key: "weather",
      title: "Available Weather",
      icon: <WeatherIcon />,
      data: aerodromeData?.has_taf
        ? `TAF${(aerodromeData?.has_metar && ", METAR") || ""}${
            (aerodromeData?.has_fds && ", FDs") || ""
          }`
        : aerodromeData?.has_metar
        ? `METAR${(aerodromeData?.has_fds && ", FDs") || ""}`
        : aerodromeData?.has_fds
        ? "FDs"
        : "-",
    });
    if (adminUser) {
      aerodromeDataList.push({
        key: "visible",
        title: "Visible",
        icon: <VisibleIcon />,
        data: aerodromeData.hidden ? "No" : "Yes",
      });
    }
  }

  return (
    <>
      {userCanEdit ? (
        <>
          <Modal isOpen={editModal.isOpen}>
            {!isPrivateData ? (
              <EditOfficialAerodromeForm
                closeModal={editModal.handleClose}
                statusList={statusList}
                aerodromeData={
                  aerodromeData
                    ? {
                        id: aerodromeData.id,
                        code: aerodromeData.code,
                        name: aerodromeData.name,
                        lat_degrees: aerodromeData.lat_degrees,
                        lat_minutes: aerodromeData.lat_minutes,
                        lat_seconds: aerodromeData.lat_seconds,
                        lat_direction:
                          aerodromeData.lat_direction === "S"
                            ? "South"
                            : "North",
                        lon_degrees: aerodromeData.lon_degrees,
                        lon_minutes: aerodromeData.lon_minutes,
                        lon_seconds: aerodromeData.lon_seconds,
                        lon_direction:
                          aerodromeData.lon_direction === "E" ? "East" : "West",
                        elevation_ft: aerodromeData.elevation_ft,
                        magnetic_variation: aerodromeData.magnetic_variation,
                        status: aerodromeData.status,
                        status_id:
                          statusList.find(
                            (item) => aerodromeData.status === item.status
                          )?.id || 3,
                        hide: aerodromeData.hidden,
                        has_taf: aerodromeData.has_taf,
                        has_metar: aerodromeData.has_metar,
                        has_fds: aerodromeData.has_fds,
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
                        elevation_ft: 0,
                        magnetic_variation: 0,
                        status: "Unknown",
                        status_id: 3,
                        hide: true,
                        has_taf: false,
                        has_metar: false,
                        has_fds: false,
                      }
                }
                isOpen={editModal.isOpen}
              />
            ) : (
              <EditUserAerodromeForm
                queryKey={"all"}
                closeModal={editModal.handleClose}
                aerodromeData={
                  aerodromeData
                    ? {
                        id: aerodromeData.id,
                        code: aerodromeData.code,
                        name: aerodromeData.name,
                        lat_degrees: aerodromeData.lat_degrees,
                        lat_minutes: aerodromeData.lat_minutes,
                        lat_seconds: aerodromeData.lat_seconds,
                        lat_direction:
                          aerodromeData.lat_direction === "S"
                            ? "South"
                            : "North",
                        lon_degrees: aerodromeData.lon_degrees,
                        lon_minutes: aerodromeData.lon_minutes,
                        lon_seconds: aerodromeData.lon_seconds,
                        lon_direction:
                          aerodromeData.lon_direction === "E" ? "East" : "West",
                        elevation_ft: aerodromeData.elevation_ft,
                        magnetic_variation: aerodromeData.magnetic_variation,
                        status: 6,
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
                        elevation_ft: 0,
                        magnetic_variation: 0,
                        status: 6,
                      }
                }
                isOpen={editModal.isOpen}
              />
            )}
          </Modal>
          <Modal isOpen={deleteModal.isOpen}>
            {!isPrivateData ? (
              <DeleteVfrWaypointForm
                closeModal={deleteModal.handleClose}
                name={aerodromeData?.name || ""}
                id={aerodromeData?.id || 0}
                isAerodrome={true}
                redirect={true}
              />
            ) : (
              <DeleteUserAerodromeForm
                closeModal={deleteModal.handleClose}
                name={aerodromeData?.name || ""}
                id={aerodromeData?.id || 0}
                redirect={true}
                queryKey="all"
              />
            )}
          </Modal>
        </>
      ) : null}
      <ContentLayout
        sideBarContent={
          userCanEdit ? (
            <SideBarContent
              handleDeleteAerodrome={deleteModal.handleOpen}
              handleAddRunway={() => {
                setRunwayId(0);
                editRunwayModal.handleOpen();
              }}
              handleEditAerodrome={editModal.handleOpen}
            />
          ) : (
            ""
          )
        }
      >
        <HtmlContainer>
          <HtmlTitleContainer>
            <div>
              <span>
                <i>Waypoints</i> <MdOutlineStart />
              </span>
              <span>
                <i>Private Aerodrome:</i>
                <i>{aerodromeData?.code}</i>
              </span>
            </div>
            <h1>
              <MdOutlineConnectingAirports />
              {aerodromeData?.name}
            </h1>
          </HtmlTitleContainer>
          <HtmlDataList>
            {aerodromeDataList.map((item) => {
              return (
                <li key={item.key}>
                  <h3>
                    {item.icon}
                    {item.title}
                  </h3>
                  <span>{item.data}</span>
                </li>
              );
            })}
          </HtmlDataList>
          <RunwaysTable
            canEdit={userCanEdit}
            editModal={editRunwayModal}
            runwaysData={aerodromeData?.runways || []}
            aerodromeId={aerodromeData?.id || 0}
            runwayId={runwayId}
            setRunwayId={setRunwayId}
          />
        </HtmlContainer>
      </ContentLayout>
    </>
  );
};

export default AerodromePage;
