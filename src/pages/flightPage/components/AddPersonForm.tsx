import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AiOutlineSave } from "react-icons/ai";
import { BsChevronDown, BsPersonFillAdd } from "react-icons/bs";
import { FaUser, FaWeightScale, FaUserSlash } from "react-icons/fa6";
import { LiaTimesSolid } from "react-icons/lia";
import { MdAirlineSeatReclineNormal } from "react-icons/md";
import { styled } from "styled-components";
import { z } from "zod";

import Button from "../../../components/common/button";
import useAddPerson from "../hooks/useAddPerson";
import useRemovePerson from "../hooks/useRemovePerson";
import Loader from "../../../components/Loader";
import { PassengerData } from "../../../hooks/usePassengersData";
import { ProfileData } from "../../profile/entities";
import DataList from "../../../components/common/datalist";

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

interface HtmlSectionProps {
  $isOpen: boolean;
  $isPair?: boolean;
}
const HtmlSectionContainer = styled.div`
  margin: 20px 0;
  width: 100%;
  padding: 0 10px;

  @media screen and (min-width: 610px) {
    padding: 0 20px;
  }
`;

const HtmlSectionTitle = styled.div<HtmlSectionProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 2px 5px;
  border-bottom: 1px solid
    ${(props) => (props.$isOpen ? "var(--color-white)" : "var(--color-grey)")};

  & div {
    cursor: pointer;
    display: flex;
    align-items: center;

    & h3:first-of-type {
      margin: 0;
      color: ${(props) =>
        props.$isOpen ? "var(--color-white)" : "var(--color-grey)"};
    }
  }

  @media screen and (min-width: 425px) {
    padding: 0 0 2px 20px;
  }
`;

const ToggleIcon = styled(BsChevronDown)<HtmlSectionProps>`
  color: var(--color-grey);
  cursor: pointer;
  margin-right: 5px;
  font-size: 25px;
  transform: rotate(${(props) => (props.$isOpen ? "-180deg" : "0deg")});
  transition: 0.3s transform linear;
  color: ${(props) =>
    props.$isOpen ? "var(--color-white)" : "var(--color-grey)"};

  @media screen and (min-width: 425px) {
    margin-right: 20px;
  }
`;

const HtmlSectionContent = styled.div<HtmlSectionProps>`
  transition: padding 0.6s, height 0.3s, opacity 0.6s;
  border: ${(props) => (props.$isOpen ? "1px" : "0")} solid var(--color-white);
  border-top: 0;
  padding: 0px;
  height: ${(props) =>
    props.$isOpen ? (props.$isPair ? "200px" : "350px") : "0px"};
  opacity: ${(props) => (props.$isOpen ? "1" : "0")};
  overflow: hidden;
  width: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  align-content: ${(props) => (props.$isPair ? "center" : "flex-start")};
  flex-wrap: wrap;
  flex-shrink: 0;

  & ul {
    padding-right: 10px;
  }

  @media screen and (min-width: 425px) {
    & ul {
      padding-right: 20px;
    }
  }
`;

const HtmlSectionSeparator = styled.div`
  display: flex;
  align-items: center;
  padding: 30px 20%;

  & div {
    flex: 1;
    border: 0.4px solid var(--color-grey);
    margin: 0 10px;
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
  padding: 10px 0 0;
  margin: 0 5px;
  max-width: 250px;

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
const SaveIcon = styled(AiOutlineSave)`
  font-size: 25px;
`;

const DeleteUserIcon = styled(FaUserSlash)`
  font-size: 20px;
`;

const TitleIcon = styled(MdAirlineSeatReclineNormal)`
  flex-shrink: 0;
  font-size: 30px;
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

const UserIcon = styled(FaUser)`
  font-size: 25px;
  flex-shrink: 0;
  margin: 0 5px 0 10px;
`;

const NewUserIcon = styled(BsPersonFillAdd)`
  font-size: 25px;
  flex-shrink: 0;
  margin: 0 5px 0 10px;
`;

const WeightIcon = styled(FaWeightScale)`
  font-size: 25px;
  flex-shrink: 0;
  margin: 0 5px 0 10px;
`;

const newPassengerSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Must be at least 2 characters long" })
    .max(255, { message: "Must be at most 255 characters long" })
    .regex(/^[A-Za-z0-9 /.'-]+$/, {
      message: "Only letters, numbers, spaces and symbols /'.-",
    }),
  weight_lb: z
    .number({ invalid_type_error: "Enter a number" })
    .nonnegative("Must be greater than or equal to 0")
    .max(999.94, { message: "Must be less than 999.95" }),
});

type NewPersonType = z.infer<typeof newPassengerSchema>;

interface PassengerDataFromForm extends NewPersonType {
  id: number;
  is_me?: boolean;
  passenger_profile_id?: number;
}

interface Props {
  flightId: number;
  passengerData: PassengerDataFromForm;
  seat: { name: string; id: number; number: number };
  maxWeight?: number;
  closeModal: () => void;
  isOpen: boolean;
}

const AddPersonForm = ({
  flightId,
  passengerData,
  seat,
  maxWeight,
  closeModal,
  isOpen,
}: Props) => {
  const [submited, setSubmited] = useState(false);
  const [fromSavedPassenger, setFromSavedPassenger] = useState(true);

  const [newPersonValues, setNewPersonValues] = useState<NewPersonType>({
    name: "",
    weight_lb: 0,
  });
  const [newPersonErrors, setNewPersonErrors] = useState<{
    name: string | null;
    weight_lb: string | null;
  }>({
    name: null,
    weight_lb: null,
  });

  const [savedPersonValue, setSavedPersonValue] = useState("");
  const [savedPersonErrors, setSavedPersonErrors] = useState<string | null>(
    null
  );
  const queryClient = useQueryClient();
  const savedPassengers = queryClient.getQueryData<PassengerData[]>([
    "passengers",
  ]);
  const profileData = queryClient.getQueryData<ProfileData>(["profile"]);
  const passengerOptions = [
    `${profileData?.name} (SELF): ${
      Math.round((profileData?.weight || 1) * 100) / 100
    } lb`,
    ...(savedPassengers?.map(
      (p) => `${p.name}: ${Math.round(p.weight_lb * 100) / 100} lb`
    ) || []),
  ];

  const mutation = useAddPerson(flightId);
  const removeMutation = useRemovePerson(flightId);

  useEffect(() => {
    if (isOpen) {
      if (passengerData.is_me) {
        setFromSavedPassenger(true);
        setSavedPersonValue(
          `${passengerData.name} (SELF): ${
            Math.round((passengerData?.weight_lb || 1) * 100) / 100
          } lb`
        );
        setNewPersonValues({
          name: "",
          weight_lb: 0,
        });
      } else if (passengerData.passenger_profile_id) {
        setFromSavedPassenger(true);
        setSavedPersonValue(
          `${passengerData.name}: ${
            Math.round(passengerData.weight_lb * 100) / 100
          } lb`
        );
        setNewPersonValues({
          name: "",
          weight_lb: 0,
        });
      } else {
        setFromSavedPassenger(!passengerData.id);
        setSavedPersonValue("");
        setNewPersonValues({
          name: passengerData.name,
          weight_lb: passengerData.weight_lb,
        });
      }
      setSavedPersonErrors(null);
      setNewPersonErrors({
        name: null,
        weight_lb: null,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (submited && (!mutation.isLoading || removeMutation.isLoading)) {
      closeModal();
    }
  }, [submited, mutation.isLoading, removeMutation.isLoading]);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    const result = newPassengerSchema.safeParse({
      name: newName,
      weight_lb: 0,
    });
    if (result.success) {
      setNewPersonErrors((prev) => ({ ...prev, name: null }));
    } else {
      setNewPersonErrors((prev) => ({
        ...prev,
        name: result.error.errors[0].message,
      }));
    }
    setNewPersonValues((prev) => ({ ...prev, name: newName }));
  };

  const handleWeightChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newWeight = parseFloat(e.target.value);
    const result = newPassengerSchema.safeParse({
      name: "newName",
      weight_lb: newWeight,
    });
    if (result.success) {
      setNewPersonErrors((prev) => ({ ...prev, weight_lb: null }));
    } else {
      setNewPersonErrors((prev) => ({
        ...prev,
        weight_lb: result.error.errors[0].message,
      }));
    }
    setNewPersonValues((prev) => ({ ...prev, weight_lb: newWeight }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!mutation.isLoading || removeMutation.isLoading) {
      if (fromSavedPassenger) {
        if (
          savedPersonValue ===
          `${profileData?.name} (SELF): ${
            Math.round((profileData?.weight || 1) * 100) / 100
          } lb`
        ) {
          mutation.mutate({
            id: passengerData.id,
            seat_row_id: seat.id,
            seat_number: seat.number,
            is_me: true,
          });
          setSubmited(true);
        } else {
          const passenger = savedPassengers?.find(
            (p) =>
              savedPersonValue ===
              `${p.name}: ${Math.round(p.weight_lb * 100) / 100} lb`
          );
          if (!passenger) {
            setSavedPersonErrors("Select a valid value");
          } else {
            mutation.mutate({
              id: passengerData.id,
              seat_row_id: seat.id,
              seat_number: seat.number,
              passenger_profile_id: passenger.id,
            });
            setSubmited(true);
          }
        }
      } else {
        const result = newPassengerSchema.safeParse({
          name: newPersonValues.name,
          weight_lb: newPersonValues.weight_lb,
        });
        if (result.success) {
          setNewPersonErrors({ name: null, weight_lb: null });
          mutation.mutate({
            id: passengerData.id,
            seat_row_id: seat.id,
            seat_number: seat.number,
            name: newPersonValues.name,
            weight_lb: newPersonValues.weight_lb,
          });
          setSubmited(true);
        } else {
          const newError = { ...newPersonErrors };
          for (const e of result.error.errors) {
            newError[e.path[0] as "name" | "weight_lb"] = e.message;
          }
          setNewPersonErrors({
            name: result.error.errors[0].message,
            weight_lb: result.error.errors[1].message,
          });
        }
      }
    }
  };

  const handleRemove = () => {
    removeMutation.mutate(passengerData.id);
    setSubmited(true);
  };

  const warnings = [];
  if (maxWeight) warnings.push(`Maximum weight: ${maxWeight} lb.`);

  return (
    <HtmlForm onSubmit={handleSubmit}>
      <h1>
        <div>
          <TitleIcon />
          {`Passenger/Crew in ${seat.name}`}
        </div>
        {mutation.isLoading || removeMutation.isLoading ? (
          <CloseIcon onClick={() => {}} $disabled={true} />
        ) : (
          <CloseIcon onClick={closeModal} $disabled={false} />
        )}
      </h1>
      <HtmlInputContainer $loading={mutation.isLoading}>
        {mutation.isLoading || removeMutation.isLoading ? (
          <Loader message="Calculating flight data . . ." />
        ) : (
          <>
            {maxWeight ? (
              <ul>
                {warnings.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            ) : null}
            <HtmlSectionContainer>
              <HtmlSectionTitle $isOpen={fromSavedPassenger}>
                <div
                  onClick={() => {
                    setFromSavedPassenger((prev) => !prev);
                  }}
                >
                  <ToggleIcon $isOpen={fromSavedPassenger} />
                  <h3>Saved Profile</h3>
                </div>
              </HtmlSectionTitle>
              <HtmlSectionContent $isOpen={fromSavedPassenger}>
                <DataList
                  setError={(err) => setSavedPersonErrors(err)}
                  clearErrors={() => setSavedPersonErrors(null)}
                  required={fromSavedPassenger}
                  value={savedPersonValue}
                  hasError={!!savedPersonErrors}
                  errorMessage={savedPersonErrors || ""}
                  options={passengerOptions}
                  setValue={(value: string) => setSavedPersonValue(value)}
                  name={`seat-${seat.id}-profile`}
                  formIsOpen={isOpen}
                  resetValue={
                    passengerData.is_me
                      ? `${passengerData.name} (SELF): ${
                          Math.round(passengerData.weight_lb * 100) / 100
                        } lb`
                      : passengerData.passenger_profile_id
                      ? `${passengerData.name}: ${
                          Math.round(passengerData.weight_lb * 100) / 100
                        } lb`
                      : ""
                  }
                >
                  <UserIcon /> Select Profile
                </DataList>
              </HtmlSectionContent>
            </HtmlSectionContainer>
            <HtmlSectionSeparator>
              <div />
              OR
              <div />
            </HtmlSectionSeparator>
            <HtmlSectionContainer>
              <HtmlSectionTitle $isOpen={!fromSavedPassenger}>
                <div
                  onClick={() => {
                    setFromSavedPassenger((prev) => !prev);
                  }}
                >
                  <ToggleIcon $isOpen={!fromSavedPassenger} />
                  <h3>New Passenger</h3>
                </div>
              </HtmlSectionTitle>
              <HtmlSectionContent $isOpen={!fromSavedPassenger} $isPair={true}>
                <HtmlInput
                  $required={!fromSavedPassenger}
                  $hasValue={newPersonValues.name !== ""}
                  $accepted={!newPersonErrors.name}
                >
                  <input
                    id={`seat-${seat.id}-name`}
                    type="text"
                    autoComplete="off"
                    onChange={handleNameChange}
                    value={newPersonValues.name}
                  />
                  {newPersonErrors.name ? (
                    <p>{newPersonErrors.name}</p>
                  ) : (
                    <p>&nbsp;</p>
                  )}
                  <label htmlFor={`seat-${seat.id}-name`}>
                    <NewUserIcon />
                    {"Name"}
                  </label>
                </HtmlInput>
                <HtmlInput
                  $required={!fromSavedPassenger}
                  $hasValue={
                    !!newPersonValues.weight_lb ||
                    newPersonValues.weight_lb === 0
                  }
                  $accepted={!newPersonErrors.weight_lb}
                >
                  <input
                    id={`seat-${seat.id}-weight`}
                    type="number"
                    autoComplete="off"
                    step="any"
                    onChange={handleWeightChange}
                    value={newPersonValues.weight_lb}
                  />
                  {newPersonErrors.weight_lb ? (
                    <p>{newPersonErrors.weight_lb}</p>
                  ) : (
                    <p>&nbsp;</p>
                  )}
                  <label htmlFor={`seat-${seat.id}-weight`}>
                    <WeightIcon />
                    {"Weight [lb]"}
                  </label>
                </HtmlInput>
              </HtmlSectionContent>
            </HtmlSectionContainer>
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
          disabled={mutation.isLoading || removeMutation.isLoading}
        >
          Cancel
        </Button>
        <Button
          fontSize={15}
          margin="5px 0"
          borderRadious={4}
          btnType="button"
          width="120px"
          height="35px"
          handleClick={handleRemove}
          spaceChildren="space-evenly"
          disabled={
            mutation.isLoading ||
            removeMutation.isLoading ||
            passengerData.id === 0
          }
        >
          Empty
          <DeleteUserIcon />
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
          disabled={mutation.isLoading || removeMutation.isLoading}
          disabledText="Saving..."
        >
          Save
          <SaveIcon />
        </Button>
      </HtmlButtons>
    </HtmlForm>
  );
};

export default AddPersonForm;
