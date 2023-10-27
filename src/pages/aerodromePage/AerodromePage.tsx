import { ReactNode, useState } from "react";
import { useParams } from "react-router-dom";
import { MdOutlineStart } from "react-icons/md";
import { SlBadge } from "react-icons/sl";
import { LiaMapSignsSolid, LiaMountainSolid } from "react-icons/lia";
import { ImCompass2 } from "react-icons/im";
import { TbMapSearch, TbWorldLatitude, TbWorldLongitude } from "react-icons/tb";
import { MdOutlineConnectingAirports } from "react-icons/md";
import { styled } from "styled-components";

import { ContentLayout } from "../layout";
import useAerodromeData from "./useAerodromeData";
import Loader from "../../components/Loader";
import RunwaysTable from "./RunwaysTable";
import { Modal, useModal } from "../../components/common/modal";
import SideBarContent from "./SideBarContent";
import DeleteUserAerodromeForm from "../../components/deleteUserAerodromeForm";

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

const AerodromePage = () => {
  const [runwayId, setRunwayId] = useState<number>(0);
  const { id } = useParams();
  const editRunwayModal = useModal();
  const deleteModal = useModal();

  const {
    data: aerodromeData,
    error,
    isLoading,
  } = useAerodromeData(parseInt(id || "0") || 0);
  if ((error && error.message !== "Network Error") || aerodromeData?.registered)
    throw new Error("notFound");
  else if (error && error.message === "Network Error") throw new Error("");
  if (isLoading) return <Loader />;

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

  return (
    <>
      <Modal isOpen={deleteModal.isOpen}>
        <DeleteUserAerodromeForm
          closeModal={deleteModal.handleClose}
          name={aerodromeData?.name || ""}
          id={aerodromeData?.id || 0}
        />
      </Modal>
      <ContentLayout
        sideBarContent={
          <SideBarContent
            handleDeleteAerodrome={deleteModal.handleOpen}
            handleAddRunway={() => {
              setRunwayId(0);
              editRunwayModal.handleOpen();
            }}
          />
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
