import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { AiOutlineSave } from "react-icons/ai";
import { LiaTimesSolid, LiaMapSignsSolid } from "react-icons/lia";
import { MdOutlineLiveHelp } from "react-icons/md";
import { RiMapPinAddFill } from "react-icons/ri";
import { TbMapSearch } from "react-icons/tb";
import { TfiMapAlt } from "react-icons/tfi";
import { toast } from "react-toastify";
import { styled } from "styled-components";
import { z } from "zod";

import Button from "../../../../components/common/button";
import APIClient from "../../../../services/apiClient";
import ExpandibleMessage from "../../../../components/common/ExpandibleMessage";
import WaypointsList from "./WaypointsList";
import formatCoordinate from "../../../../utils/formatCoordinate";
import usePostNewLeg from "../../hooks/usePostNewLeg";
import Loader from "../../../../components/Loader";

const HtmlForm = styled.form`
  width: 100%;
  min-height: 200px;
  height: 100%;
  flex-grow: 1;
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

interface InputContainerProps {
  $loading: boolean;
}
const HtmlInputContainer = styled.div<InputContainerProps>`
  display: flex;
  flex-direction: column;
  justify-content: ${(props) => (props.$loading ? "center" : "flex-start")};
  width: 100%;
  overflow-y: auto;
  padding: 20px 10px;
  flex-grow: 1;

  border-top: 1px solid var(--color-grey);
  border-bottom: 1px solid var(--color-grey);

  & p {
    font-size: 15px;
    color: var(--color-warning-hover);
    margin: 2px;
    text-wrap: wrap;
  }
`;

interface HideInputsProps {
  $hidden: boolean;
}

const HtmlPairedInputsContainer = styled.div<HideInputsProps>`
  transition: all 0.5s;
  border: 1px solid var(--color-grey);
  border-radius: 3px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  align-content: center;
  flex-wrap: wrap;
  margin-top: 20px;
  padding-bottom: 10px;
  flex-shrink: 0;
  overflow: hidden;
  max-height: ${(props) => (props.$hidden ? "0" : "300px")};
  opacity: ${(props) => (props.$hidden ? "0" : "1")};

  & div {
    max-width: 205px;
    padding: 10px 0 0;
    margin: 0 5px;

    & input {
      padding: 10px;
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
  padding: 10px 10px 0;

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
    font-size: 15px;
    color: var(--color-warning-hover);
    margin: 2px;
    text-wrap: wrap;
  }

  @media screen and (min-width: 425px) {
    padding: 10px 20px 0;
  }
`;

const HtmlButtons = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
  align-content: center;
  width: 100%;
  padding: 10px 20px;

  @media screen and (min-width: 450px) {
    flex-direction: row;
  }
`;

const HelpIcon = styled(MdOutlineLiveHelp)`
  font-size: 20px;
  flex-shrink: 0;
  margin: 0 0 0 5px;
`;

const SaveIcon = styled(AiOutlineSave)`
  font-size: 25px;
`;

const MapIcon = styled(TfiMapAlt)`
  font-size: 25px;
  flex-shrink: 0;
`;

const TitleIcon = styled(RiMapPinAddFill)`
  flex-shrink: 0;
  font-size: 30px;
  margin: 0 2px 0 0;

  @media screen and (min-width: 510px) {
    font-size: 40px;
  }
`;

const CodeIcon = styled(TbMapSearch)`
  font-size: 25px;
  margin: 0 10px;
`;

const NameIcon = styled(LiaMapSignsSolid)`
  font-size: 25px;
  margin: 0 10px;
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

const identifierSchema = z.object({
  code: z
    .string()
    .min(2, { message: "2 to 12 characters long" })
    .max(12, { message: "2 to 12 characters long" })
    .regex(/^[-A-Za-z0-9']+$/, {
      message: "Only symbols -'",
    }),
  name: z
    .string()
    .min(2, { message: "2 to 50 characters long" })
    .max(50, { message: "2 to 50 characters long" }),
});

const coordinateSchema = z.object({
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
  lat_direction: z.enum(["N", "S"]),
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
  lon_direction: z.enum(["E", "W"]),
});
export type CoordinateDataType = z.infer<typeof coordinateSchema>;
export type IdentifierDataType = z.infer<typeof identifierSchema>;

export interface NearbyWaypointType
  extends CoordinateDataType,
    IdentifierDataType {
  id: number;
  type?: "aerodrome" | "waypoint" | "user aerodrome" | "user waypoint";
  distance: number;
}

interface CurrentWaypointType {
  code: string;
  name: string;
  isVFR: boolean;
  isUser: boolean;
}

interface Props {
  currentWaypoint: CurrentWaypointType;
  flightId: number;
  sequence: number;
  latitude: number;
  longitude: number;
  closeModal: () => void;
  restoreFlight: () => void;
  isOpen: boolean;
}
const DropMarkerForm = ({
  currentWaypoint,
  flightId,
  sequence,
  latitude,
  longitude,
  closeModal,
  isOpen,
  restoreFlight,
}: Props) => {
  const apiClient = new APIClient<string, NearbyWaypointType>("/waypoints");

  const [identifier, setIdentifier] = useState<IdentifierDataType>({
    code: "",
    name: "",
  });
  const [identifierError, setIdentifierError] = useState<{
    code: string | null;
    name: string | null;
  }>({
    code: null,
    name: null,
  });
  const [nearbyWaypoints, setNearbyWaypoints] = useState<NearbyWaypointType[]>(
    []
  );
  const [selectedWaypointId, setSelectedWaypointId] = useState<number | null>(
    null
  );

  const [error, setError] = useState<
    | "Select a waypoint"
    | "Enter a valid code and name for the new location"
    | null
  >(null);

  const [isLoading, setIsLoading] = useState(false);

  const [submited, setSubmited] = useState(false);

  const mutation = usePostNewLeg(flightId);

  useEffect(() => {
    if (submited && !mutation.isLoading) {
      closeModal();
      restoreFlight();
    }
  }, [submited, mutation.isLoading]);

  useEffect(() => {
    if (isOpen) {
      setIdentifier({
        code: "",
        name: "",
      });

      setIdentifierError({
        code: null,
        name: null,
      });
      setIsLoading(true);

      apiClient
        .getAll(`/${latitude}/${longitude}?distance=10`)
        .then((res) => {
          setNearbyWaypoints(
            res.filter((item) => {
              const nearbyWPIsVFR =
                item.type === "aerodrome" || item.type === "waypoint";
              return (
                item.code !== currentWaypoint.code ||
                item.name !== currentWaypoint.name ||
                currentWaypoint.isVFR !== nearbyWPIsVFR ||
                currentWaypoint.isUser !== !nearbyWPIsVFR
              );
            })
          );
          if (res.length > 0) setSelectedWaypointId(null);
          else setSelectedWaypointId(0);
          setIsLoading(false);
        })
        .catch((err) => {
          if (isOpen && err.name !== "CanceledError") {
            toast.error("Something went wrong, please try again", {
              position: "top-center",
              autoClose: 10000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
            handleCancel();
            setIsLoading(false);
          }
        });
    }

    return () => {
      apiClient.cancelRequest();
    };
  }, [latitude, longitude, sequence]);

  const instructions = [
    "Either select the location where you dropped the pin, or one of the nearby waypoints.",
    "If you select the location, make sure to enter a name and a code, in order to identify the new waypoint in the navigation log.",
    "If you are not sure about the location where you dropped the pin, you can view the new tentative flight path, by peeking the map.",
    "After “peeking the map”, you can drag-and-drop the pin in a new location, or you can confirm the current location by clicking anywhere in the map.",
  ];

  const handleCancel = () => {
    restoreFlight();
    closeModal();
  };

  const handleCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newCode = e.target.value;
    const result = identifierSchema.safeParse({
      code: newCode,
      name: "newName",
    });
    if (result.success) {
      setIdentifierError((prev) => ({ ...prev, code: null }));
    } else
      setIdentifierError((prev) => ({
        ...prev,
        code: result.error.errors[0].message,
      }));
    setIdentifier((prev) => ({ ...prev, code: newCode }));
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    const result = identifierSchema.safeParse({
      name: newName,
      code: "newCode",
    });
    if (result.success) {
      setIdentifierError((prev) => ({ ...prev, name: null }));
    } else
      setIdentifierError((prev) => ({
        ...prev,
        name: result.error.errors[0].message,
      }));
    setIdentifier((prev) => ({ ...prev, name: newName }));
  };

  const handleSelect = (id: number) => {
    if (
      error === "Select a waypoint" ||
      (error === "Enter a valid code and name for the new location" && id !== 0)
    )
      setError(null);
    setSelectedWaypointId(id);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!mutation.isLoading) {
      if (selectedWaypointId === null) setError("Select a waypoint");
      else if (selectedWaypointId === 0) {
        const result = identifierSchema.safeParse(identifier);
        if (result.success) {
          setIdentifierError({ code: null, name: null });
          const newCoordinates = formatCoordinate(latitude, longitude);
          mutation.mutate({
            existing_waypoint_id: 0,
            new_waypoint: {
              ...identifier,
              ...newCoordinates,
            },
            sequence,
          });
          setSubmited(true);
        } else {
          const newError = { ...identifierError };
          for (const e of result.error.errors) {
            newError[e.path[0] as "name" | "code"] = e.message;
          }
          setIdentifierError(newError);
          setError("Enter a valid code and name for the new location");
        }
      } else {
        const waypoint = nearbyWaypoints.find(
          (w) => w.id === selectedWaypointId
        );
        mutation.mutate({
          type: waypoint?.type,
          existing_waypoint_id: selectedWaypointId,
          new_waypoint: {
            code: waypoint?.code || "",
            name: waypoint?.name || "",
            lat_degrees: waypoint?.lat_degrees || 1,
            lat_minutes: waypoint?.lat_minutes || 1,
            lat_seconds: waypoint?.lat_seconds || 1,
            lat_direction: waypoint?.lat_direction || "N",
            lon_degrees: waypoint?.lon_degrees || 1,
            lon_minutes: waypoint?.lon_minutes || 1,
            lon_seconds: waypoint?.lon_seconds || 1,
            lon_direction: waypoint?.lon_direction || "W",
          },
          sequence,
        });
        setSubmited(true);
      }
    }
  };

  return (
    <HtmlForm onSubmit={handleSubmit}>
      <h1>
        <div>
          <TitleIcon />
          Add Waypoint to Flight
        </div>
        {mutation.isLoading ? (
          <CloseIcon onClick={() => {}} $disabled={true} />
        ) : (
          <CloseIcon onClick={handleCancel} $disabled={false} />
        )}
      </h1>
      <HtmlInputContainer $loading={mutation.isLoading}>
        {mutation.isLoading ? (
          <Loader />
        ) : (
          <>
            <ExpandibleMessage reset={!isOpen} messageList={instructions}>
              Help <HelpIcon />
            </ExpandibleMessage>
            <HtmlPairedInputsContainer $hidden={selectedWaypointId !== 0}>
              <HtmlInput
                $required={selectedWaypointId === 0}
                $hasValue={identifier.code !== ""}
                $accepted={!identifierError.code}
              >
                <input
                  id="location-code"
                  type="text"
                  autoComplete="off"
                  required={selectedWaypointId === 0}
                  onChange={handleCodeChange}
                  value={identifier.code}
                />
                {identifierError.code ? (
                  <p>{identifierError.code}</p>
                ) : (
                  <p>&nbsp;</p>
                )}
                <label htmlFor="location-code">
                  <CodeIcon />
                  {"Code"}
                </label>
              </HtmlInput>
              <HtmlInput
                $required={selectedWaypointId === 0}
                $hasValue={identifier.name !== ""}
                $accepted={!identifierError.name}
              >
                <input
                  id="location-name"
                  type="text"
                  autoComplete="off"
                  required={selectedWaypointId === 0}
                  onChange={handleNameChange}
                  value={identifier.name}
                />
                {identifierError.name ? (
                  <p>{identifierError.name}</p>
                ) : (
                  <p>&nbsp;</p>
                )}
                <label htmlFor="location-name">
                  <NameIcon />
                  {"Name"}
                </label>
              </HtmlInput>
            </HtmlPairedInputsContainer>
            <WaypointsList
              isLoading={isLoading}
              latitude={latitude}
              longitude={longitude}
              waypoints={nearbyWaypoints}
              selectedId={selectedWaypointId}
              handleSelectedId={handleSelect}
            />
            {error ? <p>{error}</p> : <p>&nbsp;</p>}
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
          handleClick={handleCancel}
          btnType="button"
          width="120px"
          height="35px"
          disabled={mutation.isLoading}
        >
          Cancel
        </Button>
        <Button
          fontSize={15}
          margin="5px 0"
          borderRadious={4}
          handleClick={closeModal}
          btnType="button"
          width="135px"
          height="35px"
          spaceChildren="space-evenly"
          disabled={mutation.isLoading}
        >
          Peek Map
          <MapIcon />
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

export default DropMarkerForm;
