import { BiSolidPlaneLand, BiSolidPlaneTakeOff } from "react-icons/bi";
import { FaClipboardList, FaTools } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import { LuRefreshCw } from "react-icons/lu";
import { MdConnectingAirports } from "react-icons/md";
import { PiGearDuotone } from "react-icons/pi";
import { RiDeleteBinLine } from "react-icons/ri";
import { VscGraphLine } from "react-icons/vsc";
import { styled } from "styled-components";

import SideBarIndex, {
  PageSectionDataType,
} from "../../../components/common/SideBarIndex";
import SideBarBtnList from "../../../components/common/SideBarBtnList";
import SideBarTitle from "../../../components/common/SideBarTitle";
import SideBarMapOptions, {
  MapStateType,
  MapInputStyleType,
} from "../../../components/SideBarMapOptions";
import useFetchFile from "../../../hooks/useFetchFile";

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

const DownloadIcon = styled(FaDownload)`
  font-size: 20px;
  margin-right: 8px;
  padding-bottom: 3px;
`;

const ReportIcon = styled(FaClipboardList)`
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

const GraphIcon = styled(VscGraphLine)`
  font-size: 20px;
  margin-left: 5px;
`;

const DeleteIcon = styled(RiDeleteBinLine)`
  font-size: 20px;
  margin-left: 5px;
`;

interface Props {
  flightId: number;
  mapState: MapStateType;
  mapStateSetter: (key: keyof MapStateType, value: boolean) => void;
  mapInputs: MapInputStyleType[];
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
  flightId,
  mapState,
  mapStateSetter,
  mapInputs,
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
      styles: { ...commonStyles },
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

  const downloadButtons = [
    {
      text: "Download Nav Log",
      icon: <ReportIcon />,
      styles: { ...baseStyles },
      onClick: () => {
        fileFetcher(`flight-plans/nav-log/csv/${flightId}`);
      },
    },
    {
      text: "Download W&B Graph",
      icon: <GraphIcon />,
      styles: { ...baseStyles },
      onClick: () => {
        fileFetcher(`flight-plans/weight-balance-graph/${flightId}`);
      },
    },
  ];

  return (
    <HtmlContainer>
      <SideBarTitle>Flight</SideBarTitle>
      <SideBarMapOptions
        mapState={mapState}
        mapStateSetter={mapStateSetter}
        inputs={mapInputs}
      />
      <SideBarIndex
        handleChangeSection={handleChangeSection}
        selectedIdx={sectionIndex}
        sectionOptions={sectionOptions}
      />
      <SideBarBtnList
        titleIcon={<ToolsIcon />}
        title="Flight Tools"
        buttons={buttons}
      />
      <SideBarBtnList
        titleIcon={<DownloadIcon />}
        title="Downloads"
        buttons={downloadButtons}
      />
    </HtmlContainer>
  );
};

export default SideBarContent;
