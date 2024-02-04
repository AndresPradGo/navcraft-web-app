import { useEffect, useState } from "react";
import { useForm, FieldValues } from "react-hook-form";
import { AiOutlineSave } from "react-icons/ai";
import { BsCalendarWeek } from "react-icons/bs";
import { LiaTimesSolid, LiaRouteSolid } from "react-icons/lia";
import { MdMoreTime } from "react-icons/md";
import { PiGearDuotone, PiEngineDuotone } from "react-icons/pi";
import { RiPinDistanceFill } from "react-icons/ri";
import { TbDropletPlus, TbDropletHeart } from "react-icons/tb";
import { styled } from "styled-components";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Button from "../../../components/common/button";
import { useQueryClient } from "@tanstack/react-query";
import { FlightDataFromApi } from "../../../services/flightClient";
import getUTCNowString from "../../../utils/getUTCNowString";
import useEditFlight from "../hooks/useEditFlight";
import Loader from "../../../components/Loader";

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
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
  padding: 20px 0;

  border-top: 1px solid var(--color-grey);
  border-bottom: 1px solid var(--color-grey);
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
    font-size: 15px;
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

    @media screen and (min-width: 425px) {
      font-size: 20px;
      transform: ${(props) =>
        props.$hasValue
          ? "translate(7px, 7px) scale(0.8)"
          : "translate(17px, 42px)"};
    }
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
    color: var(--color-white);
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

const TitleIcon = styled(PiGearDuotone)`
  flex-shrink: 0;
  font-size: 25px;
  margin: 0 10px;

  @media screen and (min-width: 510px) {
    font-size: 40px;
  }
`;

interface CloseIconProps {
  $disabled: boolean;
}

const CloseIcon = styled(LiaTimesSolid)<CloseIconProps>`
  flex-shrink: 0;
  font-size: 25px;
  margin: 0 5px;
  cursor: ${(props) => (props.$disabled ? "default" : "pointer")};
  color: var(--color-grey);
  opacity: ${(props) => (props.$disabled ? "0.3" : "1")};

  &:hover,
  &:focus {
    color: ${(props) =>
      props.$disabled ? "var(--color-grey)" : "var(--color-white)"};
  }

  @media screen and (min-width: 510px) {
    margin: 0 10px;
    font-size: 30px;
  }
`;

const DateIcon = styled(BsCalendarWeek)`
  font-size: 25px;
  margin: 0 5px 0 10px;
  flex-shrink: 0;
`;

const BHPIcon = styled(PiEngineDuotone)`
  font-size: 25px;
  margin: 0 5px 0 10px;
  flex-shrink: 0;
`;

const TimeIcon = styled(MdMoreTime)`
  font-size: 25px;
  margin: 0 5px 0 10px;
  flex-shrink: 0;
`;

const ContingencyIcon = styled(TbDropletPlus)`
  font-size: 25px;
  margin: 0 5px 0 10px;
  flex-shrink: 0;
`;

const ReserveIcon = styled(TbDropletHeart)`
  font-size: 25px;
  margin: 0 5px 0 10px;
  flex-shrink: 0;
`;

const RouteRadiusIcon = styled(LiaRouteSolid)`
  font-size: 35px;
  margin: 0 5px 0 10px;
  flex-shrink: 0;
`;

const AlternateRadiusIcon = styled(RiPinDistanceFill)`
  font-size: 25px;
  margin: 0 5px 0 10px;
  flex-shrink: 0;
`;

const SaveIcon = styled(AiOutlineSave)`
  font-size: 25px;
  flex-shrink: 0;
`;

export const schema = z.object({
  departure_time: z.string(),
  bhp_percent: z
    .number({ invalid_type_error: "Enter a number" })
    .int("Must be a round number")
    .max(100, { message: "Must be less than 100" })
    .min(20, { message: "Must be greater than 20" }),
  added_enroute_time_hours: z
    .number({ invalid_type_error: "Enter a number" })
    .max(99.94, { message: "Must be less than 99.95" })
    .min(0, { message: "Must be greater than zero" }),
  contingency_fuel_hours: z
    .number({ invalid_type_error: "Enter a number" })
    .max(99.94, { message: "Must be less than 99.95" })
    .min(0, { message: "Must be greater than zero" }),
  reserve_fuel_hours: z
    .number({ invalid_type_error: "Enter a number" })
    .max(99.94, { message: "Must be less than 99.95" })
    .min(0, { message: "Must be greater than zero" }),
  briefing_radius_nm: z
    .number({ invalid_type_error: "Enter a number" })
    .min(0, { message: "Must be greater than 0" })
    .max(50, { message: "Must be less than 50" }),
  alternate_radius_nm: z
    .number({ invalid_type_error: "Enter a number" })
    .min(0, { message: "Must be greater than 0" })
    .max(200, { message: "Must be less than 200" }),
});

export type EditFlightData = z.infer<typeof schema>;

interface Props {
  flightId: number;
  closeModal: () => void;
  isOpen: boolean;
}

const EditFlightForm = ({ closeModal, isOpen, flightId }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setError,
    clearErrors,
  } = useForm<EditFlightData>({ resolver: zodResolver(schema) });

  const [submited, setSubmited] = useState(false);

  const mutation = useEditFlight(flightId);

  const queryClient = useQueryClient();
  const flightData = queryClient.getQueryData<FlightDataFromApi>([
    "flight",
    flightId,
  ]);

  useEffect(() => {
    if (submited && !mutation.isLoading) {
      closeModal();
    }
  }, [submited, mutation.isLoading]);

  useEffect(() => {
    if (isOpen) {
      reset({
        departure_time: flightData?.departure_time.slice(0, -4),
        bhp_percent: flightData?.bhp_percent,
        added_enroute_time_hours: flightData?.added_enroute_time_hours,
        contingency_fuel_hours: flightData?.contingency_fuel_hours,
        reserve_fuel_hours: flightData?.reserve_fuel_hours,
        briefing_radius_nm: flightData?.briefing_radius_nm,
        alternate_radius_nm: flightData?.alternate_radius_nm,
      });
    }
  }, [isOpen]);

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
      return true;
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
      departure_time: data.departure_time,
    });
    if (!wrongDatatime) {
      clearErrors("departure_time");
      const departureTime = `${data.departure_time}:00Z`;
      mutation.mutate({
        departure_time: departureTime,
        bhp_percent: data.bhp_percent,
        added_enroute_time_hours: data.added_enroute_time_hours,
        contingency_fuel_hours: data.contingency_fuel_hours,
        reserve_fuel_hours: data.reserve_fuel_hours,
        briefing_radius_nm: data.briefing_radius_nm,
        alternate_radius_nm: data.alternate_radius_nm,
      });
      setSubmited(true);
    }
  };

  return (
    <HtmlForm onSubmit={handleSubmit(submitHandler)}>
      <h1>
        <div>
          <TitleIcon />
          Edit Flight Settings
        </div>
        {mutation.isLoading ? (
          <CloseIcon onClick={() => {}} $disabled={true} />
        ) : (
          <CloseIcon onClick={closeModal} $disabled={false} />
        )}
      </h1>
      <HtmlInputContainer>
        {mutation.isLoading ? (
          <Loader message="Calculating flight data . . ." margin={50} />
        ) : (
          <>
            <HtmlInput
              $hasValue={!!watch("departure_time")}
              $accepted={!errors.departure_time}
              $required={true}
            >
              <input
                {...register("departure_time")}
                id="editFlight-departure_time"
                type="datetime-local"
                autoComplete="off"
                required={true}
              />
              {errors.departure_time ? (
                <p>{errors.departure_time.message}</p>
              ) : (
                <p>&nbsp;</p>
              )}
              <label htmlFor="editFlight-departure_time">
                <DateIcon />
                {"ETD [UTC]"}
              </label>
            </HtmlInput>
            <HtmlInput
              $required={true}
              $hasValue={!!watch("bhp_percent") || watch("bhp_percent") === 0}
              $accepted={!errors.bhp_percent}
            >
              <input
                {...register("bhp_percent", { valueAsNumber: true })}
                id={"editFlight-bhp_percent"}
                type="number"
                autoComplete="off"
              />
              {errors.bhp_percent ? (
                <p>{errors.bhp_percent.message}</p>
              ) : (
                <p>&nbsp;</p>
              )}
              <label htmlFor="editFlight-bhp_percent">
                <BHPIcon />
                {"Cruise Prower [% of BHP]"}
              </label>
            </HtmlInput>
            <HtmlInput
              $required={true}
              $hasValue={
                !!watch("added_enroute_time_hours") ||
                watch("added_enroute_time_hours") === 0
              }
              $accepted={!errors.added_enroute_time_hours}
            >
              <input
                {...register("added_enroute_time_hours", {
                  valueAsNumber: true,
                })}
                id={"editFlight-added_enroute_time_hours"}
                step="any"
                type="number"
                autoComplete="off"
              />
              {errors.added_enroute_time_hours ? (
                <p>{errors.added_enroute_time_hours.message}</p>
              ) : (
                <p>&nbsp;</p>
              )}
              <label htmlFor="editFlight-added_enroute_time_hours">
                <TimeIcon />
                {"Additional Flight-Time [hours]"}
              </label>
            </HtmlInput>
            <HtmlInput
              $required={true}
              $hasValue={
                !!watch("contingency_fuel_hours") ||
                watch("contingency_fuel_hours") === 0
              }
              $accepted={!errors.contingency_fuel_hours}
            >
              <input
                {...register("contingency_fuel_hours", { valueAsNumber: true })}
                id={"editFlight-contingency_fuel_hours"}
                step="any"
                type="number"
                autoComplete="off"
              />
              {errors.contingency_fuel_hours ? (
                <p>{errors.contingency_fuel_hours.message}</p>
              ) : (
                <p>&nbsp;</p>
              )}
              <label htmlFor="editFlight-contingency_fuel_hours">
                <ContingencyIcon />
                {"Contingency Fuel [hours]"}
              </label>
            </HtmlInput>
            <HtmlInput
              $required={true}
              $hasValue={
                !!watch("reserve_fuel_hours") ||
                watch("reserve_fuel_hours") === 0
              }
              $accepted={!errors.reserve_fuel_hours}
            >
              <input
                {...register("reserve_fuel_hours", { valueAsNumber: true })}
                id={"editFlight-reserve_fuel_hours"}
                step="any"
                type="number"
                autoComplete="off"
              />
              {errors.reserve_fuel_hours ? (
                <p>{errors.reserve_fuel_hours.message}</p>
              ) : (
                <p>&nbsp;</p>
              )}
              <label htmlFor="editFlight-reserve_fuel_hours">
                <ReserveIcon />
                {"Reserve Fuel [hours]"}
              </label>
            </HtmlInput>
            <HtmlInput
              $required={true}
              $hasValue={
                !!watch("briefing_radius_nm") ||
                watch("briefing_radius_nm") === 0
              }
              $accepted={!errors.briefing_radius_nm}
            >
              <input
                {...register("briefing_radius_nm", { valueAsNumber: true })}
                id={"editFlight-briefing_radius_nm"}
                type="number"
                autoComplete="off"
              />
              {errors.briefing_radius_nm ? (
                <p>{errors.briefing_radius_nm.message}</p>
              ) : (
                <p>&nbsp;</p>
              )}
              <label htmlFor="editFlight-briefing_radius_nm">
                <RouteRadiusIcon />
                {"Route Briefing Radius [NM]"}
              </label>
            </HtmlInput>
            <HtmlInput
              $required={true}
              $hasValue={
                !!watch("alternate_radius_nm") ||
                watch("alternate_radius_nm") === 0
              }
              $accepted={!errors.alternate_radius_nm}
            >
              <input
                {...register("alternate_radius_nm", { valueAsNumber: true })}
                id={"editFlight-alternate_radius_nm"}
                type="number"
                autoComplete="off"
              />
              {errors.alternate_radius_nm ? (
                <p>{errors.alternate_radius_nm.message}</p>
              ) : (
                <p>&nbsp;</p>
              )}
              <label htmlFor="editFlight-alternate_radius_nm">
                <AlternateRadiusIcon />
                {"Alternate Radius [NM]"}
              </label>
            </HtmlInput>
          </>
        )}
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
          disabled={mutation.isLoading}
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
          disabled={mutation.isLoading}
          disabledText="Saving..."
        >
          Save
          <SaveIcon />
        </Button>
      </HtmlButtons>
    </HtmlForm>
  );
};

export default EditFlightForm;
