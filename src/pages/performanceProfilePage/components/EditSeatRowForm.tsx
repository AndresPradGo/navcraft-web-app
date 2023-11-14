import { useEffect } from "react";
import { useForm, FieldValues } from "react-hook-form";
import { AiOutlineSave, AiFillTag } from "react-icons/ai";
import { GiWeight } from "react-icons/gi";
import { LiaTimesSolid, LiaRulerHorizontalSolid } from "react-icons/lia";
import { MdAirlineSeatReclineNormal } from "react-icons/md";
import { TbNumber } from "react-icons/tb";
import { styled } from "styled-components";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Button from "../../../components/common/button";
import useEditSeatRow from "../hooks/useEditSeatRow";

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
const SaveIcon = styled(AiOutlineSave)`
  font-size: 25px;
`;
const TitleIcon = styled(MdAirlineSeatReclineNormal)`
  flex-shrink: 0;
  font-size: 30px;
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

const NameIcon = styled(AiFillTag)`
  font-size: 25px;
  margin: 0 5px 0 10px;
`;

const ArmIcon = styled(LiaRulerHorizontalSolid)`
  font-size: 25px;
  margin: 0 5px 0 10px;
`;

const NumberIcon = styled(TbNumber)`
  font-size: 25px;
  margin: 0 5px 0 10px;
`;

const WeightIcon = styled(GiWeight)`
  font-size: 25px;
  margin: 0 5px 0 10px;
`;

const schema = z.object({
  name: z
    .string()
    .min(2, { message: "Must be at least 2 characters long" })
    .max(50, { message: "Must be at most 50 characters long" })
    .regex(/^[\-a-zA-Z0-9 ]+$/, {
      message: "Only letters, numbers white space, and hyphens -",
    }),
  arm_in: z
    .number({ invalid_type_error: "Enter a number" })
    .max(9999.94, { message: "Must be less than 9999.95" })
    .min(0, { message: "Must be greater than zero" }),
  weight_limit_lb: z.union([
    z
      .number({ invalid_type_error: "Enter a number or leave blank" })
      .max(9999.94, { message: "Must be less than 9999.95" })
      .min(0, { message: "Must be greater than zero" })
      .nullable(),
    z.literal(null),
  ]),
  number_of_seats: z
    .number({ invalid_type_error: "Enter a number" })
    .int("Enter a round number.")
    .min(0, "Must be greather than zero."),
});
type FormDataType = z.infer<typeof schema>;

export interface SeatRowDataFromForm extends FormDataType {
  id: number;
}

interface Props {
  seatRowData: SeatRowDataFromForm;
  closeModal: () => void;
  isOpen: boolean;
  profileId: number;
}
const EditSeatRowForm = ({
  seatRowData,
  closeModal,
  isOpen,
  profileId,
}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormDataType>({ resolver: zodResolver(schema) });

  const mutation = useEditSeatRow(profileId);

  useEffect(() => {
    if (isOpen) {
      reset({
        name: seatRowData.name,
        arm_in: seatRowData.arm_in,
        number_of_seats: seatRowData.number_of_seats,
        weight_limit_lb: seatRowData.weight_limit_lb,
      });
    }
  }, [isOpen]);

  const handleWeightLimitValue = (value: string): number | null => {
    if (Number.isNaN(parseFloat(value))) return null;
    return parseFloat(value);
  };

  const submitHandler = (data: FieldValues) => {
    closeModal();
    mutation.mutate({
      id: seatRowData.id,
      name: data.name,
      arm_in: data.arm_in,
      number_of_seats: data.number_of_seats,
      weight_limit_lb: data.weight_limit_lb,
    });
  };

  return (
    <HtmlForm onSubmit={handleSubmit(submitHandler)}>
      <h1>
        <div>
          <TitleIcon />
          {`${seatRowData.id !== 0 ? "Edit" : "Add"} Seat Row`}
        </div>
        <CloseIcon onClick={closeModal} />
      </h1>
      <HtmlInputContainer>
        <HtmlInput
          $required={true}
          $hasValue={!!watch("name")}
          $accepted={!errors.name}
        >
          <input
            {...register("name")}
            id="seat_name"
            type="text"
            autoComplete="off"
            required={true}
          />
          {errors.name ? <p>{errors.name.message}</p> : <p>&nbsp;</p>}
          <label htmlFor="seat_name">
            <NameIcon />
            Name
          </label>
        </HtmlInput>
        <HtmlInput
          $required={true}
          $hasValue={!!watch("arm_in") || watch("arm_in") === 0}
          $accepted={!errors.arm_in}
        >
          <input
            {...register("arm_in", { valueAsNumber: true })}
            id="seat_arm_in"
            step="any"
            type="number"
            autoComplete="off"
          />
          {errors.arm_in ? <p>{errors.arm_in.message}</p> : <p>&nbsp;</p>}
          <label htmlFor="seat_arm_in">
            <ArmIcon />
            {"Arm [in]"}
          </label>
        </HtmlInput>
        <HtmlInput
          $required={true}
          $hasValue={
            !!watch("number_of_seats") || watch("number_of_seats") === 0
          }
          $accepted={!errors.number_of_seats}
        >
          <input
            {...register("number_of_seats", { valueAsNumber: true })}
            id="seat_number_of_seats"
            type="number"
            autoComplete="off"
          />
          {errors.number_of_seats ? (
            <p>{errors.number_of_seats.message}</p>
          ) : (
            <p>&nbsp;</p>
          )}
          <label htmlFor="seat_number_of_seats">
            <NumberIcon />
            {"of Seats in Row"}
          </label>
        </HtmlInput>
        <HtmlInput
          $required={false}
          $hasValue={
            !!watch("weight_limit_lb") || watch("weight_limit_lb") === 0
          }
          $accepted={!errors.weight_limit_lb}
        >
          <input
            {...register("weight_limit_lb", {
              setValueAs: handleWeightLimitValue,
            })}
            step="any"
            id="seat_weight_limit_lb"
            type="number"
            autoComplete="off"
          />
          {errors.weight_limit_lb ? (
            <p>{errors.weight_limit_lb.message}</p>
          ) : (
            <p>&nbsp;</p>
          )}
          <label htmlFor="seat_weight_limit_lb">
            <WeightIcon />
            {"Weight Limit [Lb]"}
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

export default EditSeatRowForm;
