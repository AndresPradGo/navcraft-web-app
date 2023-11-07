import { useState } from "react";
import { AiFillTag } from "react-icons/ai";
import { GiAirplane } from "react-icons/gi";
import { IoAirplane } from "react-icons/io5";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { SiFloatplane } from "react-icons/si";
import { styled } from "styled-components";
import { useParams } from "react-router-dom";

import { ContentLayout } from "../layout";
import useFuelTypes from "../../hooks/useFuelTypes";
import Loader from "../../components/Loader";
import SideBarContent from "./SideBarContent";
import { useModal, Modal } from "../../components/common/modal";
import EditAircraftForm from "../../components/editAircraftForm";
import DeleteAircraftForm from "../../components/deleteAircraftForm";
import useAircraftData from "./useAircraftData";
import DataTableList, { DataType } from "../../components/common/DataTableList";
import ProfilesTable from "./ProfilesTable";

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

const RegistrationIcon = styled(TfiHeadphoneAlt)`
  font-size: 20px;
  margin: 0 10px;
`;

const MakeIcon = styled(SiFloatplane)`
  font-size: 25px;
  margin: 0 10px;
`;

const ModelIcon = styled(GiAirplane)`
  font-size: 35px;
  margin: 0 10px;
`;

const NameIcon = styled(AiFillTag)`
  font-size: 25px;
  margin: 0 5px 0 10px;
`;

const AircraftPage = () => {
  const [modalForm, setModalForm] = useState<
    "editAircraft" | "deleteAircraft" | "addProfile" | "deleteProfile"
  >("editAircraft");
  const [idRowToEdit, setIdRowToEdit] = useState<number>(0);

  const { id } = useParams();

  const modal = useModal();
  const addProfileModal = useModal();

  const {
    data: aircraftData,
    error,
    isLoading,
  } = useAircraftData(parseInt(id || "0"));

  const {
    data: fuelTypes,
    isLoading: fuelTypesIsLoading,
    error: fuelTypesError,
  } = useFuelTypes();

  if (error && error.message !== "Network Error") throw new Error("notFound");
  else if ((error && error.message === "Network Error") || fuelTypesError)
    throw new Error("");
  if (isLoading || fuelTypesIsLoading) return <Loader />;

  const aircraftDataList = [
    {
      key: "registration",
      title: "Call Sign",
      icon: <RegistrationIcon />,
      data: aircraftData?.registration,
    },
    {
      key: "make",
      title: "Make",
      icon: <MakeIcon />,
      data: aircraftData?.make,
    },
    {
      key: "abbriviation",
      title: "Model",
      icon: <ModelIcon />,
      data: aircraftData?.abbreviation,
    },
    {
      key: "model",
      title: "Full Name",
      icon: <NameIcon />,
      data: aircraftData?.model,
    },
  ];
  return (
    <>
      <Modal isOpen={modal.isOpen}>Form</Modal>
      <ContentLayout
        sideBarContent={
          <SideBarContent
            handleAddProfile={() => {
              setModalForm("addProfile");
              modal.handleOpen();
            }}
            handleEditAircraft={() => {
              setModalForm("editAircraft");
              modal.handleOpen();
            }}
            handleDeleteAircraft={() => {
              setModalForm("deleteAircraft");
              modal.handleOpen();
            }}
          />
        }
      >
        <HtmlTitleContainer>
          <h1>
            <IoAirplane />
            {`${aircraftData?.registration} [${aircraftData?.abbreviation}]`}
          </h1>
        </HtmlTitleContainer>
        <DataTableList dataList={aircraftDataList as DataType[]} />
        <ProfilesTable
          profiles={aircraftData?.profiles || []}
          addModal={addProfileModal}
          aircraftId={parseInt(id || "0")}
          profileId={idRowToEdit}
          setProfileId={setIdRowToEdit}
          aircraftRegistration={aircraftData?.registration || ""}
          fuelTypes={fuelTypes}
        />
      </ContentLayout>
    </>
  );
};

export default AircraftPage;
