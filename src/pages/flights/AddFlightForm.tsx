import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AiOutlineSave } from "react-icons/ai";
import { BiSolidPlaneLand, BiSolidPlaneTakeOff } from "react-icons/bi";
import { BsCalendarWeek } from "react-icons/bs";
import { IoAirplane } from "react-icons/io5";
import { LiaTimesSolid } from "react-icons/lia";
import { PiAirplaneInFlightDuotone } from "react-icons/pi";
import { styled } from "styled-components";
import { useForm, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Button from "../../components/common/button";
import DataList from "../../components/common/datalist";
import getUTCNowString from "../../utils/getUTCNowString";
import { AircraftDataFromAPI } from "../../services/aircraftClient";
import { OfficialAerodromeDataFromAPI } from "../../services/officialAerodromeClient";
import useAddFlight from "./useAddFlight";

const HtmlForm = styled.form`
  width: 100%;
  flex-grow: 1;
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
    }

    @media screen and (min-width: 425px) {
      padding: 10px;
      font-size: 32px;
    }
  }
`;

const HtmlInputContainer = styled.div`
  width: 100%;
  overflow-y: auto;
  padding: 20px 0;
  flex-grow: 1;

  border-top: 1px solid var(--color-grey);
  border-bottom: 1px solid var(--color-grey);

  & h2 {
    margin: 20px;
    border-bottom: 1px solid var(--color-grey-bright);
    display: flex;
    align-items: center;
    text-wrap: wrap;
  }
`;

interface RequiredInputProps {
  $accepted: boolean;
  $hasValue: boolean;
  $required: boolean;
}
const HtmlInput = styled.div<RequiredInputProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 10px 20px 0;

  & label {
    cursor: ${(props) => (props.$hasValue ? "default" : "text")};
    position: absolute;
    top: 0;
    left: 0;
    font-size: 20px;
    display: flex;
    align-items: center;
    transform: ${(props) =>
      props.$hasValue
        ? "translate(7px, 7px) scale(0.8)"
        : "translate(17px, 47px)"};
    color: ${(props) =>
      props.$hasValue
        ? props.$accepted
          ? "var(--color-grey-bright)"
          : "var(--color-highlight)"
        : "var(--color-grey-bright)"};
    transition: transform 0.3s;

    & span {
      margin: 0 15px;
    }
  }

  & label:first-of-type {
    transform: translate(7px, 7px) scale(0.8);
    color: ${(props) =>
      props.$accepted ? "var(--color-grey-bright)" : "var(--color-highlight)"};
  }

  & input {
    width: 100%;
    padding: 10px 20px;
    margin: 0;
    margin-top: 30px;
    border-radius: 5px;
    background-color: var(--color-grey-dark);
    outline: none;
    border: 1px solid
      ${(props) =>
        props.$hasValue
          ? props.$accepted
            ? "var(--color-grey)"
            : "var(--color-highlight)"
          : "var(--color-grey)"};
    color: var(--color-white) !important;
    font-size: 15px;

    &:focus ~ label {
      cursor: default;
      color: ${(props) =>
        props.$accepted && (props.$hasValue || !props.$required)
          ? "var(--color-white)"
          : "var(--color-highlight)"};
      transform: translate(7px, 7px) scale(0.8);
    }

    &:focus {
      box-shadow: ${(props) =>
        props.$accepted && (props.$hasValue || !props.$required)
          ? "0"
          : "0 0 6px 0 var(--color-highlight)"};
      border: 1px solid
        ${(props) =>
          props.$accepted && (props.$hasValue || !props.$required)
            ? "var(--color-white)"
            : "var(--color-highlight)"};
    }
  }

  & p {
    font-size: 16px;
    color: var(--color-warning-hover);
    margin: 2px;
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

const SaveIcon = styled(AiOutlineSave)`
  font-size: 25px;
`;

const TitleIcon = styled(PiAirplaneInFlightDuotone)`
  font-size: 35px;
  margin: 0 5px;

  @media screen and (min-width: 425px) {
    margin: 0 10px;
    font-size: 40px;
  }
`;

const DateIcon = styled(BsCalendarWeek)`
  font-size: 25px;
  margin: 0 10px;
  flex-shrink: 0;
`;

const AircraftIcon = styled(IoAirplane)`
  font-size: 25px;
  margin: 0 10px;
  flex-shrink: 0;
`;

const DepartureIcon = styled(BiSolidPlaneTakeOff)`
  font-size: 25px;
  margin: 0 10px;
  flex-shrink: 0;
`;

const ArrivalIcon = styled(BiSolidPlaneLand)`
  font-size: 25px;
  margin: 0 10px;
  flex-shrink: 0;
`;

const CloseIcon = styled(LiaTimesSolid)`
  font-size: 25px;
  margin: 0 5px;
  cursor: pointer;
  color: var(--color-grey);

  &:hover,
  &:focus {
    color: var(--color-white);
  }

  @media screen and (min-width: 425px) {
    margin: 0 10px;
    font-size: 30px;
  }
`;

const schema = z.object({
  departure_time: z.string(),
  aircraft: z.string(),
  departure_aerodrome: z.string(),
  arrival_aerodrome: z.string(),
});
type FormDataType = z.infer<typeof schema>;

interface Props {
  closeModal: () => void;
  isOpen: boolean;
}
const AddFlightForm = ({ closeModal, isOpen }: Props) => {
  const queryClient = useQueryClient();
  const completeAircraftList = queryClient.getQueryData<AircraftDataFromAPI[]>([
    "aircraft",
    "list",
  ]);
  const aircraftList =
    completeAircraftList?.filter((a) =>
      a.profiles.find((p) => p.is_preferred)
    ) || [];
  const aerodromes = queryClient.getQueryData<OfficialAerodromeDataFromAPI[]>([
    "aerodromes",
    "all",
  ]);

  const mutation = useAddFlight();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    watch,
    clearErrors,
    setValue,
  } = useForm<FormDataType>({ resolver: zodResolver(schema) });

  useEffect(() => {
    register("aircraft");
    register("departure_aerodrome");
    register("arrival_aerodrome");
  }, []);

  useEffect(() => {
    if (isOpen) {
      reset({
        departure_time: getUTCNowString(true, true),
        aircraft: "",
        departure_aerodrome: "",
        arrival_aerodrome: "",
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const wrongDatatime = checkDepartureTime({
      departure_time: watch("departure_time"),
    });
    if (!wrongDatatime) {
      clearErrors("departure_time");
    }
  }, [watch("departure_time")]);

  const checkDepartureTime = (data: FieldValues): boolean => {
    const dateValue = `${data.departure_time}:00Z`;
    const wrongFormat = "Enter a valid date-time";
    const futureDateMessage = "Departure Time must be in the future";

    if (errors.departure_time) {
      if (
        errors.departure_time.message !== futureDateMessage &&
        errors.departure_time.message !== wrongFormat
      )
        return true;
    }

    const datetimeSchema = z.string().datetime();
    const result = datetimeSchema.safeParse(dateValue);
    if (!result.success) {
      setError("departure_time", {
        type: "manual",
        message: wrongFormat,
      });
      return false;
    }

    if (dateValue < getUTCNowString()) {
      setError("departure_time", {
        type: "manual",
        message: futureDateMessage,
      });
      return true;
    }
    return false;
  };

  const submitHandler = (data: FieldValues) => {
    const wrongDatatime = checkDepartureTime({
      departure_time: watch("departure_time"),
    });
    const aircraftId = aircraftList.find(
      (a) => a.registration === data.aircraft
    )?.id;
    const departureId = aerodromes?.find(
      (a) =>
        `${a.code}: ${a.name}${a.registered ? "" : " (saved)"}` ===
        data.departure_aerodrome
    )?.id;
    const arrivalId = aerodromes?.find(
      (a) =>
        `${a.code}: ${a.name}${a.registered ? "" : " (saved)"}` ===
        data.arrival_aerodrome
    )?.id;

    if (!aircraftId) {
      setError("aircraft", {
        type: "manual",
        message: "Select a valid option",
      });
    } else if (!departureId) {
      setError("departure_aerodrome", {
        type: "manual",
        message: "Select a valid option",
      });
    } else if (!arrivalId) {
      setError("arrival_aerodrome", {
        type: "manual",
        message: "Select a valid option",
      });
    } else if (!wrongDatatime) {
      clearErrors("departure_time");
      closeModal();
      mutation.mutate({
        departure_time: `${data.departure_time}:00Z`,
        aircraft_id: aircraftId,
        departure_aerodrome_id: departureId,
        arrival_aerodrome_id: arrivalId,
      });
    }
  };

  return (
    <HtmlForm onSubmit={handleSubmit(submitHandler)}>
      <h1>
        <div>
          <TitleIcon />
          Add New Flight
        </div>
        <CloseIcon onClick={closeModal} />
      </h1>
      <HtmlInputContainer>
        <DataList
          setError={(message) =>
            setError("departure_aerodrome", {
              type: "manual",
              message: message,
            })
          }
          clearErrors={() => clearErrors("departure_aerodrome")}
          required={true}
          value={watch("departure_aerodrome")}
          hasError={!!errors.departure_aerodrome}
          errorMessage={errors.departure_aerodrome?.message || ""}
          options={
            aerodromes
              ? aerodromes.map(
                  (item) =>
                    `${item.code}: ${item.name}${
                      item.registered ? "" : " (saved)"
                    }`
                )
              : []
          }
          setValue={(value: string) => setValue("departure_aerodrome", value)}
          name="departure_aerodrome"
          formIsOpen={isOpen}
          resetValue=""
        >
          <DepartureIcon /> Departure Aerodrome
        </DataList>
        <DataList
          setError={(message) =>
            setError("arrival_aerodrome", {
              type: "manual",
              message: message,
            })
          }
          clearErrors={() => clearErrors("arrival_aerodrome")}
          required={true}
          value={watch("arrival_aerodrome")}
          hasError={!!errors.arrival_aerodrome}
          errorMessage={errors.arrival_aerodrome?.message || ""}
          options={
            aerodromes
              ? aerodromes.map(
                  (item) =>
                    `${item.code}: ${item.name}${
                      item.registered ? "" : " (saved)"
                    }`
                )
              : []
          }
          setValue={(value: string) => setValue("arrival_aerodrome", value)}
          name="arrival_aerodrome"
          formIsOpen={isOpen}
          resetValue=""
        >
          <ArrivalIcon /> Destination Aerodrome
        </DataList>
        <DataList
          setError={(message) =>
            setError("aircraft", {
              type: "manual",
              message: message,
            })
          }
          clearErrors={() => clearErrors("aircraft")}
          required={true}
          value={watch("aircraft")}
          hasError={!!errors.aircraft}
          errorMessage={errors.aircraft?.message || ""}
          options={aircraftList.map((item) => item.registration)}
          setValue={(value: string) => setValue("aircraft", value)}
          name="aircraft"
          formIsOpen={isOpen}
          resetValue=""
        >
          <AircraftIcon /> Aircraft
        </DataList>
        <HtmlInput
          $hasValue={!!watch("departure_time")}
          $accepted={!errors.departure_time}
          $required={true}
        >
          <input
            {...register("departure_time")}
            id="departure_time"
            type="datetime-local"
            autoComplete="off"
            required={true}
          />
          {errors.departure_time ? (
            <p>{errors.departure_time.message}</p>
          ) : (
            <p>&nbsp;</p>
          )}
          <label htmlFor="departure_time">
            <DateIcon />
            {"ETD [UTC]"}
          </label>
        </HtmlInput>
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
          Save
          <SaveIcon />
        </Button>
      </HtmlButtons>
    </HtmlForm>
  );
};

export default AddFlightForm;
