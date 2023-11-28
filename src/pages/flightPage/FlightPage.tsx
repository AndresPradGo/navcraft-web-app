import { useState } from "react";
import { useParams } from "react-router-dom";
import { AiOutlineSwap } from "react-icons/ai";
import { BiSolidPlaneLand, BiSolidPlaneTakeOff } from "react-icons/bi";
import { BsCalendarDate } from "react-icons/bs";
import { FaClipboardList, FaRoute, FaCloudSunRain } from "react-icons/fa";
import {
  FaMapLocationDot,
  FaScaleUnbalanced,
  FaHandHoldingDroplet,
} from "react-icons/fa6";
import { IoAirplane } from "react-icons/io5";
import { MdOutlineStart } from "react-icons/md";
import { styled } from "styled-components";

import { ContentLayout } from "../layout";
import useFlightData from "./useFlightData";
import Loader from "../../components/Loader";
import useAerodromesData from "../../hooks/useAerodromesData";
import useAircraftDataList from "../../hooks/useAircraftDataList";
import formatUTCDate from "../../utils/formatUTCDate";
import formatUTCTime from "../../utils/formatUTCTime";
import SideBarContent from "./SideBarContent";
import { useModal, Modal } from "../../components/common/modal";
import DeleteFlightForm from "../../components/deleteFlightForm";

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
    max-width: 292px;
    margin: 10px 0 25px 0;

    h1:first-of-type {
      display: flex;
      align-items: center;
      font-size: 25px;
      text-wrap: wrap;
      line-height: 0.98;
      width: 257px;
      margin: 0;

      & svg {
        flex-shrink: 0;
        font-size: 35px;
        margin: 0 10px 0 0;
      }
    }

    @media screen and (min-width: 425px) {
      max-width: 395px;
      & h1:first-of-type {
        width: 352px;
        font-size: 35px;

        & svg {
          margin: 0 10px 0 0;
          font-size: 45px;
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
      margin: 0 10px 10px 0;
      display: flex;
      align-items: center;

      & i {
        padding: 0;
        display: flex;
        align-items: center;
        text-wrap: wrap;

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
      & i:last-of-type {
        color: var(--color-grey-bright);
        padding: 0 0 0 10px;
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

const FlightPage = () => {
  const [sectionIdx, setSectionIdx] = useState<number>(0);
  const [formToDisplay, setFormToDisplay] = useState<
    "delete" | "edit" | "refreshWeather"
  >("delete");

  const generalModal = useModal();

  const { id: stringId } = useParams();
  const flightId = parseInt(stringId || "0");
  const { data: flightData, error, isLoading } = useFlightData(flightId);

  const {
    data: aerodromes,
    isLoading: aerodromesIsLoading,
    error: aerodromesError,
  } = useAerodromesData();

  const {
    data: aircraftList,
    isLoading: aircraftListIsLoading,
    error: aircraftListError,
  } = useAircraftDataList(true);

  if (error && error.message !== "Network Error") throw new Error("notFound");
  else if (
    (error && error.message === "Network Error") ||
    aerodromesError ||
    aircraftListError
  )
    throw new Error("");
  if (isLoading || aerodromesIsLoading || aircraftListIsLoading)
    return <Loader />;

  const sections = [
    {
      key: "map",
      title: "Flight-Route Map",
      icon: <FaMapLocationDot />,
    },
    {
      key: "navLog",
      title: "Navigation Log",
      icon: <FaClipboardList />,
    },
    {
      key: "weightBalance",
      title: "Weight & Balance",
      icon: <FaScaleUnbalanced />,
    },
    {
      key: "fuelLog",
      title: "Fuel Calculations",
      icon: <FaHandHoldingDroplet />,
    },
    {
      key: "takeoff",
      title: "Takeoff Distances",
      icon: <BiSolidPlaneTakeOff />,
    },
    {
      key: "landing",
      title: "Landing Distances",
      icon: <BiSolidPlaneLand />,
    },
    {
      key: "weather",
      title: "Weather Briefings",
      icon: <FaCloudSunRain />,
    },
  ];

  const departure =
    aerodromes.find((a) => a.id === flightData?.departure_aerodrome_id)?.code ||
    "";
  const arrival =
    aerodromes.find((a) => a.id === flightData?.arrival_aerodrome_id)?.code ||
    "";
  const aircraft =
    aircraftList.find((a) => a.id === flightData?.aircraft_id)?.registration ||
    "";

  const handleChangeToNextTable = () => {
    if (sectionIdx >= sections.length - 1) setSectionIdx(0);
    else setSectionIdx(sectionIdx + 1);
  };

  return (
    <>
      <Modal isOpen={generalModal.isOpen}>
        {formToDisplay === "delete" ? (
          <DeleteFlightForm
            closeModal={generalModal.handleClose}
            route={`from ${departure} to ${arrival}`}
            flightId={flightId}
            redirect={true}
          />
        ) : null}
      </Modal>
      <ContentLayout
        sideBarContent={
          <SideBarContent
            flightId={flightId}
            handleChangeSection={setSectionIdx}
            sectionIndex={sectionIdx}
            sectionOptions={sections}
            handleEditFlight={() => {}}
            handleEditDeparture={() => {}}
            handleEditArrival={() => {}}
            handleChangeAircraft={() => {}}
            handleRefreshWeather={() => {}}
            handleDeleteFlight={() => {
              setFormToDisplay("delete");
              generalModal.handleOpen();
            }}
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
                Flight
                <MdOutlineStart />
              </span>
              <span>
                <i>Route:</i>
                <i>
                  <FaRoute />
                  {`${departure} - ${arrival}`}
                </i>
              </span>
              <span>|</span>
              <span>
                <i>Aircraft:</i>
                <i>
                  <IoAirplane />
                  {aircraft}
                </i>
              </span>
              <span>|</span>
              <span>
                <i>ETD:</i>
                <i>
                  <BsCalendarDate />
                  {flightData
                    ? `${formatUTCDate(
                        flightData.departure_time
                      )}@${formatUTCTime(flightData.departure_time)}`
                    : ""}
                </i>
              </span>
            </div>
          </HtmlTitleContainer>
        </HtmlContainer>
      </ContentLayout>
    </>
  );
};

export default FlightPage;
