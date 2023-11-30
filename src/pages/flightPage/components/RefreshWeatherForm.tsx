import { FormEvent, useState, useEffect } from "react";
import { BiSolidPlaneLand, BiSolidPlaneTakeOff } from "react-icons/bi";
import { FaRoute, FaCloudSunRain } from "react-icons/fa";
import { LuRefreshCw } from "react-icons/lu";
import { LiaTimesSolid } from "react-icons/lia";
import { styled } from "styled-components";

import Button from "../../../components/common/button";

const HtmlForm = styled.form`
  width: 100%;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-start;
  padding: 0;
  overflow: hidden;

  & h1 {
    width: 100%;
    margin: 0;
    padding: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 25px;

    & div {
      display: flex;
      align-items: center;
      text-wrap: wrap;
    }

    @media screen and (min-width: 510px) {
      padding: 10px;
      font-size: 32px;
    }
  }
`;

const HtmlInputContainer = styled.div`
  width: 100%;
  overflow-y: auto;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  border-top: 1px solid var(--color-grey);
  border-bottom: 1px solid var(--color-grey);
`;

const HtmlCheckbox = styled.label`
  display: flex;
  min-width: 0;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  transition: all 0.2s linear;
  margin-left: 10px;

  color: var(--color-grey-bright);
  padding: 10px 10px 10px 20px;
  cursor: pointer;
  flex-grow: 0;

  &:hover,
  &:focus {
    background-color: var(--color-primary);
  }

  & input[type="checkbox"] {
    cursor: pointer;
    margin: 0;
    min-height: 20px;
    min-width: 20px;
    transition: all 0.2s linear;
  }

  & span {
    display: flex;
    align-items: center;
    text-align: left;
    cursor: pointer;
    margin-left: 5px;
    text-wrap: wrap;
  }
`;

const HtmlButtons = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  padding: 10px 20px;
`;

const SaveIcon = styled(LuRefreshCw)`
  font-size: 25px;
  flex-shrink: 0;
`;

const DepartureIcon = styled(BiSolidPlaneTakeOff)`
  font-size: 25px;
  margin: 0 10px;
  flex-shrink: 0;
`;

const EnrouteIcon = styled(FaRoute)`
  font-size: 25px;
  margin: 0 10px;
  flex-shrink: 0;
`;

const ArrivalIcon = styled(BiSolidPlaneLand)`
  font-size: 25px;
  margin: 0 10px;
  flex-shrink: 0;
`;

const TitleIcon = styled(FaCloudSunRain)`
  font-size: 45px;
  margin: 0 5px;
  flex-shrink: 0;

  @media screen and (min-width: 425px) {
    margin: 0 10px;
    font-size: 50px;
  }
`;

const CloseIcon = styled(LiaTimesSolid)`
  flex-shrink: 0;
  font-size: 25px;
  margin: 0 5px;
  cursor: pointer;
  color: var(--color-grey);

  &:hover,
  &:focus {
    color: var(--color-white);
  }

  @media screen and (min-width: 510px) {
    margin: 0 10px;
    font-size: 30px;
  }
`;

interface FormData {
  departureWeather: boolean;
  enrouteWeather: boolean;
  arrivalWeather: boolean;
}

interface Props {
  flightId: number;
  closeModal: () => void;
}

const RefreshWeatherForm = ({ flightId, closeModal }: Props) => {
  const [formState, setFormState] = useState<FormData>({
    departureWeather: true,
    enrouteWeather: true,
    arrivalWeather: true,
  });

  useEffect(() => {
    const storedDepartureWeather = localStorage.getItem("departureWeather");
    const storedEnrouteWeather = localStorage.getItem("enrouteWeather");
    const storedArrivalWeather = localStorage.getItem("arrivalWeather");
    if (
      storedDepartureWeather &&
      storedEnrouteWeather &&
      storedArrivalWeather
    ) {
      setFormState({
        departureWeather: storedDepartureWeather === "true",
        enrouteWeather: storedEnrouteWeather === "true",
        arrivalWeather: storedArrivalWeather === "true",
      });
    }
  }, []);

  const handleSelectItem = (box: "departure" | "enroute" | "arrival") => {
    const newState = { ...formState };
    if (box === "departure")
      newState.departureWeather = !newState.departureWeather;
    else if (box === "enroute")
      newState.enrouteWeather = !newState.enrouteWeather;
    else if (box === "arrival")
      newState.arrivalWeather = !newState.arrivalWeather;

    setFormState(newState);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    localStorage.setItem("departureWeather", `${formState.departureWeather}`);
    localStorage.setItem("enrouteWeather", `${formState.enrouteWeather}`);
    localStorage.setItem("arrivalWeather", `${formState.arrivalWeather}`);
    closeModal();
  };

  return (
    <HtmlForm onSubmit={handleSubmit}>
      <h1>
        <div>
          <TitleIcon />
          Refresh Weather Data
        </div>
        <CloseIcon onClick={closeModal} />
      </h1>
      <HtmlInputContainer>
        <HtmlCheckbox htmlFor="refreshWeather-departureWeather">
          <input
            type="checkbox"
            id="refreshWeather-departureWeather"
            onChange={() => handleSelectItem("departure")}
            checked={formState.departureWeather}
          />
          <span>
            <DepartureIcon />
            Refresh Departure Aerodrome Weather
          </span>
        </HtmlCheckbox>
        <HtmlCheckbox htmlFor="refreshWeather-enrouteWeather">
          <input
            type="checkbox"
            id="refreshWeather-enrouteWeather"
            onChange={() => handleSelectItem("enroute")}
            checked={formState.enrouteWeather}
          />
          <span>
            <EnrouteIcon />
            Refresh Enroute Weather
          </span>
        </HtmlCheckbox>
        <HtmlCheckbox htmlFor="refreshWeather-enrouteWeather">
          <input
            type="checkbox"
            id="refreshWeather-arrivalWeather"
            onChange={() => handleSelectItem("arrival")}
            checked={formState.arrivalWeather}
          />
          <span>
            <ArrivalIcon />
            Refresh Arrival Aerodrome Weather
          </span>
        </HtmlCheckbox>
      </HtmlInputContainer>
      <HtmlButtons>
        <Button
          color="var(--color-primary-dark)"
          hoverColor="var(--color-primary-dark)"
          backgroundColor="var(--color-grey)"
          backgroundHoverColor="var(--color-grey-bright)"
          fontSize={15}
          margin="5px 0"
          borderRadious={4}
          handleClick={closeModal}
          btnType="button"
          width="120px"
          height="35px"
        >
          Cancel
        </Button>
        <Button
          color="var(--color-primary-dark)"
          hoverColor="var(--color-primary-dark)"
          backgroundColor="var(--color-contrast)"
          backgroundHoverColor="var(--color-contrast-hover)"
          fontSize={15}
          margin="5px 0"
          borderRadious={4}
          btnType="submit"
          width="120px"
          height="35px"
          spaceChildren="space-evenly"
        >
          Refresh
          <SaveIcon />
        </Button>
      </HtmlButtons>
    </HtmlForm>
  );
};

export default RefreshWeatherForm;
