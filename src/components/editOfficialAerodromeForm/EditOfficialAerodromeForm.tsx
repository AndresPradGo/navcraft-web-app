import { useEffect } from "react";
import { AiOutlineSave } from "react-icons/ai";
import { BiHide } from "react-icons/bi";
import {
  LiaMapSignsSolid,
  LiaTimesSolid,
  LiaMountainSolid,
} from "react-icons/lia";
import { ImCompass2 } from "react-icons/im";
import { TbMapSearch, TbWorldLatitude, TbWorldLongitude } from "react-icons/tb";
import { GiWindsock } from "react-icons/gi";
import { PiAirTrafficControlFill } from "react-icons/pi";
import { SlBadge } from "react-icons/sl";
import { useForm, FieldValues } from "react-hook-form";
import { styled } from "styled-components";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Button from "../common/button";
import useEditOfficialAerodrome from "./useEditOfficialAerodrome";
import DataList from "../../components/common/datalist";
import { AerodromeStatus } from "../../hooks/useAerodromeStatusList";

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

const HtmlInputGroup = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 40px 20px 0;

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
    font-size: 20px;

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

const HtmlSelectElement = styled.select`
  cursor: pointer;
  position: relative;
  appearance: none;
  width: 100%;
  padding: 10px 20px;
  margin: 0;
  margin-top: 20px;
  border-radius: 5px;
  background-color: var(--color-grey-dark);
  outline: none;
  border: 1px solid var(--color-grey);
  color: var(--color-grey-bright);
  font-size: 20px;

  &:focus {
    border: 1px solid var(--color-white);
  }

  & option {
    cursor: pointer;
  }
`;

const HtmlCheckbox = styled.label`
  width: 122px;
  align-self: center;
  display: flex;
  min-width: 0;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  transition: all 0.2s linear;

  color: var(--color-grey-bright);
  padding: 10px 0 0 10px;
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

const HtmlGroupCheckbox = styled(HtmlCheckbox)`
  width: 123px;
  margin-top: 10px;
  margin-bottom: 5px;
  align-self: flex-start;

  & span {
    margin-left: 10px;
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

const HideIcon = styled(BiHide)`
  font-size: 25px;
  margin: 0 10px;
`;

const SaveIcon = styled(AiOutlineSave)`
  font-size: 25px;
`;

const CodeIcon = styled(TbMapSearch)`
  font-size: 25px;
  margin: 0 10px;
`;

const NameIcon = styled(LiaMapSignsSolid)`
  font-size: 25px;
  margin: 0 10px;
`;

const StatusIcon = styled(SlBadge)`
  font-size: 25px;
  margin: 0 10px;
`;

const WeatherIcon = styled(GiWindsock)`
  font-size: 30px;
  margin: 0 10px;
`;

const LatitudeIcon = styled(TbWorldLatitude)`
  font-size: 25px;
  margin: 0 10px;
`;

const LongitudeIcon = styled(TbWorldLongitude)`
  font-size: 25px;
  margin: 0 10px;
`;

const CompassIcon = styled(ImCompass2)`
  font-size: 25px;
  margin: 0 10px;
`;

const TerrainIcon = styled(LiaMountainSolid)`
  font-size: 30px;
  margin: 0 10px;
`;

const AddAerodromeIcon = styled(PiAirTrafficControlFill)`
  flex-shrink: 0;
  font-size: 25px;
  margin: 0 10px;

  @media screen and (min-width: 510px) {
    font-size: 40px;
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

const schema = z.object({
  code: z
    .string()
    .min(2, { message: "Must be at least 2 characters long" })
    .max(12, { message: "Must be at most 12 characters long" })
    .regex(/^[-A-Za-z0-9']+$/, {
      message: "Only letters, numbers and symbols -'",
    }),
  name: z
    .string()
    .min(2, { message: "Must be at least 2 characters long" })
    .max(50, { message: "Must be at most 50 characters long" }),
  lat_degrees: z
    .number({ invalid_type_error: "Enter a number" })
    .int("Coordinates must be round numbers.")
    .min(0, `Latitude must be between S 89° 59' 59" and N 89° 59' 59"`)
    .max(89, `Latitude must be between S89° 59' 59" and N 89° 59' 59"`),
  lat_minutes: z
    .number({ invalid_type_error: "Enter a number" })
    .int("Coordinates must be round numbers.")
    .min(0, "Minutes must be bewteen 0 and 59")
    .max(59, "Minutes must be bewteen 0 and 59"),
  lat_seconds: z
    .number({ invalid_type_error: "Enter a number" })
    .int("Coordinates must be round numbers.")
    .min(0, "Seconds must be bewteen 0 and 59")
    .max(59, "Seconds must be bewteen 0 and 59"),
  lat_direction: z.enum(["North", "South"]),
  lon_degrees: z
    .number({ invalid_type_error: "Enter a number" })
    .int("Coordinates must be round numbers.")
    .min(0, `Longitude must be between W 179° 59' 59" and E 180° 0' 0"`)
    .max(180, `Longitude must be between W 179° 59' 59" and E 180° 0' 0"`),
  lon_minutes: z
    .number({ invalid_type_error: "Enter a number" })
    .int("Coordinates must be round numbers.")
    .min(0, "Minutes must be bewteen 0 and 59")
    .max(59, "Minutes must be bewteen 0 and 59"),
  lon_seconds: z
    .number({ invalid_type_error: "Enter a number" })
    .int("Coordinates must be round numbers.")
    .min(0, "Seconds must be bewteen 0 and 59")
    .max(59, "Seconds must be bewteen 0 and 59"),
  lon_direction: z.enum(["East", "West"]),
  elevation_ft: z.number({ invalid_type_error: "Enter a number" }),
  magnetic_variation: z.union([
    z
      .number({ invalid_type_error: "Enter a number, or leave blank" })
      .max(99.94, { message: "Must be less than 99.95" })
      .min(-99.94, { message: "Must be greater than -99.95" })
      .nullable(),
    z.literal(null),
  ]),
  hide: z.boolean(),
  has_taf: z.boolean(),
  has_metar: z.boolean(),
  has_fds: z.boolean(),
  status: z
    .string()
    .min(2, { message: "Must be at least 2 characters long" })
    .max(50, { message: "Must be at most 50 characters long" })
    .regex(/^[-a-zA-Z ']+$/, {
      message: "Only letters, spaces and symbols ' -",
    }),
});
type FormDataType = z.infer<typeof schema>;

export interface AerodromeDataFromForm extends FormDataType {
  id: number;
  status_id: number;
}

interface Props {
  aerodromeData: AerodromeDataFromForm;
  closeModal: () => void;
  isOpen: boolean;
  statusList: AerodromeStatus[];
}

const EditOfficialAerodromeForm = ({
  aerodromeData,
  closeModal,
  isOpen,
  statusList,
}: Props) => {
  const mutation = useEditOfficialAerodrome();
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
    if (isOpen) {
      reset({
        code: aerodromeData.code,
        name: aerodromeData.name,
        lat_degrees: aerodromeData.lat_degrees,
        lat_minutes: aerodromeData.lat_minutes,
        lat_seconds: aerodromeData.lat_seconds,
        lat_direction: aerodromeData.lat_direction,
        lon_degrees: aerodromeData.lon_degrees,
        lon_minutes: aerodromeData.lon_minutes,
        lon_seconds: aerodromeData.lon_seconds,
        lon_direction: aerodromeData.lon_direction,
        magnetic_variation: aerodromeData.magnetic_variation,
        elevation_ft: aerodromeData.elevation_ft,
        hide: aerodromeData.hide,
        has_taf: aerodromeData.has_taf,
        has_metar: aerodromeData.has_metar,
        has_fds: aerodromeData.has_fds,
        status: aerodromeData.status,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const wrongCoordinates = checkCoordinates({
      lon_direction: watch("lon_direction"),
      lon_degrees: watch("lon_degrees"),
      lon_minutes: watch("lon_minutes"),
      lon_seconds: watch("lon_seconds"),
    });
    if (!wrongCoordinates) clearErrors("lon_degrees");
  }, [
    watch("lon_direction"),
    watch("lon_degrees"),
    watch("lon_minutes"),
    watch("lon_seconds"),
  ]);

  const handleCancel = () => {
    closeModal();
  };

  const checkCoordinates = (data: FieldValues) => {
    const { lon_direction, lon_degrees, lon_minutes, lon_seconds } = data;
    if (
      (lon_direction === "E" &&
        lon_degrees >= 180 &&
        (lon_minutes > 59 || lon_seconds > 59)) ||
      (lon_direction === "W" && lon_degrees > 179)
    ) {
      setError("lon_degrees", {
        type: "manual",
        message: `Longitude must be between W 179° 59' 59" and E 180° 0' 0"`,
      });
      return true;
    }
    return false;
  };

  const handleMagneticVariationValue = (value: string): number | null => {
    if (Number.isNaN(parseFloat(value))) return null;
    return parseFloat(value);
  };

  const submitHandler = (data: FieldValues) => {
    const wrongCoordinates = checkCoordinates(data);
    const statusId = statusList.find((item) => item.status === data.status)?.id;

    if (!statusId) {
      setError("status", {
        type: "manual",
        message: "Select a valid option",
      });
    }

    if (!wrongCoordinates && statusId) {
      closeModal();
      mutation.mutate({
        id: aerodromeData.id,
        code: data.code,
        name: data.name,
        lat_degrees: data.lat_degrees,
        lat_minutes: data.lat_minutes,
        lat_seconds: data.lat_seconds,
        lat_direction: data.lat_direction,
        lon_degrees: data.lon_degrees,
        lon_minutes: data.lon_minutes,
        lon_seconds: data.lon_seconds,
        lon_direction: data.lon_direction,
        magnetic_variation: data.magnetic_variation,
        elevation_ft: data.elevation_ft,
        hide: data.hide,
        has_taf: data.has_taf,
        has_metar: data.has_metar,
        has_fds: data.has_fds,
        status: data.status,
        status_id: statusId,
      });
    }
  };

  return (
    <HtmlForm onSubmit={handleSubmit(submitHandler)}>
      <h1>
        <div>
          <AddAerodromeIcon />
          {`${aerodromeData.id !== 0 ? "Edit" : "Add"} Aerodrome`}
        </div>
        <CloseIcon onClick={handleCancel} />
      </h1>
      <HtmlInputContainer>
        <HtmlCheckbox htmlFor="hide-waypoint">
          <input {...register("hide")} type="checkbox" id="hide-waypoint" />
          <span>
            <HideIcon />
            Hide
          </span>
        </HtmlCheckbox>
        <HtmlInput
          $required={true}
          $hasValue={!!watch("code")}
          $accepted={!errors.code}
        >
          <input
            {...register("code")}
            id="aerodrome_code"
            type="text"
            autoComplete="off"
            required={true}
          />
          {errors.code ? <p>{errors.code.message}</p> : <p>&nbsp;</p>}
          <label htmlFor="aerodrome_code">
            <CodeIcon />
            Code
          </label>
        </HtmlInput>
        <HtmlInput
          $required={true}
          $hasValue={!!watch("name")}
          $accepted={!errors.name}
        >
          <input
            {...register("name")}
            id="aerodrome_name"
            type="text"
            autoComplete="off"
            required={true}
          />
          {errors.name ? <p>{errors.name.message}</p> : <p>&nbsp;</p>}
          <label htmlFor="aerodrome_name">
            <NameIcon />
            Name
          </label>
        </HtmlInput>
        <HtmlInput
          $required={true}
          $hasValue={!!watch("elevation_ft") || watch("elevation_ft") === 0}
          $accepted={!errors.elevation_ft}
        >
          <input
            {...register("elevation_ft", { valueAsNumber: true })}
            id="aerodrome_elevation_ft"
            type="number"
            autoComplete="off"
          />
          {errors.elevation_ft ? (
            <p>{errors.elevation_ft.message}</p>
          ) : (
            <p>&nbsp;</p>
          )}
          <label htmlFor="aerodrome_magnetic_variation">
            <TerrainIcon />
            {"Elevation [ft]"}
          </label>
        </HtmlInput>
        <HtmlInput
          $required={false}
          $hasValue={
            !!watch("magnetic_variation") || watch("magnetic_variation") === 0
          }
          $accepted={!errors.magnetic_variation}
        >
          <input
            {...register("magnetic_variation", {
              setValueAs: handleMagneticVariationValue,
            })}
            step="any"
            id="aerodrome_magnetic_variation"
            type="number"
            autoComplete="off"
          />
          {errors.magnetic_variation ? (
            <p>{errors.magnetic_variation.message}</p>
          ) : (
            <p>&nbsp;</p>
          )}
          <label htmlFor="aerodrome_magnetic_variation">
            <CompassIcon />
            Magnetic Variation
          </label>
        </HtmlInput>
        <DataList
          setError={(message) =>
            setError("status", {
              type: "manual",
              message: message,
            })
          }
          clearErrors={() => clearErrors("status")}
          required={true}
          value={watch("status")}
          hasError={!!errors.status}
          errorMessage={errors.status?.message || ""}
          options={statusList ? statusList.map((item) => item.status) : []}
          setValue={(value: string) => setValue("status", value)}
          name="status"
          formIsOpen={isOpen}
          resetValue={aerodromeData.status}
        >
          <StatusIcon /> Status
        </DataList>
        <HtmlInputGroup>
          <h2>
            <WeatherIcon />
            Weather
          </h2>
          <HtmlGroupCheckbox htmlFor="taf">
            <input {...register("has_taf")} type="checkbox" id="taf" />
            <span>Has TAF</span>
          </HtmlGroupCheckbox>
          <HtmlGroupCheckbox htmlFor="metar">
            <input {...register("has_metar")} type="checkbox" id="metar" />
            <span>Has METAR</span>
          </HtmlGroupCheckbox>
          <HtmlGroupCheckbox htmlFor="fds">
            <input {...register("has_fds")} type="checkbox" id="fds" />
            <span>Has FDs</span>
          </HtmlGroupCheckbox>
        </HtmlInputGroup>
        <HtmlInputGroup>
          <h2>
            <LatitudeIcon />
            Latitude
          </h2>
          <HtmlInput
            $required={true}
            $hasValue={!!watch("lat_direction")}
            $accepted={!errors.lat_direction}
          >
            <HtmlSelectElement
              {...register("lat_direction")}
              id="aerodrome_lat_direction"
              autoComplete="off"
              required={true}
            >
              <option value="North">North</option>
              <option value="South">South</option>
            </HtmlSelectElement>
            {errors.lat_direction ? (
              <p>{errors.lat_direction.message}</p>
            ) : (
              <p>&nbsp;</p>
            )}
          </HtmlInput>
          <HtmlInput
            $required={true}
            $hasValue={!!watch("lat_degrees") || watch("lat_degrees") === 0}
            $accepted={!errors.lat_degrees}
          >
            <input
              {...register("lat_degrees", { valueAsNumber: true })}
              id="aerodrome_lat_degrees"
              type="number"
              autoComplete="off"
              required={true}
            />
            {errors.lat_degrees ? (
              <p>{errors.lat_degrees.message}</p>
            ) : (
              <p>&nbsp;</p>
            )}
            <label htmlFor="aerodrome_lat_degrees">
              <span>Degrees&nbsp;&deg;</span>
            </label>
          </HtmlInput>
          <HtmlInput
            $required={true}
            $hasValue={!!watch("lat_minutes") || watch("lat_minutes") === 0}
            $accepted={!errors.lat_minutes}
          >
            <input
              {...register("lat_minutes", { valueAsNumber: true })}
              id="aerodrome_lat_minutes"
              type="number"
              autoComplete="off"
              required={true}
            />
            {errors.lat_minutes ? (
              <p>{errors.lat_minutes.message}</p>
            ) : (
              <p>&nbsp;</p>
            )}
            <label htmlFor="aerodrome_lat_minutes">
              <span>Minutes&nbsp;'</span>
            </label>
          </HtmlInput>
          <HtmlInput
            $required={true}
            $hasValue={!!watch("lat_seconds") || watch("lat_seconds") === 0}
            $accepted={!errors.lat_seconds}
          >
            <input
              {...register("lat_seconds", { valueAsNumber: true })}
              id="aerodrome_lat_seconds"
              type="number"
              autoComplete="off"
              required={true}
            />
            {errors.lat_seconds ? (
              <p>{errors.lat_seconds.message}</p>
            ) : (
              <p>&nbsp;</p>
            )}
            <label htmlFor="aerodrome_lat_seconds">
              <span>Seconds&nbsp;"</span>
            </label>
          </HtmlInput>
        </HtmlInputGroup>
        <HtmlInputGroup>
          <h2>
            <LongitudeIcon />
            Longitude
          </h2>
          <HtmlInput
            $required={true}
            $hasValue={!!watch("lon_direction")}
            $accepted={!errors.lon_direction}
          >
            <HtmlSelectElement
              {...register("lon_direction")}
              id="aerodrome_lon_direction"
              autoComplete="off"
              required={true}
            >
              <option value="East">East</option>
              <option value="West">West</option>
            </HtmlSelectElement>
            {errors.lon_direction ? (
              <p>{errors.lon_direction.message}</p>
            ) : (
              <p>&nbsp;</p>
            )}
          </HtmlInput>
          <HtmlInput
            $required={true}
            $hasValue={!!watch("lon_degrees") || watch("lon_degrees") === 0}
            $accepted={!errors.lon_degrees}
          >
            <input
              {...register("lon_degrees", { valueAsNumber: true })}
              id="aerodrome_lon_degrees"
              type="number"
              autoComplete="off"
              required={true}
            />
            {errors.lon_degrees ? (
              <p>{errors.lon_degrees.message}</p>
            ) : (
              <p>&nbsp;</p>
            )}
            <label htmlFor="aerodrome_lon_degrees">
              <span>Degrees&nbsp;&deg;</span>
            </label>
          </HtmlInput>
          <HtmlInput
            $required={true}
            $hasValue={!!watch("lon_minutes") || watch("lon_minutes") === 0}
            $accepted={!errors.lon_minutes}
          >
            <input
              {...register("lon_minutes", { valueAsNumber: true })}
              id="aerodrome_lon_minutes"
              type="number"
              autoComplete="off"
              required={true}
            />
            {errors.lon_minutes ? (
              <p>{errors.lon_minutes.message}</p>
            ) : (
              <p>&nbsp;</p>
            )}
            <label htmlFor="aerodrome_lon_minutes">
              <span>Minutes&nbsp;'</span>
            </label>
          </HtmlInput>
          <HtmlInput
            $required={true}
            $hasValue={!!watch("lon_seconds") || watch("lon_seconds") === 0}
            $accepted={!errors.lon_seconds}
          >
            <input
              {...register("lon_seconds", { valueAsNumber: true })}
              id="aerodrome_lon_seconds"
              type="number"
              autoComplete="off"
              required={true}
            />
            {errors.lon_seconds ? (
              <p>{errors.lon_seconds.message}</p>
            ) : (
              <p>&nbsp;</p>
            )}
            <label htmlFor="aerodrome_lon_seconds">
              <span>Seconds&nbsp;"</span>
            </label>
          </HtmlInput>
        </HtmlInputGroup>
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
          handleClick={handleCancel}
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

export default EditOfficialAerodromeForm;
