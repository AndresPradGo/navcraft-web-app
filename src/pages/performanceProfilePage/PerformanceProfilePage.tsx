import { useState } from "react";
import { AiOutlineSwap } from "react-icons/ai";
import { FaSitemap } from "react-icons/fa";
import { BsSpeedometer } from "react-icons/bs";
import { FaPlaneDeparture, FaPlaneArrival } from "react-icons/fa";
import { IoAirplane } from "react-icons/io5";
import { MdBalance, MdOutlineStart } from "react-icons/md";
import { PiWind } from "react-icons/pi";
import { TbTrendingUp2 } from "react-icons/tb";
import { styled } from "styled-components";

import ContentLayout from "../layout/ContentLayout";
import SideBarContent from "./SideBarContent";
import useAircraftData from "../../hooks/useAircraftData";
import useFuelTypes from "../../hooks/useFuelTypes";
import Loader from "../../components/Loader";
import { useParams } from "react-router-dom";

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
  & div:first-of-type {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    max-width: 336px;

    h1:first-of-type {
      display: flex;
      align-items: center;
      margin: 10px 0;
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

  const { id: stringId, aircraftId: stringAircraftId } = useParams();
  const profileId = parseInt(stringId || "0");
  const aircraftId = parseInt(stringAircraftId || "0");

  const { data: aircraftData, error, isLoading } = useAircraftData(aircraftId);

  const {
    data: fuelTypes,
    isLoading: fuelTypesIsLoading,
    error: fuelTypesError,
  } = useFuelTypes();

  if (error && error.message !== "Network Error") throw new Error("notFound");
  else if ((error && error.message === "Network Error") || fuelTypesError)
    throw new Error("");
  if (isLoading || fuelTypesIsLoading) return <Loader />;

  const ProfileBaseData = aircraftData?.profiles.find(
    (profile) => profile.id === profileId
  );

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

  const handleChangeToNextTable = () => {
    if (sectionIdx >= sections.length - 1) setSectionIdx(0);
    else setSectionIdx(sectionIdx + 1);
  };

  return (
    <ContentLayout
      sideBarContent={
        <SideBarContent
          handleChangeSection={setSectionIdx}
          sectionIndex={sectionIdx}
          sectionOptions={sections}
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
              <i>Profile:</i>
              <i>
                <BsSpeedometer />
                {ProfileBaseData?.performance_profile_name}
              </i>
            </span>
          </div>
        </HtmlTitleContainer>
      </HtmlContainer>
    </ContentLayout>
  );
};

export default PerformanceProfilePage;
