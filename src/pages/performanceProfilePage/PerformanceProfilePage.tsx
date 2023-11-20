import { useState } from "react";
import { AiOutlineSwap } from "react-icons/ai";
import { BsSpeedometer } from "react-icons/bs";
import { FaPlaneDeparture, FaPlaneArrival, FaSitemap } from "react-icons/fa";
import { IoAirplane } from "react-icons/io5";
import { MdBalance, MdOutlineStart } from "react-icons/md";
import { PiWind } from "react-icons/pi";
import { TbTrendingUp2 } from "react-icons/tb";
import { styled } from "styled-components";

import ContentLayout from "../layout/ContentLayout";
import SideBarContent from "./components/SideBarContent";
import useAircraftData from "../../hooks/useAircraftData";
import useFuelTypes from "../../hooks/useFuelTypes";
import Loader from "../../components/Loader";
import { useParams } from "react-router-dom";
import AnnouncementBox from "../../components/common/AnnouncementBox";
import ArrangementSection from "./components/ArrangementSection";
import { Modal, useModal } from "../../components/common/modal";
import EditBaggageCompartmentForm from "./components/EditBaggageCompartmentForm";
import EditSeatRowForm from "./components/EditSeatRowForm";
import EditFuelTankForm from "./components/EditFuelTankForm";
import useAircraftArrangementData from "../../hooks/useAircraftArrangementData";
import useWeightBalanceData from "../../hooks/useWeightBalanceData";
import EditPerformanceProfileForm from "./components/EditPerformanceProfileForm";
import useSelectPerformanceProfile from "./hooks/useSelectPerformanceProfile";
import DeletePerformanceProfileForm from "../../components/deletePerformanceProfileForm";
import WeightBalanceSection from "./components/WeightBalanceSection";
import EditWeightAndBalanceDataForm from "./components/EditWeightAndBalanceDataForm";
import EditWeightBalanceProfileForm from "./components/EditWeightBalanceProfileForm";

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
  margin-bottom: 30px;
  & div:first-of-type {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    max-width: 336px;

    h1:first-of-type {
      display: flex;
      align-items: center;
      margin: 10px 0 25px 0;
      font-size: 25px;
      text-wrap: wrap;
      line-height: 0.98;

      & svg {
        flex-shrink: 0;
        font-size: 40px;
        margin: 0 10px 0 0;
      }
    }

    @media screen and (min-width: 425px) {
      & h1 {
        font-size: 35px;

        & svg {
          margin: 0 10px 0 0;
          font-size: 50px;
        }
      }
    }
  }

  & div:last-of-type {
    margin: 0 10px 10px 15px;
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
        display: flex;
        align-items: center;

        & svg {
          font-size: 25px;
          margin: 0 5px 0 0;
          flex-shrink: 0;
        }
      }

      & svg {
        font-size: 25px;
        margin: 0 10px;
      }
    }

    & span {
      flex-wrap: wrap;
      & i:last-of-type {
        color: var(--color-grey-bright);
        padding: 0 0 0 10px;
        text-wrap: wrap;
        display: flex;
        align-items: flex-start;
      }
    }
  }
`;

const ChangeIcon = styled(AiOutlineSwap)`
  color: var(--color-contrast);
  cursor: pointer;
  font-size: 30px;
  margin-left: 5px;

  &:hover {
    color: var(--color-contrast-hover);
  }

  @media screen and (min-width: 425px) {
    font-size: 35px;
  }
`;

const PerformanceProfilePage = () => {
  const [sectionIdx, setSectionIdx] = useState(0);
  const [currentForm, setCurrentForm] = useState<
    | "deleteProfile"
    | "addCompartment"
    | "addSeat"
    | "addTank"
    | "editWeightBalanceData"
    | "addWeightBalanceProfile"
  >("deleteProfile");

  const modal = useModal();
  const editProfileModal = useModal();

  const { id: stringId, aircraftId: stringAircraftId } = useParams();
  const profileId = parseInt(stringId || "0");
  const aircraftId = parseInt(stringAircraftId || "0");

  const selectProfileMutation = useSelectPerformanceProfile(aircraftId);

  const { data: aircraftData, error, isLoading } = useAircraftData(aircraftId);

  const {
    data: fuelTypes,
    isLoading: fuelTypesIsLoading,
    error: fuelTypesError,
  } = useFuelTypes();

  const {
    data: arrangementData,
    error: arrangementError,
    isLoading: arrangementLoading,
  } = useAircraftArrangementData(profileId);

  const {
    data: weightBalanceData,
    error: weightBalanceError,
    isLoading: weightBalanceLoading,
  } = useWeightBalanceData(profileId);

  if (error && error.message !== "Network Error") throw new Error("notFound");
  else if (
    (error && error.message === "Network Error") ||
    fuelTypesError ||
    arrangementError ||
    weightBalanceError
  )
    throw new Error("");
  if (
    isLoading ||
    fuelTypesIsLoading ||
    weightBalanceLoading ||
    arrangementLoading
  )
    return <Loader />;

  const profileBaseData = aircraftData?.profiles.find(
    (profile) => profile.id === profileId
  );
  const fuelType =
    fuelTypes.find((fuel) => fuel.id === profileBaseData?.fuel_type_id) ||
    fuelTypes[0];

  const sections = [
    {
      key: "arrangement",
      title: "Aircraft Arrangement",
      icon: <FaSitemap />,
    },
    {
      key: "weight",
      title: "Weight and Balance",
      icon: <MdBalance />,
    },
    {
      key: "takeoff",
      title: "Takeoff Performance",
      icon: <FaPlaneDeparture />,
    },
    {
      key: "climb",
      title: "Climb Performance",
      icon: <TbTrendingUp2 />,
    },
    {
      key: "cruise",
      title: "Cruise Performance",
      icon: <PiWind />,
    },
    {
      key: "landing",
      title: "Landing Performance",
      icon: <FaPlaneArrival />,
    },
  ];

  const addWeightBalanceProfileInstructions = [
    "You can add up to 4 Weight and Balance Profiles.",
    "To add or edit a W&B Profile, list all the points that describe the boundaries of the profile.",
    "Each point is composed by a CoG-location in inches aft of the datum, and an aircraft weight in pounds.",
    "Make sure you enter the points in the correct order, or the profile will not be accurate.",
    "Enter first the point for the lighter and most forward configuration, and follow a clockwise order.",
    "To confirm the data has been entered correctly, check the sample graph and the list of points.",
    "Make sure the graph looks correct before saving the data.",
  ];

  const handleAddBaggage = () => {
    setCurrentForm("addCompartment");
    modal.handleOpen();
  };

  const handleAddSeat = () => {
    setCurrentForm("addSeat");
    modal.handleOpen();
  };

  const handleAddFuel = () => {
    setCurrentForm("addTank");
    modal.handleOpen();
  };

  const handleAddWeightBalanceProfile = () => {
    setCurrentForm("addWeightBalanceProfile");
    modal.handleOpen();
  };

  const handleChangeToNextTable = () => {
    if (sectionIdx >= sections.length - 1) setSectionIdx(0);
    else setSectionIdx(sectionIdx + 1);
  };

  return (
    <>
      <Modal isOpen={editProfileModal.isOpen} fullHeight={true}>
        <EditPerformanceProfileForm
          closeModal={editProfileModal.handleClose}
          isOpen={editProfileModal.isOpen}
          aircraftId={aircraftId}
          profileName={profileBaseData?.performance_profile_name || ""}
          fuelType={fuelType.name}
          profileId={profileId}
        />
      </Modal>
      <Modal
        isOpen={modal.isOpen}
        width={currentForm === "addWeightBalanceProfile" ? 1000 : 600}
        fullHeight={currentForm === "addWeightBalanceProfile"}
      >
        {currentForm === "deleteProfile" ? (
          <DeletePerformanceProfileForm
            closeModal={modal.handleClose}
            id={profileId}
            name={profileBaseData?.performance_profile_name || ""}
            aircraftId={aircraftId}
            redirect={true}
          />
        ) : currentForm === "addCompartment" ? (
          <EditBaggageCompartmentForm
            compartmentData={{
              id: 0,
              name: "",
              arm_in: 0,
              weight_limit_lb: NaN,
            }}
            closeModal={modal.handleClose}
            isOpen={modal.isOpen}
            profileId={profileId}
          />
        ) : currentForm === "addSeat" ? (
          <EditSeatRowForm
            seatRowData={{
              id: 0,
              name: "",
              arm_in: 0,
              number_of_seats: 1,
              weight_limit_lb: NaN,
            }}
            closeModal={modal.handleClose}
            isOpen={modal.isOpen}
            profileId={profileId}
          />
        ) : currentForm === "addTank" ? (
          <EditFuelTankForm
            fuelTankData={{
              id: 0,
              name: "",
              arm_in: 0,
              fuel_capacity_gallons: 0,
              unusable_fuel_gallons: 0,
              burn_sequence: 1,
            }}
            closeModal={modal.handleClose}
            isOpen={modal.isOpen}
            profileId={profileId}
          />
        ) : currentForm === "editWeightBalanceData" ? (
          <EditWeightAndBalanceDataForm
            closeModal={modal.handleClose}
            isOpen={modal.isOpen}
            profileId={profileId}
          />
        ) : currentForm === "addWeightBalanceProfile" ? (
          <EditWeightBalanceProfileForm
            closeModal={modal.handleClose}
            isOpen={modal.isOpen}
            data={{
              id: 0,
              name: "",
              limits: [],
            }}
          />
        ) : null}
      </Modal>
      <ContentLayout
        sideBarContent={
          <SideBarContent
            handleChangeSection={setSectionIdx}
            sectionIndex={sectionIdx}
            sectionOptions={sections}
            disableSelect={
              !profileBaseData?.is_complete || !!profileBaseData?.is_preferred
            }
            disableAddWeightBalance={
              weightBalanceData.weight_balance_profiles.length >= 4
            }
            handleEditProfile={() => {
              editProfileModal.handleOpen();
            }}
            handleSelectProfile={() => {
              selectProfileMutation.mutate(profileId);
            }}
            handleDeleteProfile={() => {
              setCurrentForm("deleteProfile");
              modal.handleOpen();
            }}
            handleAddBaggage={handleAddBaggage}
            handleAddSeat={handleAddSeat}
            handleAddFuel={handleAddFuel}
            handleEditWBData={() => {
              setCurrentForm("editWeightBalanceData");
              modal.handleOpen();
            }}
            handleAddWBProfile={handleAddWeightBalanceProfile}
            handleEditTakeoffData={() => {}}
            handleDownloadTakeoffData={() => {}}
            handleImportTakeoffData={() => {}}
            handleEditClimbData={() => {}}
            handleDownloadClimbData={() => {}}
            handleImportClimbData={() => {}}
            handleDownloadCruiseData={() => {}}
            handleImportCruiseData={() => {}}
            handleEditLandData={() => {}}
            handleDownloadLandData={() => {}}
            handleImportLandData={() => {}}
            disableAddFuelTank={
              arrangementData ? arrangementData.fuel_tanks.length >= 4 : false
            }
          />
        }
      >
        <HtmlContainer>
          <HtmlTitleContainer>
            <div>
              <h1>
                {sections[sectionIdx].icon}
                {sections[sectionIdx].title}
              </h1>
              <ChangeIcon onClick={handleChangeToNextTable} />
            </div>
            <div>
              <span>
                <i>Aircraft:</i>
                <i>
                  <IoAirplane />
                  {aircraftData?.registration}
                </i>
                <MdOutlineStart />
              </span>
              <span>
                <i>Performance Profile:</i>
                <i>
                  <BsSpeedometer />
                  {profileBaseData?.performance_profile_name}
                </i>
              </span>
            </div>
          </HtmlTitleContainer>
          {!profileBaseData?.is_complete ? (
            <AnnouncementBox
              isWarning={true}
              title="Incomplete Profile"
              message="Complete every section of the profile, in order to be able to use it for flight-planing."
            />
          ) : profileBaseData?.is_preferred ? (
            <AnnouncementBox
              isWarning={false}
              title={`Selected profile`}
              message={`This profile has been selected for ${aircraftData?.registration}, and it will be used for flight-planing.`}
            />
          ) : null}
          {sectionIdx === 0 ? (
            <ArrangementSection
              fuel={{ name: fuelType.name, density: fuelType.density_lb_gal }}
              profileId={profileId}
              handleAddBaggage={handleAddBaggage}
              handleAddSeat={handleAddSeat}
              handleAddFuel={handleAddFuel}
            />
          ) : sectionIdx === 1 ? (
            <WeightBalanceSection
              weightBalanceData={weightBalanceData}
              handlAddWeightBalanceprofile={handleAddWeightBalanceProfile}
              instructions={addWeightBalanceProfileInstructions}
              profileId={profileId}
            />
          ) : null}
        </HtmlContainer>
      </ContentLayout>
    </>
  );
};

export default PerformanceProfilePage;
