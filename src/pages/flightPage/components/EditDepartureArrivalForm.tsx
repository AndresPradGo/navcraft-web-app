import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { AiOutlineSave } from "react-icons/ai";
import { BiSolidPlaneLand, BiSolidPlaneTakeOff } from "react-icons/bi";
import { BsThermometerSun } from "react-icons/bs";
import { FaCloudSunRain } from "react-icons/fa";
import { FaArrowUpFromGroundWater } from "react-icons/fa6";
import { LiaTimesSolid } from "react-icons/lia";
import { PiAirTrafficControlDuotone, PiWindLight } from "react-icons/pi";
import { TbWindsock } from "react-icons/tb";
import { styled } from "styled-components";
import { useForm, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Button from "../../../components/common/button";
import DataList from "../../../components/common/datalist";
import getUTCNowString from "../../../utils/getUTCNowString";
import useEditDepartureArrival from "../hooks/useEditDepartureArrival";
import { OfficialAerodromeDataFromAPI } from "../../../services/officialAerodromeClient";
import Loader from "../../../components/Loader";

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

  & p {
    margin: 10px 20px;
  }
`;

interface InputGroupProps {
  $hide: boolean;
}

const HtmlInputGroup = styled.div<InputGroupProps>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 40px 20px 0;
  overflow: ${(props) => (props.$hide ? "hidden" : "auto")};
  max-height: ${(props) => (props.$hide ? "0" : "1000vh")};

  & h2 {
    border-bottom: 1px solid var(--color-grey-bright);
    width: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    font-size: 20px;

    @media screen and (min-width: 425px) {
      font-size: 27px;
    }
  }

  & p {
    margin: 10px;
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

const DepartureIcon = styled(BiSolidPlaneTakeOff)`
  font-size: 35px;
  margin: 0 5px;
  flex-shrink: 0;

  @media screen and (min-width: 425px) {
    margin: 0 10px;
    font-size: 40px;
  }
`;

const ArrivalIcon = styled(BiSolidPlaneLand)`
  font-size: 35px;
  margin: 0 5px;
  flex-shrink: 0;

  @media screen and (min-width: 425px) {
    margin: 0 10px;
    font-size: 40px;
  }
`;

const AerodromeIcon = styled(PiAirTrafficControlDuotone)`
  font-size: 25px;
  margin: 0 3px 0 5px;
  flex-shrink: 0;

  @media screen and (min-width: 425px) {
    margin: 0 10px;
  }
`;

const WeatherIcon = styled(FaCloudSunRain)`
  font-size: 25px;
  margin: 0 3px 0 5px;
  flex-shrink: 0;

  @media screen and (min-width: 425px) {
    margin: 0 10px;
    font-size: 40px;
  }
`;

const WindMagnitudeIcon = styled(PiWindLight)`
  font-size: 25px;
  margin: 0 3px 0 5px;
  flex-shrink: 0;

  @media screen and (min-width: 425px) {
    margin: 0 10px;
  }
`;

const WindDirectionIcon = styled(TbWindsock)`
  font-size: 25px;
  margin: 0 3px 0 5px;
  flex-shrink: 0;

  @media screen and (min-width: 425px) {
    margin: 0 10px;
  }
`;

const TemperatureIcon = styled(BsThermometerSun)`
  font-size: 25px;
  margin: 0 3px 0 5px;
  flex-shrink: 0;

  @media screen and (min-width: 425px) {
    margin: 0 10px;
  }
`;

const AltimeterIcon = styled(FaArrowUpFromGroundWater)`
  font-size: 25px;
  margin: 0 3px 0 5px;
  flex-shrink: 0;

  @media screen and (min-width: 425px) {
    margin: 0 10px;
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

const schema = z.object({
  aerodrome: z.string(),
  wind_magnitude_knot: z
    .number({ invalid_type_error: "Enter a number" })
    .int("Must be a round number.")
    .min(0, "Must be a positive number"),
  wind_direction: z.union([
    z
      .number({ invalid_type_error: "Enter a number" })
      .int("Must be a round number.")
      .min(1, "Must be bewteen 1 and 360")
      .max(360, "Must be bewteen 1 and 360")
      .nullable(),
    z.literal(null),
  ]),
  temperature_c: z
    .number({ invalid_type_error: "Enter a number" })
    .int("Must be a round number."),
  altimeter_inhg: z
    .number({ invalid_type_error: "Enter a number" })
    .max(99.94, { message: "Must be greater than 99.95" })
    .min(-99.94, { message: "Must be less than -99.95" }),
});
type FormDataType = z.infer<typeof schema>;

interface Props {
  flightId: number;
  currentData: FormDataType;
  closeModal: () => void;
  isOpen: boolean;
  isDeparture: boolean;
  temperature_last_updated: string;
  wind_last_updated: string;
  altimeter_last_updated: string;
  noAerodrome: boolean;
}

const EditDepartureArrivalForm = ({
  flightId,
  currentData,
  temperature_last_updated,
  wind_last_updated,
  altimeter_last_updated,
  closeModal,
  isOpen,
  isDeparture,
  noAerodrome,
}: Props) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const aerodromes = queryClient.getQueryData<OfficialAerodromeDataFromAPI[]>([
    "aerodromes",
    "all",
  ]);

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

  const [submited, setSubmited] = useState(false);

  const mutation = useEditDepartureArrival(flightId, isDeparture);

  useEffect(() => {
    if (submited && !mutation.isLoading) {
      closeModal();
    }
  }, [submited, mutation.isLoading]);

  useEffect(() => {
    register("aerodrome");
  }, []);

  useEffect(() => {
    if (isOpen) {
      reset({
        aerodrome: currentData.aerodrome,
        wind_magnitude_knot: currentData.wind_magnitude_knot,
        wind_direction: currentData.wind_direction,
        temperature_c: currentData.temperature_c,
        altimeter_inhg: currentData.altimeter_inhg,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const wrongWindDirection = checkWindMagnitude({
      wind_direction: watch("wind_direction"),
      wind_magnitude_knot: watch("wind_magnitude_knot"),
    });
    if (!wrongWindDirection) clearErrors("wind_direction");
  }, [watch("wind_magnitude_knot"), watch("wind_direction")]);

  const checkWindMagnitude = (data: FieldValues): boolean => {
    const message =
      "If wind magnitude is not 0, you need to enter a wind direction.";

    if (errors.wind_direction) {
      if (errors.wind_direction.message !== message) return true;
    }
    const wrongData = data.wind_magnitude_knot && !data.wind_direction;
    if (wrongData) {
      setError("wind_direction", {
        type: "manual",
        message: message,
      });
      return true;
    }
    return false;
  };

  const handleWindDirectionValue = (value: string): number | null => {
    if (Number.isNaN(parseFloat(value))) return null;
    return parseFloat(value);
  };

  const submitHandler = (data: FieldValues) => {
    const aerodromeId = aerodromes?.find(
      (a) =>
        `${a.code}: ${a.name}${a.registered ? "" : " (saved)"}` ===
        data.aerodrome
    )?.id;

    const wrongWindDirection = checkWindMagnitude({
      wind_direction: data.wind_direction,
      wind_magnitude_knot: data.wind_magnitude_knot,
    });

    if (!aerodromeId) {
      setError("aerodrome", {
        type: "manual",
        message: "Select a valid option",
      });
    } else if (!wrongWindDirection) {
      mutation.mutate({
        aerodrome_id: aerodromeId,
        temperature_c: data.temperature_c,
        altimeter_inhg: data.altimeter_inhg,
        wind_direction: data.wind_direction,
        wind_magnitude_knot: data.wind_magnitude_knot,
        temperature_last_updated:
          data.temperature_c !== currentData.temperature_c
            ? getUTCNowString()
            : temperature_last_updated,
        wind_last_updated:
          data.wind_direction !== currentData.wind_direction ||
          data.wind_magnitude_knot !== currentData.wind_magnitude_knot
            ? getUTCNowString()
            : wind_last_updated,
        altimeter_last_updated:
          data.altimeter_inhg !== currentData.altimeter_inhg
            ? getUTCNowString()
            : altimeter_last_updated,
      });
      setSubmited(true);
    }
  };

  return (
    <HtmlForm onSubmit={handleSubmit(submitHandler)}>
      <h1>
        <div>
          {isDeparture ? <DepartureIcon /> : <ArrivalIcon />}
          {noAerodrome
            ? `Select ${isDeparture ? "Departure" : "Arrival"} Aerodrome`
            : `Edit ${isDeparture ? "Departure" : "Arrival"} Settings`}
        </div>
        {mutation.isLoading || noAerodrome ? (
          <CloseIcon onClick={() => {}} $disabled={true} />
        ) : (
          <CloseIcon onClick={closeModal} $disabled={false} />
        )}
      </h1>
      <HtmlInputContainer>
        {mutation.isLoading ? (
          <Loader />
        ) : (
          <>
            {noAerodrome ? (
              <p>
                {`This flight doesn't have ${
                  isDeparture ? "a departure" : "an arrival"
                } aerodrome. This happens when you delete your saved aerodrome, or when an official aerodrome is no longer registered in our database. Select a valid aerodrome to continue.`}
              </p>
            ) : null}
            <DataList
              setError={(message) =>
                setError("aerodrome", {
                  type: "manual",
                  message: message,
                })
              }
              clearErrors={() => clearErrors("aerodrome")}
              required={true}
              value={watch("aerodrome")}
              hasError={!!errors.aerodrome}
              errorMessage={errors.aerodrome?.message || ""}
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
              setValue={(value: string) => setValue("aerodrome", value)}
              name="editDepartureArrival-aerodrome"
              formIsOpen={isOpen}
              resetValue={currentData.aerodrome}
            >
              <AerodromeIcon />
              {`${isDeparture ? "Departure" : "Arrival"} Aerodrome`}
            </DataList>
            <HtmlInputGroup $hide={noAerodrome}>
              <h2>
                <WeatherIcon />
                Weather at Aerodrome
              </h2>
              <p>
                Manually updated weather, will overwrite the weather captured
                from official sources.
              </p>
              <HtmlInput
                $required={true}
                $hasValue={
                  !!watch("wind_magnitude_knot") ||
                  watch("wind_magnitude_knot") === 0
                }
                $accepted={!errors.wind_magnitude_knot}
              >
                <input
                  {...register("wind_magnitude_knot", { valueAsNumber: true })}
                  id="editDepartureArrival-wind_magnitude_knot"
                  type="number"
                  autoComplete="off"
                  required={true}
                />
                {errors.wind_magnitude_knot ? (
                  <p>{errors.wind_magnitude_knot.message}</p>
                ) : (
                  <p>&nbsp;</p>
                )}
                <label htmlFor="editDepartureArrival-wind_magnitude_knot">
                  <WindMagnitudeIcon />
                  {"Wind Magnitude [Kts]"}
                </label>
              </HtmlInput>
              <HtmlInput
                $required={false}
                $hasValue={
                  !!watch("wind_direction") || watch("wind_direction") === 0
                }
                $accepted={!errors.wind_direction}
              >
                <input
                  {...register("wind_direction", {
                    setValueAs: handleWindDirectionValue,
                  })}
                  id="editDepartureArrival-wind_direction"
                  type="number"
                  autoComplete="off"
                  required={false}
                />
                {errors.wind_direction ? (
                  <p>{errors.wind_direction.message}</p>
                ) : (
                  <p>&nbsp;</p>
                )}
                <label htmlFor="editDepartureArrival-wind_direction">
                  <WindDirectionIcon />
                  {"Wind Direction [\u00B0True]"}
                </label>
              </HtmlInput>
              <HtmlInput
                $required={true}
                $hasValue={
                  !!watch("temperature_c") || watch("temperature_c") === 0
                }
                $accepted={!errors.temperature_c}
              >
                <input
                  {...register("temperature_c", { valueAsNumber: true })}
                  id="editDepartureArrival-temperature_c"
                  type="number"
                  autoComplete="off"
                  required={true}
                />
                {errors.temperature_c ? (
                  <p>{errors.temperature_c.message}</p>
                ) : (
                  <p>&nbsp;</p>
                )}
                <label htmlFor="editDepartureArrival-temperature_c">
                  <TemperatureIcon />
                  {"Temperature [\u00B0C]"}
                </label>
              </HtmlInput>
              <HtmlInput
                $required={true}
                $hasValue={
                  !!watch("altimeter_inhg") || watch("altimeter_inhg") === 0
                }
                $accepted={!errors.altimeter_inhg}
              >
                <input
                  {...register("altimeter_inhg", { valueAsNumber: true })}
                  id="editDepartureArrival-altimeter_inhg"
                  type="number"
                  autoComplete="off"
                  required={true}
                  step="any"
                />
                {errors.altimeter_inhg ? (
                  <p>{errors.altimeter_inhg.message}</p>
                ) : (
                  <p>&nbsp;</p>
                )}
                <label htmlFor="editDepartureArrival-altimeter_inhg">
                  <AltimeterIcon />
                  {"Altimeter [in Hg]"}
                </label>
              </HtmlInput>
            </HtmlInputGroup>
          </>
        )}
      </HtmlInputContainer>
      <HtmlButtons>
        {noAerodrome ? (
          <Button
            color="var(--color-primary-dark)"
            hoverColor="var(--color-primary-dark)"
            backgroundColor="var(--color-grey)"
            backgroundHoverColor="var(--color-grey-bright)"
            fontSize={15}
            margin="5px 0"
            borderRadious={4}
            handleClick={() => {
              navigate("/flights");
            }}
            btnType="button"
            width="120px"
            height="35px"
            disabled={mutation.isLoading}
          >
            Go back
          </Button>
        ) : (
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
        )}
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

export default EditDepartureArrivalForm;
