import { AiOutlineSwap } from "react-icons/ai";
import {
  FaUser,
  FaUserShield,
  FaFileExport,
  FaDownload,
} from "react-icons/fa6";
import { PiAirTrafficControlFill } from "react-icons/pi";
import { TbMapPinPlus, TbMapPin, TbRoad } from "react-icons/tb";

import { styled } from "styled-components";
import Button from "../../components/common/button";
import useFetchFile from "../../hooks/useFetchFile";
import useSideBar from "../../components/sidebar/useSideBar";

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

const HtmlButtonList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 15px 8px;

  & h3 {
    padding: 0 10px;
    color: var(--color-grey-bright);
    margin: 0;
    display: flex;
    align-items: center;
    width: 100%;
  }

  & div {
    width: 100%;
    padding: 10px 8px;
    border-top: 1px solid var(--color-grey);
  }

  @media screen and (min-width: 635px) {
    padding: 10px;

    & div {
      padding: 10px 13px;
    }
  }

  @media screen and (min-width: 1280px) {
    padding: 18px;

    & div {
      padding: 10px 18px;
    }
  }
`;

const AddAerodromeIcon = styled(PiAirTrafficControlFill)`
  font-size: 25px;
  margin-left: 5px;
`;

const ChangeIcon = styled(AiOutlineSwap)`
  flex-shrink: 0;
  font-size: 20px;
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
  handleSwap: () => void;
  nextList: string;
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
  handleSwap,
  nextList,
}: Props) => {
  const baseStyles = {
    width: "100%",
    height: "40px",
    fontSize: 15,
    margin: "5px 0",
    fill: true,
    borderWidth: 3,
    borderRadious: 4,
  };
  const sideBar = useSideBar();
  const fileFetcher = useFetchFile();

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
        ...commonStyles,
      },
      onClick: () => {
        fileFetcher("manage-waypoints/aerodromes");
      },
    },
    {
      text: "VFR Waypoints",
      icon: <WaypointIcon />,
      styles: {
        ...commonStyles,
      },
      onClick: () => {
        fileFetcher("manage-waypoints");
      },
    },
    {
      text: "Runways",
      icon: <RunwayIcon />,
      styles: {
        ...commonStyles,
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
        ...baseStyles,
      },
      onClick: handleManageAerodromes,
    },
    {
      text: "VFR Waypoints",
      icon: <WaypointIcon />,
      styles: {
        ...baseStyles,
      },
      onClick: handleManageWaypoints,
    },
    {
      text: "Runways",
      icon: <RunwayIcon />,
      styles: {
        ...baseStyles,
      },
      onClick: handleManageRunways,
    },
  ];

  return (
    <HtmlContainer>
      <Button
        handleClick={() => {
          handleSwap();
          sideBar.handleExpandSideBar(false);
        }}
        color="var(--color-contrast)"
        hoverColor="var(--color-contrast-hover)"
        backgroundColor="transparent"
        backgroundHoverColor="transparent"
        fill={false}
        width="205px"
        spaceChildren="space-between"
        borderWidth={0}
        fontSize={20}
        margin="40px 0 20px"
        padding="0"
        onlyHover={true}
      >
        {`See ${nextList}`}
        <ChangeIcon />
      </Button>
      <HtmlButtonList>
        {isAdmin ? (
          <h3>
            <UserIcon />
            {"User Tools"}
          </h3>
        ) : null}
        <div>
          {userButtons.map((button, index) => (
            <Button key={index} {...button.styles} handleClick={button.onClick}>
              {button.text}
              {button.icon}
            </Button>
          ))}
        </div>
      </HtmlButtonList>
      {isAdmin ? (
        <>
          <HtmlButtonList>
            <h3>
              <AdminIcon />
              {"Admin Tools"}
            </h3>
            <div>
              {adminButtons.map((button, index) => (
                <Button
                  key={index}
                  {...button.styles}
                  handleClick={button.onClick}
                >
                  {button.text}
                  {button.icon}
                </Button>
              ))}
            </div>
          </HtmlButtonList>
          <HtmlButtonList>
            <h3>
              <DownloadIcon />
              {"Export Data to CSV File"}
            </h3>
            <div>
              {downloadButtons.map((button, index) => (
                <Button
                  key={index}
                  {...button.styles}
                  handleClick={button.onClick}
                >
                  {button.text}
                  {button.icon}
                </Button>
              ))}
            </div>
          </HtmlButtonList>
          <HtmlButtonList>
            <h3>
              <ImportIcon />
              {"Bulk Import from CSV File"}
            </h3>
            <div>
              {importButtons.map((button, index) => (
                <Button
                  key={index}
                  {...button.styles}
                  handleClick={button.onClick}
                >
                  {button.text}
                  {button.icon}
                </Button>
              ))}
            </div>
          </HtmlButtonList>
        </>
      ) : null}
    </HtmlContainer>
  );
};

export default SideBarContent;
