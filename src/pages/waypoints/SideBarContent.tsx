import { FaTools } from "react-icons/fa";
import {
  FaUser,
  FaUserShield,
  FaFileExport,
  FaDownload,
} from "react-icons/fa6";
import { PiAirTrafficControlFill } from "react-icons/pi";
import { TbMapPinPlus, TbMapPin, TbRoad } from "react-icons/tb";
import { styled } from "styled-components";

import useFetchFile from "../../hooks/useFetchFile";
import SideBarIndex, {
  PageSectionDataType,
} from "../../components/common/SideBarIndex";
import SideBarBtnList from "../../components/common/SideBarBtnList";
import SideBarTitle from "../../components/common/SideBarTitle";

const HtmlContainer = styled.div`
  margin: 15px 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 0;
  min-height: 300px;
`;

const AddAerodromeIcon = styled(PiAirTrafficControlFill)`
  font-size: 25px;
  margin-left: 5px;
`;

const AddWaypointIcon = styled(TbMapPinPlus)`
  font-size: 20px;
  margin-left: 5px;
`;

const WaypointIcon = styled(TbMapPin)`
  font-size: 20px;
  margin-left: 5px;
`;

const RunwayIcon = styled(TbRoad)`
  font-size: 20px;
  margin-left: 5px;
`;

const UserIcon = styled(FaUser)`
  font-size: 20px;
  margin-right: 8px;
  padding-bottom: 3px;
`;

const AdminIcon = styled(FaUserShield)`
  font-size: 20px;
  margin-right: 8px;
  padding-bottom: 3px;
`;

const ToolsIcon = styled(FaTools)`
  font-size: 20px;
  margin-right: 8px;
  padding-bottom: 3px;
`;

const ImportIcon = styled(FaFileExport)`
  font-size: 20px;
  margin-right: 8px;
  padding-bottom: 3px;
`;

const DownloadIcon = styled(FaDownload)`
  font-size: 20px;
  margin-right: 8px;
  padding-bottom: 3px;
`;

interface Props {
  handleAddUserAerodrome: () => void;
  handleAddUserWaypoint: () => void;
  handleAddOfficialAerodrome: () => void;
  handleAddVFRWaypoint: () => void;
  handleManageAerodromes: () => void;
  handleManageWaypoints: () => void;
  handleManageRunways: () => void;
  isAdmin: boolean;
  handleChangeSection: (index: number) => void;
  sectionIndex: number;
  sectionOptions: PageSectionDataType[];
}

const SideBarContent = ({
  handleAddUserAerodrome,
  handleAddUserWaypoint,
  handleAddOfficialAerodrome,
  handleAddVFRWaypoint,
  handleManageAerodromes,
  handleManageWaypoints,
  handleManageRunways,
  isAdmin,
  handleChangeSection,
  sectionIndex,
  sectionOptions,
}: Props) => {
  const fileFetcher = useFetchFile();

  const baseStyles = {
    width: "100%",
    height: "40px",
    fontSize: 15,
    margin: "5px 0",
    fill: true,
    borderWidth: 3,
    borderRadious: 4,
  };
  const commonStyles = {
    ...baseStyles,
    color: "var(--color-white)",
    hoverColor: "var(--color-white)",
    backgroundColor: "var(--color-primary-bright)",
    backgroundHoverColor: "var(--color-primary-light)",
  };

  const userButtons = [
    {
      text: isAdmin ? "Add User Aerodrome" : "Add Aerodrome",
      icon: <AddAerodromeIcon />,
      styles: {
        ...commonStyles,
      },
      onClick: handleAddUserAerodrome,
    },
    {
      text: isAdmin ? "Add User Waypoint" : "Add Waypoint",
      icon: <AddWaypointIcon />,
      styles: {
        ...commonStyles,
      },
      onClick: handleAddUserWaypoint,
    },
  ];

  const adminButtons = [
    {
      text: "Add Official Aerodrome",
      icon: <AddAerodromeIcon />,
      styles: {
        ...commonStyles,
      },
      onClick: handleAddOfficialAerodrome,
    },
    {
      text: "Add VFR Waypoint",
      icon: <AddWaypointIcon />,
      styles: {
        ...commonStyles,
      },
      onClick: handleAddVFRWaypoint,
    },
  ];

  const downloadButtons = [
    {
      text: "Official Aerodromes",
      icon: <AddAerodromeIcon />,
      styles: {
        ...baseStyles,
      },
      onClick: () => {
        fileFetcher("manage-waypoints/aerodromes");
      },
    },
    {
      text: "VFR Waypoints",
      icon: <WaypointIcon />,
      styles: {
        ...baseStyles,
      },
      onClick: () => {
        fileFetcher("manage-waypoints");
      },
    },
    {
      text: "Runways",
      icon: <RunwayIcon />,
      styles: {
        ...baseStyles,
      },
      onClick: () => {
        fileFetcher("runways/csv");
      },
    },
  ];

  const importButtons = [
    {
      text: "Official Aerodromes",
      icon: <AddAerodromeIcon />,
      styles: {
        ...commonStyles,
      },
      onClick: handleManageAerodromes,
    },
    {
      text: "VFR Waypoints",
      icon: <WaypointIcon />,
      styles: {
        ...commonStyles,
      },
      onClick: handleManageWaypoints,
    },
    {
      text: "Runways",
      icon: <RunwayIcon />,
      styles: {
        ...commonStyles,
      },
      onClick: handleManageRunways,
    },
  ];

  return (
    <HtmlContainer>
      <SideBarTitle>Waypoints & Aerodromes</SideBarTitle>
      <SideBarIndex
        handleChangeSection={handleChangeSection}
        selectedIdx={sectionIndex}
        sectionOptions={sectionOptions}
      />
      <SideBarBtnList
        titleIcon={isAdmin ? <UserIcon /> : <ToolsIcon />}
        title={`${isAdmin ? "User " : ""}Tools`}
        buttons={userButtons}
      />
      {isAdmin ? (
        <>
          <SideBarBtnList
            titleIcon={<AdminIcon />}
            title="Admin Tools"
            buttons={adminButtons}
          />
          <SideBarBtnList
            titleIcon={<DownloadIcon />}
            title="Export Data to CSV File"
            buttons={downloadButtons}
          />
          <SideBarBtnList
            titleIcon={<ImportIcon />}
            title="Bulk Import from CSV File"
            buttons={importButtons}
          />
        </>
      ) : null}
    </HtmlContainer>
  );
};

export default SideBarContent;
