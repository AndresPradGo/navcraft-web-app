import { BiSolidPlaneLand, BiSolidPlaneTakeOff } from "react-icons/bi";
import { FaTools } from "react-icons/fa";
import { GrMapLocation } from "react-icons/gr";
import { LuRefreshCw } from "react-icons/lu";
import { MdConnectingAirports } from "react-icons/md";
import { PiGearDuotone } from "react-icons/pi";
import { RiDeleteBinLine } from "react-icons/ri";
import { TbMapOff } from "react-icons/tb";
import { styled } from "styled-components";

import SideBarIndex, {
  PageSectionDataType,
} from "../../../components/common/SideBarIndex";
import SideBarBtnList from "../../../components/common/SideBarBtnList";
import SideBarTitle from "../../../components/common/SideBarTitle";
import Button from "../../../components/common/button/index";

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

const ToolsIcon = styled(FaTools)`
  font-size: 20px;
  margin-right: 8px;
  padding-bottom: 3px;
`;

const EditIcon = styled(PiGearDuotone)`
  font-size: 25px;
  margin-left: 5px;
`;

const DepartureIcon = styled(BiSolidPlaneTakeOff)`
  font-size: 25px;
  margin-left: 5px;
`;

const ArrivalIcon = styled(BiSolidPlaneLand)`
  font-size: 25px;
  margin-left: 5px;
`;

const AircraftIcon = styled(MdConnectingAirports)`
  font-size: 30px;
  margin-left: 5px;
`;

const RefreshIcon = styled(LuRefreshCw)`
  font-size: 20px;
  margin-left: 5px;
`;

const DeleteIcon = styled(RiDeleteBinLine)`
  font-size: 20px;
  margin-left: 5px;
`;

const MapIcon = styled(GrMapLocation)`
  font-size: 23px;
`;

const CloseMapIcon = styled(TbMapOff)`
  font-size: 25px;
`;

interface Props {
  mapIsOpen: {
    value: boolean;
    setter: (value: boolean) => void;
  };
  handleChangeSection: (index: number) => void;
  sectionIndex: number;
  sectionOptions: PageSectionDataType[];
  handleEditFlight: () => void;
  handleEditDeparture: () => void;
  handleEditArrival: () => void;
  handleChangeAircraft: () => void;
  handleRefreshWeather: () => void;
  handleDeleteFlight: () => void;
}

const SideBarContent = ({
  mapIsOpen,
  handleChangeSection,
  sectionIndex,
  sectionOptions,
  handleEditFlight,
  handleEditDeparture,
  handleEditArrival,
  handleChangeAircraft,
  handleRefreshWeather,
  handleDeleteFlight,
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
  const commonStyles = {
    ...baseStyles,
    color: "var(--color-grey-bright)",
    hoverColor: "var(--color-white)",
    backgroundColor: "var(--color-primary-bright)",
    backgroundHoverColor: "var(--color-primary-light)",
  };

  const buttons = [
    {
      text: "Edit Flight Settings",
      icon: <EditIcon />,
      styles: { ...commonStyles },
      onClick: handleEditFlight,
    },
    {
      text: "Edit Departure Settings",
      icon: <DepartureIcon />,
      styles: { ...commonStyles },
      onClick: handleEditDeparture,
    },
    {
      text: "Edit Arrival Settings",
      icon: <ArrivalIcon />,
      styles: { ...commonStyles },
      onClick: handleEditArrival,
    },
    {
      text: "Change Aircraft",
      icon: <AircraftIcon />,
      styles: { ...commonStyles },
      onClick: handleChangeAircraft,
    },
    {
      text: "Refresh Weather Data",
      icon: <RefreshIcon />,
      styles: { ...baseStyles },
      onClick: handleRefreshWeather,
    },
    {
      text: "Delete Flight",
      icon: <DeleteIcon />,
      styles: {
        ...commonStyles,
        backgroundColor: "var(--color-warning)",
        backgroundHoverColor: "var(--color-warning-hover)",
      },
      onClick: handleDeleteFlight,
    },
  ];

  return (
    <HtmlContainer>
      <SideBarTitle>Flight</SideBarTitle>
      {mapIsOpen.value ? (
        <Button
          color="var(--color-primary-dark)"
          hoverColor="var(--color-grey-dark)"
          backgroundColor="var(--color-contrast)"
          backgroundHoverColor="var(--color-contrast-hover)"
          width="250px"
          height="45px"
          fontSize={18}
          shadow={true}
          spaceChildren="space-evenly"
          borderRadious={5}
          onlyHover={true}
          margin="20px 10px 20px"
          handleClick={() => {
            mapIsOpen.setter(false);
          }}
        >
          Close Map
          <CloseMapIcon />
        </Button>
      ) : (
        <Button
          color="var(--color-primary-dark)"
          hoverColor="var(--color-grey-dark)"
          backgroundColor="var(--color-contrast)"
          backgroundHoverColor="var(--color-contrast-hover)"
          width="250px"
          height="45px"
          fontSize={18}
          shadow={true}
          spaceChildren="space-evenly"
          borderRadious={5}
          margin="20px 10px 20px"
          onlyHover={true}
          handleClick={() => {
            mapIsOpen.setter(true);
          }}
        >
          Open Map
          <MapIcon />
        </Button>
      )}
      <SideBarIndex
        handleChangeSection={handleChangeSection}
        selectedIdx={sectionIndex}
        sectionOptions={sectionOptions}
      />
      <SideBarBtnList
        titleIcon={<ToolsIcon />}
        title="Edit-Flight Tools"
        buttons={buttons}
      />
    </HtmlContainer>
  );
};

export default SideBarContent;
