import { useEffect } from "react";
import { AiOutlineSave } from "react-icons/ai";
import { LiaMapSignsSolid } from "react-icons/lia";
import { ImCompass2 } from "react-icons/im";
import {
  TbMapPinCog,
  TbMapPinPlus,
  TbMapSearch,
  TbWorldLatitude,
  TbWorldLongitude,
} from "react-icons/tb";
import { useForm, FieldValues } from "react-hook-form";
import { styled } from "styled-components";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Button from "../common/button";

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
    align-items: center;
    font-size: 25px;

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

const HtmlInputBase = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 10px 20px 0;

  & label {
    position: absolute;
    top: 0;
    left: 0;
    font-size: 20px;
    display: flex;
    align-items: center;
    transform: translate(17px, 47px);
    transition: transform 0.3s;

    & span {
      margin: 0 10px;
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
    border: 1px solid var(--color-grey);
    color: var(--color-white);
    font-size: 20px;
  }

  & p {
    font-size: 16px;
    color: var(--color-warning);
    margin: 2px;
    text-wrap: wrap;
  }
`;

const HtmlRequiredInput = styled(HtmlInputBase)`
  & input {
    &:focus ~ label {
      color: var(--color-highlight);
      transform: translate(7px, 7px) scale(0.8);
    }

    &:valid ~ label {
      color: var(--color-white) !important;
      transform: translate(7px, 7px) scale(0.8);
    }

    &:focus {
      border: 1px solid var(--color-highlight);
    }

    &:valid {
      border: 1px solid var(--color-white) !important;
    }
  }
`;

interface RequiredInputProps {
  $isActive: boolean;
}

const HtmlInput = styled(HtmlInputBase)<RequiredInputProps>`
  & input {
    border: 1px solid
      ${(props) =>
        props.$isActive ? "var(--color-white)" : "var(--color-grey)"};

    & ~ label {
      color: ${(props) =>
        props.$isActive ? "var(--color-white)" : "var(--color-grey-bright)"};
      transform: ${(props) =>
        props.$isActive
          ? "translate(7px, 7px) scale(0.8)"
          : "translate(17px, 47px) scale(1)"};
    }

    &:focus ~ label {
      color: var(--color-white);
      transform: translate(7px, 7px) scale(0.8);
    }

    &:focus {
      border: 1px solid var(--color-white);
    }
  }
`;

const HtmlSelectElement = styled.select`
  position: relative;
  appearance: none;
  width: 100%;
  padding: 10px 20px;
  margin: 0;
  margin-top: 20px;
  border-radius: 5px;
  background-color: var(--color-grey-dark);
  outline: none;
  border: 1px solid var(--color-white);
  color: var(--color-white);
  font-size: 20px;

  &::after {
    content: attr(value);
    position: absolute;
    right: 10px;
    top: 50%;
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

const CodeIcon = styled(TbMapSearch)`
  font-size: 25px;
  margin: 0 10px;
`;

const NameIcon = styled(LiaMapSignsSolid)`
  font-size: 25px;
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

const EditWaypointIcon = styled(TbMapPinCog)`
  font-size: 30px;
  margin: 0 5px;

  @media screen and (min-width: 425px) {
    margin: 0 10px;
  }
`;

const AddWaypointIcon = styled(TbMapPinPlus)`
  font-size: 30px;
  margin: 0 5px;

  @media screen and (min-width: 425px) {
    margin: 0 10px;
  }
`;

const schema = z.object({
  code: z
    .string()
    .min(2, { message: "Must be at least 2 characters long" })
    .max(50, { message: "Must be at most 50 characters long" })
    .regex(/^[-A-Za-z0-9]+$/, {
      message: "Only letters, numbers and symbol -",
    }),
  name: z
    .string()
    .min(2, { message: "Must be at least 2 characters long" })
    .max(255, { message: "Must be at most 255 characters long" })
    .regex(/^[A-Za-z0-9 .'-]+$/, {
      message: "Only letters, numbers, spaces and symbols '.-",
    }),
  lat_degrees: z
    .number()
    .int("Coordinates must be round numbers.")
    .min(0, "Latitude must be between S89 59 59 and N89 59 59")
    .max(89, "Latitude must be between S89 59 59 and N89 59 59"),
  lat_minutes: z
    .number()
    .int("Coordinates must be round numbers.")
    .min(0, "Minutes must be bewteen 0 and 59")
    .max(59, "Minutes must be bewteen 0 and 59"),
  lat_seconds: z
    .number()
    .int("Coordinates must be round numbers.")
    .min(0, "Seconds must be bewteen 0 and 59")
    .max(59, "Seconds must be bewteen 0 and 59"),
  lat_direction: z.enum(["North", "South"]),
  lon_degrees: z
    .number()
    .int("Coordinates must be round numbers.")
    .min(0, "Longitude must be between W179 59 59 and E180 0 0")
    .max(180, "Longitude must be between W179 59 59 and E180 0 0"),
  lon_minutes: z
    .number()
    .int("Coordinates must be round numbers.")
    .min(0, "Minutes must be bewteen 0 and 59")
    .max(59, "Minutes must be bewteen 0 and 59"),
  lon_seconds: z
    .number()
    .int("Coordinates must be round numbers.")
    .min(0, "Seconds must be bewteen 0 and 59")
    .max(59, "Seconds must be bewteen 0 and 59"),
  lon_direction: z.enum(["East", "West"]),
  magnetic_variation: z.number().optional(),
});
export type FormDataType = z.infer<typeof schema>;

export interface WaypointDataFromForm extends FormDataType {
  id: number;
}

interface Props {
  waypointData: WaypointDataFromForm;
  closeModal: () => void;
  isOpen: boolean;
}

const EditWaypointForm = ({ waypointData, closeModal, isOpen }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    watch,
  } = useForm<FormDataType>({ resolver: zodResolver(schema) });

  useEffect(() => {
    reset({
      code: waypointData.code,
      name: waypointData.name,
      lat_degrees: waypointData.lat_degrees,
      lat_minutes: waypointData.lat_minutes,
      lat_seconds: waypointData.lat_seconds,
      lat_direction: waypointData.lat_direction,
      lon_degrees: waypointData.lon_degrees,
      lon_minutes: waypointData.lon_minutes,
      lon_seconds: waypointData.lon_seconds,
      lon_direction: waypointData.lon_direction,
      magnetic_variation: waypointData.magnetic_variation,
    });
  }, [isOpen]);

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
        message: "Longitude must be between W179 59 59 and E180 0 0",
      });
      return true;
    }
    return false;
  };

  const submitHandler = (data: FieldValues) => {
    const badData = checkCoordinates(data);
    if (!badData) {
      closeModal();
      console.log(data.lat_direction);
    }
  };

  return (
    <HtmlForm onSubmit={handleSubmit(submitHandler)}>
      <h1>
        {waypointData.id !== 0 ? <EditWaypointIcon /> : <AddWaypointIcon />}
        {`${waypointData.id !== 0 ? "Edit" : "Add"} Waypoint`}
      </h1>
      <HtmlInputContainer>
        <HtmlRequiredInput>
          <input
            {...register("name")}
            id="waypoint_name"
            type="text"
            autoComplete="off"
            required={true}
          />
          {errors.name ? <p>{errors.name.message}</p> : <p>&nbsp;</p>}
          <label htmlFor="waypoint_name">
            <NameIcon />
            Name
          </label>
        </HtmlRequiredInput>
        <HtmlRequiredInput>
          <input
            {...register("code")}
            id="waypoint_code"
            type="text"
            autoComplete="off"
            required={true}
          />
          {errors.code ? <p>{errors.code.message}</p> : <p>&nbsp;</p>}
          <label htmlFor="waypoint_code">
            <CodeIcon />
            Code
          </label>
        </HtmlRequiredInput>
        <HtmlInput
          $isActive={
            !!watch("magnetic_variation") || watch("magnetic_variation") === 0
          }
        >
          <input
            {...register("magnetic_variation")}
            id="waypoint_magnetic_variation"
            type="text"
            autoComplete="off"
            required={true}
          />
          {errors.magnetic_variation ? (
            <p>{errors.magnetic_variation.message}</p>
          ) : (
            <p>&nbsp;</p>
          )}
          <label htmlFor="waypoint_magnetic_variation">
            <CompassIcon />
            Magnetic Variation
          </label>
        </HtmlInput>
        <HtmlInputGroup>
          <h2>
            <LatitudeIcon />
            Latitude
          </h2>
          <HtmlRequiredInput>
            <HtmlSelectElement
              {...register("lat_direction")}
              id="waypoint_lat_direction"
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
          </HtmlRequiredInput>
          <HtmlRequiredInput>
            <input
              {...register("lat_degrees")}
              id="waypoint_lat_degrees"
              type="text"
              autoComplete="off"
              required={true}
            />
            {errors.lat_degrees ? (
              <p>{errors.lat_degrees.message}</p>
            ) : (
              <p>&nbsp;</p>
            )}
            <label htmlFor="waypoint_lat_degrees">
              <span>Degrees&nbsp;&deg;</span>
            </label>
          </HtmlRequiredInput>
          <HtmlRequiredInput>
            <input
              {...register("lat_minutes")}
              id="waypoint_lat_minutes"
              type="text"
              autoComplete="off"
              required={true}
            />
            {errors.lat_minutes ? (
              <p>{errors.lat_minutes.message}</p>
            ) : (
              <p>&nbsp;</p>
            )}
            <label htmlFor="waypoint_lat_minutes">
              <span>Minutes&nbsp;'</span>
            </label>
          </HtmlRequiredInput>
          <HtmlRequiredInput>
            <input
              {...register("lat_seconds")}
              id="waypoint_lat_seconds"
              type="text"
              autoComplete="off"
              required={true}
            />
            {errors.lat_seconds ? (
              <p>{errors.lat_seconds.message}</p>
            ) : (
              <p>&nbsp;</p>
            )}
            <label htmlFor="waypoint_lat_seconds">
              <span>Seconds&nbsp;"</span>
            </label>
          </HtmlRequiredInput>
        </HtmlInputGroup>
        <HtmlInputGroup>
          <h2>
            <LongitudeIcon />
            Longitude
          </h2>
          <HtmlRequiredInput>
            <HtmlSelectElement
              {...register("lon_direction")}
              id="waypoint_lon_direction"
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
          </HtmlRequiredInput>
          <HtmlRequiredInput>
            <input
              {...register("lon_degrees")}
              id="waypoint_lon_degrees"
              type="text"
              autoComplete="off"
              required={true}
            />
            {errors.lon_degrees ? (
              <p>{errors.lon_degrees.message}</p>
            ) : (
              <p>&nbsp;</p>
            )}
            <label htmlFor="waypoint_lon_degrees">
              <span>Degrees&nbsp;&deg;</span>
            </label>
          </HtmlRequiredInput>
          <HtmlRequiredInput>
            <input
              {...register("lon_minutes")}
              id="waypoint_lon_minutes"
              type="text"
              autoComplete="off"
              required={true}
            />
            {errors.lon_minutes ? (
              <p>{errors.lon_minutes.message}</p>
            ) : (
              <p>&nbsp;</p>
            )}
            <label htmlFor="waypoint_lon_minutes">
              <span>Minutes&nbsp;'</span>
            </label>
          </HtmlRequiredInput>
          <HtmlRequiredInput>
            <input
              {...register("lon_seconds")}
              id="waypoint_lon_seconds"
              type="text"
              autoComplete="off"
              required={true}
            />
            {errors.lon_seconds ? (
              <p>{errors.lon_seconds.message}</p>
            ) : (
              <p>&nbsp;</p>
            )}
            <label htmlFor="waypoint_lon_seconds">
              <span>Seconds&nbsp;"</span>
            </label>
          </HtmlRequiredInput>
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

export default EditWaypointForm;
