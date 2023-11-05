import { useForm, FieldValues } from "react-hook-form";
import { AiOutlineSave, AiFillTag } from "react-icons/ai";
import { GiAirplane } from "react-icons/gi";
import { IoAirplane } from "react-icons/io5";
import { LiaTimesSolid } from "react-icons/lia";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { SiFloatplane } from "react-icons/si";
import { styled } from "styled-components";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";

import Button from "../common/button";
import useAddAircraft from "./useAddAircraft";

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

const HtmlButtons = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  padding: 10px 20px;
`;

const TitleIcon = styled(IoAirplane)`
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

const MakeIcon = styled(SiFloatplane)`
  font-size: 25px;
  margin: 0 10px;
`;

const ModelIcon = styled(GiAirplane)`
  font-size: 35px;
  margin: 0 10px;
`;

const NameIcon = styled(AiFillTag)`
  font-size: 15px;
  margin: 0 5px 0 10px;
`;

const RegistrationIcon = styled(TfiHeadphoneAlt)`
  font-size: 20px;
  margin: 0 10px;
`;

const SaveIcon = styled(AiOutlineSave)`
  font-size: 25px;
`;

const schema = z.object({
  make: z
    .string()
    .min(2, { message: "Must be at least 2 characters long" })
    .max(50, { message: "Must be at most 50 characters long" })
    .regex(/^[\.\-a-zA-Z0-9\(\) ]+$/, {
      message: "Only letters, numbers, white space, and symbols .-()",
    }),
  model: z
    .string()
    .min(2, { message: "Must be at least 2 characters long" })
    .max(50, { message: "Must be at most 50 characters long" })
    .regex(/^[\.\-a-zA-Z0-9\(\) ]+$/, {
      message: "Only letters, numbers, white space, and symbols .-()",
    }),
  abbreviation: z
    .string()
    .min(2, { message: "Must be at least 2 characters long" })
    .max(10, { message: "Must be at most 10 characters long" })
    .regex(/^[\-a-zA-Z0-9]+$/, {
      message: "Only letters, numbers, and symbol -",
    }),
  registration: z
    .string()
    .min(2, { message: "Must be at least 2 characters long" })
    .max(10, { message: "Must be at most 10 characters long" })
    .regex(/^[\-a-zA-Z0-9]+$/, {
      message: "Only letters, numbers, and symbol -",
    }),
});
type FormDataType = z.infer<typeof schema>;

export interface AircraftDataFromForm extends FormDataType {
  id: number;
}

interface Props {
  aircraftData: AircraftDataFromForm;
  closeModal: () => void;
  isOpen: boolean;
}

const EditAircraftForm = ({ aircraftData, closeModal, isOpen }: Props) => {
  const addMutation = useAddAircraft();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormDataType>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (isOpen) {
      reset({
        make: aircraftData.make,
        model: aircraftData.model,
        abbreviation: aircraftData.abbreviation,
        registration: aircraftData.registration,
      });
    }
  }, [isOpen]);

  const submitHandler = (data: FieldValues) => {
    closeModal();
    if (aircraftData.id === 0) {
      addMutation.mutate({
        id: aircraftData.id,
        make: data.make,
        model: data.model,
        abbreviation: data.abbreviation,
        registration: data.registration,
      });
    }
  };

  return (
    <HtmlForm onSubmit={handleSubmit(submitHandler)}>
      <h1>
        <div>
          <TitleIcon />
          {`${aircraftData.id !== 0 ? "Edit" : "Add New"} Aircraft`}
        </div>
        <CloseIcon onClick={closeModal} />
      </h1>
      <HtmlInputContainer>
        <HtmlInput
          $required={true}
          $hasValue={!!watch("registration")}
          $accepted={!errors.registration}
        >
          <input
            {...register("registration")}
            id="aircraft_registration"
            type="text"
            autoComplete="off"
            required={true}
          />
          {errors.registration ? (
            <p>{errors.registration.message}</p>
          ) : (
            <p>&nbsp;</p>
          )}
          <label htmlFor="aircraft_registration">
            <RegistrationIcon />
            {"Call Sign [ex: C-GABC]"}
          </label>
        </HtmlInput>
        <HtmlInput
          $required={true}
          $hasValue={!!watch("make")}
          $accepted={!errors.make}
        >
          <input
            {...register("make")}
            id="aircraft_make"
            type="text"
            autoComplete="off"
            required={true}
          />
          {errors.make ? <p>{errors.make.message}</p> : <p>&nbsp;</p>}
          <label htmlFor="aircraft_make">
            <MakeIcon />
            {"Make [ex: Cessna]"}
          </label>
        </HtmlInput>
        <HtmlInput
          $required={true}
          $hasValue={!!watch("abbreviation")}
          $accepted={!errors.abbreviation}
        >
          <input
            {...register("abbreviation")}
            id="aircraft_abbreviation"
            type="text"
            autoComplete="off"
            required={true}
          />
          {errors.abbreviation ? (
            <p>{errors.abbreviation.message}</p>
          ) : (
            <p>&nbsp;</p>
          )}
          <label htmlFor="aircraft_abbreviation">
            <ModelIcon />
            {"Model [ex: C172]"}
          </label>
        </HtmlInput>
        <HtmlInput
          $required={true}
          $hasValue={!!watch("model")}
          $accepted={!errors.model}
        >
          <input
            {...register("model")}
            id="aircraft_name"
            type="text"
            autoComplete="off"
            required={true}
          />
          {errors.model ? <p>{errors.model.message}</p> : <p>&nbsp;</p>}
          <label htmlFor="aircraft_name">
            <NameIcon />
            {"Name [ex: Cessna 172 M]"}
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

export default EditAircraftForm;
