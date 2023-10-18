import { useEffect } from "react";
import { AiOutlineSave } from "react-icons/ai";
import { FaUser, FaWeightScale } from "react-icons/fa6";
import { PiUsersFourThin } from "react-icons/pi";
import { useForm, FieldValues } from "react-hook-form";
import { styled } from "styled-components";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Button from "../common/button";
import useEditPassenger from "./useEditPassenger";

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
`;

const HtmlInputContainer = styled.div`
  width: 100%;
  overflow-y: auto;
  padding: 20px 0;

  border-top: 1px solid var(--color-grey);
  border-bottom: 1px solid var(--color-grey);
`;

const HtmlInput = styled.div`
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

    &:valid ~ label,
    &:focus ~ label {
      color: var(--color-highlight);
      transform: translate(7px, 7px) scale(0.8);
    }

    &:focus,
    &:valid {
      border: 1px solid var(--color-highlight);
    }
  }

  & p {
    font-size: 16px;
    color: var(--color-warning);
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

const NameIcon = styled(FaUser)`
  font-size: 25px;
  margin: 0 10px;
`;

const WeightIcon = styled(FaWeightScale)`
  font-size: 25px;
  margin: 0 10px;
`;

const PassengersIcon = styled(PiUsersFourThin)`
  font-size: 30px;
  margin: 0 5px;

  @media screen and (min-width: 425px) {
    margin: 0 10px;
  }
`;

const schema = z.object({
  name: z
    .string()
    .min(2, { message: "Must be at least 2 characters long" })
    .max(255, { message: "Must be at most 255 characters long" })
    .regex(/^[A-Za-z0-9 .'-]+$/, {
      message: "Only letters, numbers, spaces and symbols '.-",
    }),
  weight_lb: z.number().nonnegative("Must be greater than or equal to 0"),
});
export type FormDataType = z.infer<typeof schema>;

interface PassengerDataFromForm extends FormDataType {
  id: number;
}

interface Props {
  passengerData: PassengerDataFromForm;
  closeModal: () => void;
  isOpen: boolean;
}

const PassengerForm = ({ passengerData, closeModal, isOpen }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormDataType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: passengerData?.name,
      weight_lb: passengerData?.weight_lb,
    },
  });

  useEffect(() => {
    reset({
      name: passengerData.name,
      weight_lb: passengerData.weight_lb,
    });
  }, [isOpen]);

  const editPassengerMutation = useEditPassenger();

  const handleCancel = () => {
    closeModal();
  };

  const submitHandler = (data: FieldValues) => {
    closeModal();
    editPassengerMutation.mutate({
      name: data.name,
      weight_lb: data.weight_lb,
      id: passengerData.id,
    });
  };

  return (
    <HtmlForm onSubmit={handleSubmit(submitHandler)}>
      <h1>
        <PassengersIcon />
        {`${passengerData.id !== 0 ? "Edit" : "New"} Passenger`}
      </h1>
      <HtmlInputContainer>
        <HtmlInput>
          <input
            {...register("name")}
            id="passenger_name"
            type="text"
            autoComplete="off"
            required={true}
          />
          {errors.name ? <p>{errors.name.message}</p> : <p>&nbsp;</p>}
          <label htmlFor="passenger_name">
            <NameIcon />
            Name
          </label>
        </HtmlInput>
        <HtmlInput>
          <input
            {...register("weight_lb", { valueAsNumber: true })}
            id="passenger_weight_lb"
            type="number"
            autoComplete="off"
            required={true}
          />
          {errors.weight_lb ? <p>{errors.weight_lb.message}</p> : <p>&nbsp;</p>}
          <label htmlFor="passenger_weight_lb">
            <WeightIcon />
            Weight
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

export default PassengerForm;
