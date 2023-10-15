import { useState } from "react";
import { FaWeightScale } from "react-icons/fa6";
import { styled } from "styled-components";
import { toast } from "react-toastify";

import { ContentLayout } from "../layout";
import WithSideBar from "../../components/sidebar/WithSideBar";
import SideBarContent from "./SideBarContent";
import useProfileData from "./useProfileData";
import Loader from "../../components/Loader";
import PassengersTable from "./PassengersTable";
import WaypointsTable from "./WaypointsTable";
import AerodromesTable from "./AerodromessTable";

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
    margin: 0;
    font-size: 40px;
    text-wrap: wrap;
    line-height: 0.98;
  }
  & p:first-of-type {
    margin: 5px 0 0;
    padding-left: 10px;
    color: var(--color-grey-bright);
  }
`;

const HtmlWeightCardContainer = styled.div`
  perspective: 500px;
  width: 100%;
  max-width: 250px;
  height: 144px;
  margin: 30px 0 0 10px;
  display: flex;
  justify-content: flex-start;
`;

interface FlipCardProps {
  $inKg: boolean;
}
const HtmlWeightCard = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: visible;
  transform-style: preserve-3d;
`;

const HtmlWeightCardSide = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: var(--color-primary-bright);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 20px 20px 0px;
  flex-wrap: wrap;
  backface-visibility: hidden;
  transition: 1s transform linear;
  border: 1px groove var(--color-grey);
  border-radius: 10px;

  & h2 {
    margin: 0;
    color: var(--color-grey-light);
  }

  & p {
    margin: 0;

    & span:first-of-type {
      font-size: 50px;
      color: var(--color-white);
      margin-right: 5px;
    }

    & span:last-of-type {
      cursor: pointer;
      color: var(--color-contrast);
      font-size: 25px;
      transition: all 0.2s linear;
    }

    & span:last-of-type:hover,
    & span:last-of-type:hover {
      color: var(--color-contrast-hover);
    }
  }
`;

const HtmlWeightCardFront = styled(HtmlWeightCardSide)<FlipCardProps>`
  transform: rotateY(${(props) => (props.$inKg ? 180 : 0)}deg);
`;

const HtmlWeightCardBack = styled(HtmlWeightCardSide)<FlipCardProps>`
  transform: rotateY(${(props) => (props.$inKg ? 0 : -180)}deg);
`;

const WeightIcon = styled(FaWeightScale)`
  font-size: 30px;
  margin-right: 10px;
`;

const Profile = () => {
  const [weightInKg, setWeightInKg] = useState(false);

  const { data: profileData, error, isLoading } = useProfileData();

  if (error) {
    if (error.response)
      toast.error(error.response.data.detail, {
        position: "top-center",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

    throw new Error("");
  }

  if (isLoading) return <Loader />;

  return (
    <WithSideBar sideBarContent={<SideBarContent />}>
      <ContentLayout>
        <HtmlContainer>
          <HtmlTitleContainer>
            <h1>{profileData?.name}</h1>
            <p>{profileData?.email}</p>
          </HtmlTitleContainer>
          <HtmlWeightCardContainer>
            <HtmlWeightCard>
              <HtmlWeightCardFront $inKg={weightInKg}>
                <h2>
                  <WeightIcon />
                  WEIGHT
                </h2>
                <p>
                  <span>{profileData?.weight}</span>
                  <span onClick={() => setWeightInKg(!weightInKg)}>Lb</span>
                </p>
              </HtmlWeightCardFront>
              <HtmlWeightCardBack $inKg={weightInKg}>
                <h2>
                  <WeightIcon />
                  WEIGHT
                </h2>
                <p>
                  <span>
                    {Math.round(
                      (profileData ? profileData.weight : 0) * 0.4533
                    )}
                  </span>
                  <span onClick={() => setWeightInKg(!weightInKg)}>Kg</span>
                </p>
              </HtmlWeightCardBack>
            </HtmlWeightCard>
          </HtmlWeightCardContainer>
          <PassengersTable userId={profileData.id} />
          <AerodromesTable userId={profileData.id} />
          <WaypointsTable userId={profileData.id} />
        </HtmlContainer>
      </ContentLayout>
    </WithSideBar>
  );
};

export default Profile;