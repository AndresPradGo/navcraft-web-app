import { BiSolidSelectMultiple, BiSolidEditAlt } from "react-icons/bi";
import { IoAirplaneOutline } from "react-icons/io5";
import { BsSpeedometer } from "react-icons/bs";
import {
  FaPlaneDeparture,
  FaPlaneArrival,
  FaTools,
  FaSitemap,
} from "react-icons/fa";
import { FaFileExport, FaDownload } from "react-icons/fa6";
import { ImRoad } from "react-icons/im";
import {
  MdBalance,
  MdLuggage,
  MdAirlineSeatReclineNormal,
  MdPropaneTank,
  MdOutlineAdd,
} from "react-icons/md";
import { TbPlaneInflight } from "react-icons/tb";
import { RiDeleteBinLine } from "react-icons/ri";
import { TbTrendingUp2, TbWindsock } from "react-icons/tb";
import { styled } from "styled-components";

import SideBarIndex, {
  PageSectionDataType,
} from "../../../components/common/SideBarIndex";
import SideBarBtnList from "../../../components/common/SideBarBtnList";
import SideBarTitle from "../../../components/common/SideBarTitle";
import useFetchFile from "../../../hooks/useFetchFile";
import useModelPermissions from "../useModelPermissions";

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

const ArrangementIcon = styled(FaSitemap)`
  font-size: 23px;
  margin-right: 8px;
  padding-bottom: 3px;
`;

const BalanceIcon = styled(MdBalance)`
  font-size: 27px;
  margin-right: 8px;
  padding-bottom: 3px;
`;

const TakeoffIcon = styled(FaPlaneDeparture)`
  font-size: 23px;
  margin-right: 8px;
  padding-bottom: 3px;
`;

const ClimbIcon = styled(TbTrendingUp2)`
  font-size: 27px;
  margin-right: 8px;
  padding-bottom: 3px;
`;

const CruiseIcon = styled(TbPlaneInflight)`
  font-size: 23px;
  margin-right: 8px;
  padding-bottom: 3px;
`;

const LandingIcon = styled(FaPlaneArrival)`
  font-size: 23px;
  margin-right: 8px;
  padding-bottom: 3px;
`;

const DownloadTitleIcon = styled(FaDownload)`
  font-size: 27px;
  margin-right: 8px;
  padding-bottom: 3px;
`;

const PerformanceIcon = styled(BsSpeedometer)`
  font-size: 20px;
  margin-left: 5px;
`;

const SelectIcon = styled(BiSolidSelectMultiple)`
  font-size: 20px;
  margin-left: 5px;
`;

const DeleteIcon = styled(RiDeleteBinLine)`
  font-size: 20px;
  margin-left: 5px;
`;

const BaggageIcon = styled(MdLuggage)`
  font-size: 27px;
  margin-left: 5px;
`;

const SeatIcon = styled(MdAirlineSeatReclineNormal)`
  font-size: 25px;
  margin-left: 5px;
`;

const TankIcon = styled(MdPropaneTank)`
  font-size: 22px;
  margin-left: 5px;
`;

const EditIcon = styled(BiSolidEditAlt)`
  font-size: 20px;
  margin-left: 5px;
`;

const WindIcon = styled(TbWindsock)`
  font-size: 20px;
  margin-left: 5px;
`;

const RunwayIcon = styled(ImRoad)`
  font-size: 20px;
  margin-left: 5px;
`;

const AddIcon = styled(MdOutlineAdd)`
  font-size: 20px;
  margin-left: 5px;
`;

const ImportIcon = styled(FaFileExport)`
  font-size: 20px;
  margin-left: 5px;
`;

const DownloadIcon = styled(FaDownload)`
  font-size: 20px;
  margin-left: 5px;
`;

const ModelIcon = styled(IoAirplaneOutline)`
  font-size: 20px;
  margin-left: 5px;
`;

interface Props {
  profileId: number;
  handleChangeSection: (index: number) => void;
  sectionIndex: number;
  sectionOptions: PageSectionDataType[];
  disableSelect: boolean;
  disableAddWeightBalance: boolean;
  handleEditProfile: () => void;
  handleSelectProfile: () => void;
  handleDeleteProfile: () => void;
  handleAddBaggage: () => void;
  handleAddSeat: () => void;
  handleAddFuel: () => void;
  handleEditWBData: () => void;
  handleAddWBProfile: () => void;
  handleEditTakeoffData: () => void;
  handleAddTakeoffData: () => void;
  handleImportTakeoffData: () => void;
  handleEditClimbData: () => void;
  handleImportClimbData: () => void;
  handleImportCruiseData: () => void;
  handleEditLandData: () => void;
  handleAddLandData: () => void;
  handleImportLandData: () => void;
  disableAddFuelTank: boolean;
}

const SideBarContent = ({
  profileId,
  handleChangeSection,
  sectionIndex,
  sectionOptions,
  disableSelect,
  handleEditProfile,
  handleSelectProfile,
  handleDeleteProfile,
  handleAddBaggage,
  handleAddSeat,
  handleAddFuel,
  handleEditWBData,
  handleAddWBProfile,
  handleEditTakeoffData,
  handleAddTakeoffData,
  handleImportTakeoffData,
  handleEditClimbData,
  handleImportClimbData,
  handleImportCruiseData,
  handleEditLandData,
  handleAddLandData,
  handleImportLandData,
  disableAddFuelTank,
  disableAddWeightBalance,
}: Props) => {
  const { isModel, userIsAdmin } = useModelPermissions();
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

  const profileButtons = [
    {
      text: "Edit Profile",
      icon: <PerformanceIcon />,
      styles: { ...commonStyles },
      onClick: handleEditProfile,
    },
    {
      text: "Make Aircraft's Profile",
      icon: <SelectIcon />,
      styles: {
        ...baseStyles,
        disabled: disableSelect,
        hoverColor: disableSelect
          ? "var(--color-white)"
          : "var(--color-primary-dark)",
        backgroundHoverColor: disableSelect
          ? "var(--color-primary-light)"
          : undefined,
      },
      onClick: disableSelect ? () => {} : handleSelectProfile,
    },
    {
      text: "Delete Profile",
      icon: <DeleteIcon />,
      styles: {
        ...commonStyles,
        backgroundColor: "var(--color-warning)",
        backgroundHoverColor: "var(--color-warning-hover)",
      },
      onClick: handleDeleteProfile,
    },
  ];

  const modelButtons = [
    {
      text: "Edit Model",
      icon: <ModelIcon />,
      styles: { ...commonStyles },
      onClick: handleEditProfile,
    },
    {
      text: "Delete Model",
      icon: <DeleteIcon />,
      styles: {
        ...commonStyles,
        backgroundColor: "var(--color-warning)",
        backgroundHoverColor: "var(--color-warning-hover)",
      },
      onClick: handleDeleteProfile,
    },
  ];

  const arrangementButtons = [
    {
      text: "Add Compartment",
      icon: <BaggageIcon />,
      styles: { ...commonStyles },
      onClick: handleAddBaggage,
    },
    {
      text: "Add Seat Row",
      icon: <SeatIcon />,
      styles: { ...commonStyles },
      onClick: handleAddSeat,
    },
    {
      text: "Add Fuel Tank",
      icon: <TankIcon />,
      styles: { ...commonStyles, disabled: disableAddFuelTank },
      onClick: handleAddFuel,
    },
  ];

  const weightBalanceButtons = [
    {
      text: "Edit W&B Data",
      icon: <EditIcon />,
      styles: { ...commonStyles },
      onClick: handleEditWBData,
    },
    {
      text: "Add W&B Profile",
      icon: <AddIcon />,
      styles: { ...commonStyles, disabled: disableAddWeightBalance },
      onClick: handleAddWBProfile,
    },
  ];

  const takeoffButtons = [
    {
      text: "Edit Wind Adjustments",
      icon: <WindIcon />,
      styles: { ...commonStyles },
      onClick: handleEditTakeoffData,
    },
    {
      text: "Add Runway Adjustment",
      icon: <RunwayIcon />,
      styles: { ...commonStyles },
      onClick: handleAddTakeoffData,
    },
    {
      text: "Download Data",
      icon: <DownloadIcon />,
      styles: { ...baseStyles },
      onClick: () => {
        fileFetcher(
          `aircraft-performance-data/takeoff-landing/csv/${profileId}?is_takeoff=true`
        );
      },
    },
    {
      text: "Import Data",
      icon: <ImportIcon />,
      styles: { ...commonStyles },
      onClick: handleImportTakeoffData,
    },
  ];

  const climbButtons = [
    {
      text: "Edit Adjustment Values",
      icon: <EditIcon />,
      styles: { ...commonStyles },
      onClick: handleEditClimbData,
    },
    {
      text: "Download Data",
      icon: <DownloadIcon />,
      styles: { ...baseStyles },
      onClick: () => {
        fileFetcher(`aircraft-performance-data/climb/csv/${profileId}`);
      },
    },
    {
      text: "Import Data",
      icon: <ImportIcon />,
      styles: { ...commonStyles },
      onClick: handleImportClimbData,
    },
  ];

  const cruiseButtons = [
    {
      text: "Download Data",
      icon: <DownloadIcon />,
      styles: { ...baseStyles },
      onClick: () => {
        fileFetcher(`aircraft-performance-data/cruise/csv/${profileId}`);
      },
    },
    {
      text: "Import Data",
      icon: <ImportIcon />,
      styles: { ...commonStyles },
      onClick: handleImportCruiseData,
    },
  ];

  const landButtons = [
    {
      text: "Edit Wind Adjustments",
      icon: <WindIcon />,
      styles: { ...commonStyles },
      onClick: handleEditLandData,
    },
    {
      text: "Add Runway Adjustment",
      icon: <RunwayIcon />,
      styles: { ...commonStyles },
      onClick: handleAddLandData,
    },
    {
      text: "Download Data",
      icon: <DownloadIcon />,
      styles: { ...baseStyles },
      onClick: () => {
        fileFetcher(
          `aircraft-performance-data/takeoff-landing/csv/${profileId}?is_takeoff=false`
        );
      },
    },
    {
      text: "Import Data",
      icon: <ImportIcon />,
      styles: { ...commonStyles },
      onClick: handleImportLandData,
    },
  ];

  const downloadButtons = [
    {
      text: "Takeoff Performance",
      icon: <TakeoffIcon />,
      styles: { ...baseStyles },
      onClick: () => {
        fileFetcher(
          `aircraft-performance-data/takeoff-landing/csv/${profileId}?is_takeoff=true`
        );
      },
    },
    {
      text: "Climb Performance",
      icon: <ClimbIcon />,
      styles: { ...baseStyles },
      onClick: () => {
        fileFetcher(`aircraft-performance-data/climb/csv/${profileId}`);
      },
    },
    {
      text: "Cruise Performance",
      icon: <CruiseIcon />,
      styles: { ...baseStyles },
      onClick: () => {
        fileFetcher(`aircraft-performance-data/cruise/csv/${profileId}`);
      },
    },
    {
      text: "Landing Performance",
      icon: <LandingIcon />,
      styles: { ...baseStyles },
      onClick: () => {
        fileFetcher(
          `aircraft-performance-data/takeoff-landing/csv/${profileId}?is_takeoff=false`
        );
      },
    },
  ];

  return (
    <HtmlContainer>
      <SideBarTitle>{`Aircraft  ${
        isModel ? "Model" : "Performance Profile"
      }`}</SideBarTitle>
      <SideBarIndex
        handleChangeSection={handleChangeSection}
        selectedIdx={sectionIndex}
        sectionOptions={sectionOptions}
      />
      {isModel ? (
        userIsAdmin ? (
          <SideBarBtnList
            titleIcon={<ToolsIcon />}
            title="Aircraft Model Tools"
            buttons={modelButtons}
          />
        ) : (
          <SideBarBtnList
            titleIcon={<DownloadTitleIcon />}
            title="Export Data to CSV File"
            buttons={downloadButtons}
          />
        )
      ) : (
        <SideBarBtnList
          titleIcon={<ToolsIcon />}
          title="Performance Profile Tools"
          buttons={profileButtons}
        />
      )}
      {(isModel && userIsAdmin) || !isModel ? (
        <>
          <SideBarBtnList
            titleIcon={<ArrangementIcon />}
            title="Aircraft Arrangement Tools"
            buttons={arrangementButtons}
          />
          <SideBarBtnList
            titleIcon={<BalanceIcon />}
            title="Weight and Balance Tools"
            buttons={weightBalanceButtons}
          />
          <SideBarBtnList
            titleIcon={<TakeoffIcon />}
            title="Takeoff Performance Tools"
            buttons={takeoffButtons}
          />
          <SideBarBtnList
            titleIcon={<ClimbIcon />}
            title="Climb Performance Tools"
            buttons={climbButtons}
          />
          <SideBarBtnList
            titleIcon={<CruiseIcon />}
            title="Cruise Performance Tools"
            buttons={cruiseButtons}
          />
          <SideBarBtnList
            titleIcon={<LandingIcon />}
            title="Landing Performance Tools"
            buttons={landButtons}
            paddingBottom={true}
          />
        </>
      ) : null}
    </HtmlContainer>
  );
};

export default SideBarContent;
