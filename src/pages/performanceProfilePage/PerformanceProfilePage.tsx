import { useState } from "react";
import { AiOutlineSwap } from "react-icons/ai";
import { BsSpeedometer } from "react-icons/bs";
import { FaPlaneDeparture, FaPlaneArrival, FaSitemap } from "react-icons/fa";
import { IoAirplane, IoAirplaneOutline } from "react-icons/io5";
import { MdBalance, MdOutlineStart } from "react-icons/md";
import { TbPlaneInflight } from "react-icons/tb";
import { TbTrendingUp2 } from "react-icons/tb";
import { styled } from "styled-components";

import modelPermissionsContext from "./modelPermissionsContext";
import { usePathList } from "../../router";
import useAuth from "../../hooks/useAuth";
import ContentLayout from "../layout/ContentLayout";
import SideBarContent from "./components/SideBarContent";
import { PerformanceProfileBaseData } from "../../services/aircraftClient";
import useAircraftData from "../../hooks/useAircraftData";
import useAircraftModelData from "../../hooks/useAircraftModelData";
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
import useTakeoffPerformanceData from "../../hooks/useTakeoffPerformanceData";
import useLandingPerformanceData from "../../hooks/useLandingPerformanceData";
import EditPerformanceProfileForm from "./components/EditPerformanceProfileForm";
import EditAircraftModelForm from "../../components/editAircraftModelForm/index";
import useSelectPerformanceProfile from "./hooks/useSelectPerformanceProfile";
import DeletePerformanceProfileForm from "../../components/deletePerformanceProfileForm";
import DeleteAircraftModelForm from "../../components/deleteAircraftModelForm";
import WeightBalanceSection from "./components/WeightBalanceSection";
import EditWeightAndBalanceDataForm from "./components/EditWeightAndBalanceDataForm";
import EditWeightBalanceProfileForm from "./components/EditWeightBalanceProfileForm";
import TakeoffLandingSection from "./components/TakeoffLandingSection";
import useRunwaySurfaces from "../../hooks/useRunwaySurfaces";
import EditWindAdjustmentsForm from "./components/EditWindAdjustmentsForm";
import EditSurfaceAdjustmentForm from "./components/EditSurfaceAdjustmentForm";
import FileForm from "../../components/common/fileForm/index";
import getCsvUploadingInstructions from "../../utils/getCsvUploadingInstructions";
import EditClimbDataForm from "./components/EditClimbDataForm";
import useClimbData from "./hooks/useClimbData";
import useCruiseData from "./hooks/useCruiseData";
import ClimbSection from "./components/ClimbSection";
import CruiseSection from "./components/CruiseSection";
import useSetTitle from "../../hooks/useSetTitle";

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
    margin: 10px 0 25px 0;

    h1:first-of-type {
      display: flex;
      align-items: center;
      font-size: 25px;
      text-wrap: wrap;
      line-height: 0.98;
      margin: 0;

      & svg {
        flex-shrink: 0;
        font-size: 40px;
        margin: 0 10px 0 0;
      }
    }

    @media screen and (min-width: 425px) {
      max-width: 395px;
      & h1:first-of-type {
        font-size: 30px;

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
  flex-shrink: 0;
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

const TakeoffIcon = styled(FaPlaneDeparture)`
  flex-shrink: 0;
  font-size: 35px;
  margin: 0 10px 0 3px;

  @media screen and (min-width: 510px) {
    font-size: 40px;
  }
`;

const ClimbIcon = styled(TbTrendingUp2)`
  flex-shrink: 0;
  font-size: 35px;
  margin: 0 10px 0 0;

  @media screen and (min-width: 510px) {
    font-size: 40px;
  }
`;

const CruiseIcon = styled(TbPlaneInflight)`
  flex-shrink: 0;
  font-size: 35px;
  margin: 0 10px 0 0;

  @media screen and (min-width: 510px) {
    font-size: 40px;
  }
`;

const LandingIcon = styled(FaPlaneArrival)`
  flex-shrink: 0;
  font-size: 35px;
  margin: 0 10px 0 3px;

  @media screen and (min-width: 510px) {
    font-size: 40px;
  }
`;

const PerformanceProfilePage = () => {
  const [toEditId, setToEditId] = useState<number>(0);
  const [sectionIdx, setSectionIdx] = useState(0);
  const [currentForm, setCurrentForm] = useState<
    | "deleteProfile"
    | "addCompartment"
    | "addSeat"
    | "addTank"
    | "editWeightBalanceData"
    | "addWeightBalanceProfile"
    | "editTakeoffWindAdjustments"
    | "editLandingWindAdjustments"
    | "importTakeoff"
    | "importClimb"
    | "importCruise"
    | "importLanding"
    | "editClimbAdjustments"
  >("deleteProfile");

  const path = usePathList();
  const isModel = path[1] === "model";
  const user = useAuth();
  const userIsAdmin = !!(user?.is_active && user?.is_admin);

  const modal = useModal();
  const editProfileModal = useModal();
  const takeoffModal = useModal();
  const landingModal = useModal();
  const fileModal = useModal();

  const { id: stringId, aircraftId: stringAircraftId } = useParams();
  const profileId = parseInt(stringId || "0");
  const aircraftId = parseInt(stringAircraftId || "0");

  const selectProfileMutation = useSelectPerformanceProfile(aircraftId);

  const { data: aircraftData, error, isLoading } = useAircraftData(aircraftId);
  const {
    data: modelData,
    error: modelError,
    isLoading: modelLoading,
  } = useAircraftModelData(profileId, !isModel);

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

  const {
    data: takeoffData,
    error: takeoffError,
    isLoading: takeoffLoading,
  } = useTakeoffPerformanceData(profileId);

  const {
    data: landingData,
    error: landingError,
    isLoading: landingLoading,
  } = useLandingPerformanceData(profileId);

  const {
    data: climbData,
    error: climbError,
    isLoading: climbLoading,
  } = useClimbData(profileId);

  const { error: cruiseError, isLoading: cruiseLoading } =
    useCruiseData(profileId);

  const { error: surfacesError, isLoading: surfacesLoading } =
    useRunwaySurfaces();

  const profileNotFound = aircraftData
    ? !aircraftData.profiles.find((p) => p.id === profileId)
    : false;

  if (
    (error && error.message !== "Network Error") ||
    (profileNotFound && !isModel) ||
    (isModel && modelError && modelError.message !== "Network Error")
  )
    throw new Error("notFound");
  else if (
    (error && error.message === "Network Error") ||
    (isModel && modelError && modelError.message === "Network Error") ||
    fuelTypesError ||
    arrangementError ||
    weightBalanceError ||
    takeoffError ||
    landingError ||
    surfacesError ||
    climbError ||
    cruiseError
  )
    throw new Error("");
  if (
    isLoading ||
    modelLoading ||
    fuelTypesIsLoading ||
    weightBalanceLoading ||
    arrangementLoading ||
    takeoffLoading ||
    landingLoading ||
    surfacesLoading ||
    climbLoading ||
    cruiseLoading
  )
    return <Loader />;

  const profileBaseData = isModel
    ? ({ ...modelData, is_preferred: false } as PerformanceProfileBaseData)
    : aircraftData?.profiles.find((profile) => profile.id === profileId);

  useSetTitle(
    modelData && profileBaseData
      ? `Aircraft ${isModel ? "Model" : "Profile"}: ${
          isModel
            ? modelData.performance_profile_name
            : profileBaseData.performance_profile_name
        }`
      : "Aircraft Model"
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
      icon: <TbPlaneInflight />,
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
    "Each point is composed of a CoG-location in inches aft of the datum, and an aircraft weight in pounds.",
    "To make sure the profile is accurate, enter the points in the right sequence, starting with the lighter and most forward configuration, and following a clockwise order.",
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

  const handleEditTakeoffSurfaceAdjustment = (id: number) => {
    takeoffModal.handleOpen();
    setToEditId(id);
  };

  const handleEditLandingSurfaceAdjustment = (id: number) => {
    landingModal.handleOpen();
    setToEditId(id);
  };

  const handleChangeToNextTable = () => {
    if (sectionIdx >= sections.length - 1) setSectionIdx(0);
    else setSectionIdx(sectionIdx + 1);
  };

  const takeoffSurfaceToEdit =
    takeoffData?.percent_increase_runway_surfaces.find(
      (item) => item.surface_id === toEditId
    ) || { surface_id: 0, percent: NaN };

  const landingSurfaceToEdit =
    landingData?.percent_increase_runway_surfaces.find(
      (item) => item.surface_id === toEditId
    ) || { surface_id: 0, percent: NaN };

  return (
    <modelPermissionsContext.Provider
      value={{
        isModel,
        userIsAdmin,
      }}
    >
      <Modal isOpen={fileModal.isOpen} fullHeight={true}>
        {currentForm === "importTakeoff" ? (
          <FileForm
            closeModal={fileModal.handleClose}
            submissionData={{
              path: `aircraft-performance-data/takeoff-landing/csv/${profileId}?is_takeoff=true`,
              successMessage: "Takeoff performance",
              queryKeys: [
                ["takeoffPerformance", profileId],
                ["aircraft", aircraftId],
              ],
            }}
            title={"Import Takeoff Performance Data from CSV File"}
            icon={<TakeoffIcon />}
            instructions={getCsvUploadingInstructions("takeoff")}
            modalIsOpen={fileModal.isOpen}
          />
        ) : currentForm === "importClimb" ? (
          <FileForm
            closeModal={fileModal.handleClose}
            submissionData={{
              path: `aircraft-performance-data/climb/csv/${profileId}`,
              successMessage: "Climb performance",
              queryKeys: [
                ["aircraftClimbPerformance", profileId],
                ["aircraft", aircraftId],
              ],
            }}
            title={"Import Climb Performance Data from CSV File"}
            icon={<ClimbIcon />}
            instructions={getCsvUploadingInstructions("climb")}
            modalIsOpen={fileModal.isOpen}
          />
        ) : currentForm === "importCruise" ? (
          <FileForm
            closeModal={fileModal.handleClose}
            submissionData={{
              path: `aircraft-performance-data/cruise/csv/${profileId}`,
              successMessage: "Cruise performance",
              queryKeys: [
                ["aircraftCruisePerformance", profileId],
                ["aircraft", aircraftId],
              ],
            }}
            title={"Import Cruise Performance Data from CSV File"}
            icon={<CruiseIcon />}
            instructions={getCsvUploadingInstructions("cruise")}
            modalIsOpen={fileModal.isOpen}
          />
        ) : currentForm === "importLanding" ? (
          <FileForm
            closeModal={fileModal.handleClose}
            submissionData={{
              path: `aircraft-performance-data/takeoff-landing/csv/${profileId}?is_takeoff=false`,
              successMessage: "Landing performance",
              queryKeys: [
                ["landingPerformance", profileId],
                ["aircraft", aircraftId],
              ],
            }}
            title={"Import Landing Performance Data from CSV File"}
            icon={<LandingIcon />}
            instructions={getCsvUploadingInstructions("landing")}
            modalIsOpen={fileModal.isOpen}
          />
        ) : null}
      </Modal>
      <Modal isOpen={takeoffModal.isOpen} fullHeight={true}>
        <EditSurfaceAdjustmentForm
          closeModal={takeoffModal.handleClose}
          isOpen={takeoffModal.isOpen}
          profileId={profileId}
          surface_id={takeoffSurfaceToEdit.surface_id}
          percent={takeoffSurfaceToEdit.percent}
          isTakeoff={true}
        />
      </Modal>
      <Modal isOpen={landingModal.isOpen} fullHeight={true}>
        <EditSurfaceAdjustmentForm
          closeModal={landingModal.handleClose}
          isOpen={landingModal.isOpen}
          profileId={profileId}
          surface_id={landingSurfaceToEdit.surface_id}
          percent={landingSurfaceToEdit.percent}
          isTakeoff={false}
        />
      </Modal>
      <Modal isOpen={editProfileModal.isOpen} fullHeight={true}>
        {!isModel ? (
          <EditPerformanceProfileForm
            closeModal={editProfileModal.handleClose}
            isOpen={editProfileModal.isOpen}
            aircraftId={aircraftId}
            profileName={profileBaseData?.performance_profile_name || ""}
            fuelType={fuelType.name}
            profileId={profileId}
          />
        ) : userIsAdmin ? (
          <EditAircraftModelForm
            closeModal={editProfileModal.handleClose}
            isOpen={editProfileModal.isOpen}
            aircraftModelData={{
              performance_profile_name:
                profileBaseData?.performance_profile_name || "",
              is_complete: !!profileBaseData?.is_complete,
              fuel_type: fuelType.name,
              id: profileId,
            }}
            fuelOptions={fuelTypes}
          />
        ) : null}
      </Modal>
      <Modal
        isOpen={modal.isOpen}
        width={currentForm === "addWeightBalanceProfile" ? 718 : 600}
        fullHeight={currentForm === "addWeightBalanceProfile"}
      >
        {currentForm === "deleteProfile" ? (
          isModel ? (
            userIsAdmin ? (
              <DeleteAircraftModelForm
                closeModal={modal.handleClose}
                id={profileId}
                redirect={true}
              />
            ) : null
          ) : (
            <DeletePerformanceProfileForm
              closeModal={modal.handleClose}
              id={profileId}
              name={profileBaseData?.performance_profile_name || ""}
              aircraftId={aircraftId}
              redirect={true}
            />
          )
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
            aircraftId={aircraftId}
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
            aircraftId={aircraftId}
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
            aircraftId={aircraftId}
          />
        ) : currentForm === "editWeightBalanceData" ? (
          <EditWeightAndBalanceDataForm
            closeModal={modal.handleClose}
            isOpen={modal.isOpen}
            profileId={profileId}
          />
        ) : currentForm === "addWeightBalanceProfile" ? (
          <EditWeightBalanceProfileForm
            performanceProfileId={profileId}
            helpInstructions={addWeightBalanceProfileInstructions}
            closeModal={modal.handleClose}
            isOpen={modal.isOpen}
            data={{
              id: 0,
              name: "",
              limits: [],
            }}
          />
        ) : currentForm === "editTakeoffWindAdjustments" ? (
          <EditWindAdjustmentsForm
            profileId={profileId}
            closeModal={modal.handleClose}
            isOpen={modal.isOpen}
            isTakeoff={true}
          />
        ) : currentForm === "editLandingWindAdjustments" ? (
          <EditWindAdjustmentsForm
            profileId={profileId}
            closeModal={modal.handleClose}
            isOpen={modal.isOpen}
            isTakeoff={false}
          />
        ) : currentForm === "editClimbAdjustments" ? (
          <EditClimbDataForm
            profileId={profileId}
            closeModal={modal.handleClose}
            isOpen={modal.isOpen}
            data={
              climbData
                ? {
                    take_off_taxi_fuel_gallons:
                      climbData.take_off_taxi_fuel_gallons,
                    percent_increase_climb_temperature_c:
                      climbData.percent_increase_climb_temperature_c,
                  }
                : {
                    take_off_taxi_fuel_gallons: null,
                    percent_increase_climb_temperature_c: null,
                  }
            }
          />
        ) : null}
      </Modal>
      <ContentLayout
        sideBarContent={
          <SideBarContent
            profileId={profileId}
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
            handleEditTakeoffData={() => {
              setCurrentForm("editTakeoffWindAdjustments");
              modal.handleOpen();
            }}
            handleAddTakeoffData={() => {
              handleEditTakeoffSurfaceAdjustment(0);
            }}
            handleImportTakeoffData={() => {
              setCurrentForm("importTakeoff");
              fileModal.handleOpen();
            }}
            handleEditClimbData={() => {
              modal.handleOpen();
              setCurrentForm("editClimbAdjustments");
            }}
            handleImportClimbData={() => {
              setCurrentForm("importClimb");
              fileModal.handleOpen();
            }}
            handleImportCruiseData={() => {
              setCurrentForm("importCruise");
              fileModal.handleOpen();
            }}
            handleEditLandData={() => {
              setCurrentForm("editLandingWindAdjustments");
              modal.handleOpen();
            }}
            handleAddLandData={() => {
              handleEditTakeoffSurfaceAdjustment(0);
            }}
            handleImportLandData={() => {
              setCurrentForm("importLanding");
              fileModal.handleOpen();
            }}
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
              {isModel ? (
                <span>
                  <i>Aircraft</i>
                  <MdOutlineStart />
                  <i>Model:</i>
                  <i>
                    <IoAirplaneOutline />
                    {profileBaseData?.performance_profile_name}
                  </i>
                </span>
              ) : (
                <>
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
                </>
              )}
            </div>
          </HtmlTitleContainer>
          {!profileBaseData?.is_complete ? (
            isModel && userIsAdmin ? (
              <AnnouncementBox
                isWarning={true}
                title="Incomplete Model"
                message="This model will not be visible to users, until it is marked as complete."
              />
            ) : (
              <AnnouncementBox
                isWarning={true}
                title="Incomplete Profile"
                message="Complete every section of the profile, in order to be able to use it for flight-planing."
              />
            )
          ) : profileBaseData?.is_preferred ? (
            <AnnouncementBox
              isWarning={false}
              title={`Selected profile`}
              message={`This profile has been selected for ${aircraftData?.registration}, and it will be used for flight-planing.`}
            />
          ) : isModel && userIsAdmin ? (
            <AnnouncementBox
              isWarning={false}
              title="Complete Model"
              message="This model has been marked as complete, and it is now visible to all users."
            />
          ) : null}
          {sectionIdx === 0 ? (
            <ArrangementSection
              fuel={{ name: fuelType.name, density: fuelType.density_lb_gal }}
              profileId={profileId}
              handleAddBaggage={handleAddBaggage}
              handleAddSeat={handleAddSeat}
              handleAddFuel={handleAddFuel}
              aircraftId={aircraftId}
            />
          ) : sectionIdx === 1 ? (
            <WeightBalanceSection
              handlAddWeightBalanceprofile={handleAddWeightBalanceProfile}
              instructions={addWeightBalanceProfileInstructions}
              profileId={profileId}
            />
          ) : sectionIdx === 2 ? (
            <TakeoffLandingSection
              isTakeoff={true}
              profileId={profileId}
              editSurfaceAdjustment={handleEditTakeoffSurfaceAdjustment}
            />
          ) : sectionIdx === 3 ? (
            <ClimbSection profileId={profileId} />
          ) : sectionIdx === 4 ? (
            <CruiseSection profileId={profileId} />
          ) : sectionIdx === 5 ? (
            <TakeoffLandingSection
              isTakeoff={false}
              profileId={profileId}
              editSurfaceAdjustment={handleEditLandingSurfaceAdjustment}
            />
          ) : null}
        </HtmlContainer>
      </ContentLayout>
    </modelPermissionsContext.Provider>
  );
};

export default PerformanceProfilePage;
