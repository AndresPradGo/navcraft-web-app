import { useEffect } from "react";
import { useForm, FieldValues } from "react-hook-form";
import { AiOutlineSave, AiFillTag } from "react-icons/ai";
import { BsDropletHalf, BsFillDropletFill } from "react-icons/bs";
import { LiaTimesSolid, LiaRulerHorizontalSolid } from "react-icons/lia";
import { MdPropaneTank } from "react-icons/md";
import { TbReorder } from "react-icons/tb";
import { styled } from "styled-components";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Button from "../../../components/common/button";
import useEditFuelTank from "../hooks/useEditFuelTank";

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
const TitleIcon = styled(MdPropaneTank)`
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

const CapacityIcon = styled(BsFillDropletFill)`
  font-size: 25px;
  margin: 0 5px 0 10px;
`;

const UnusableIcon = styled(BsDropletHalf)`
  font-size: 25px;
  margin: 0 5px 0 10px;
`;

const SequenceIcon = styled(TbReorder)`
  font-size: 30px;
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
  fuel_capacity_gallons: z
    .number({ invalid_type_error: "Enter a number" })
    .max(999.94, { message: "Must be less than 999.94" })
    .min(0, { message: "Must be greater than zero" }),
  unusable_fuel_gallons: z.union([
    z
      .number({ invalid_type_error: "Enter a number or leave blank" })
      .max(999.94, { message: "Must be less than 999.94" })
      .min(0, { message: "Must be greater than zero" })
      .nullable(),
    z.literal(null),
  ]),
  burn_sequence: z.union([
    z
      .number({ invalid_type_error: "Enter a number or leave blank" })
      .int("Enter a round number")
      .min(1, { message: "Must be greater than or equal to 1" })
      .nullable(),
    z.literal(null),
  ]),
});
type FormDataType = z.infer<typeof schema>;

export interface FuelTankDataFromForm extends FormDataType {
  id: number;
}

interface Props {
  fuelTankData: FuelTankDataFromForm;
  closeModal: () => void;
  isOpen: boolean;
  profileId: number;
  aircraftId: number;
}

const EditFuelTankForm = ({
  fuelTankData,
  closeModal,
  isOpen,
  profileId,
  aircraftId,
}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormDataType>({ resolver: zodResolver(schema) });

  const mutation = useEditFuelTank(profileId, aircraftId);

  useEffect(() => {
    if (isOpen) {
      reset({
        name: fuelTankData.name,
        arm_in: fuelTankData.arm_in,
        fuel_capacity_gallons: fuelTankData.fuel_capacity_gallons,
        unusable_fuel_gallons: fuelTankData.unusable_fuel_gallons,
        burn_sequence: fuelTankData.burn_sequence,
      });
    }
  }, [isOpen]);

  const handleNullableNumberValue = (value: string): number | null => {
    if (Number.isNaN(parseFloat(value))) return null;
    return parseFloat(value);
  };

  const submitHandler = (data: FieldValues) => {
    closeModal();
    mutation.mutate({
      id: fuelTankData.id,
      name: data.name,
      arm_in: data.arm_in,
      fuel_capacity_gallons: data.fuel_capacity_gallons,
      unusable_fuel_gallons: data.unusable_fuel_gallons,
      burn_sequence: data.burn_sequence,
    });
  };

  return (
    <HtmlForm onSubmit={handleSubmit(submitHandler)}>
      <h1>
        <div>
          <TitleIcon />
          {`${fuelTankData.id !== 0 ? "Edit" : "Add"} Fuel Tank`}
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
            id={`${fuelTankData ? fuelTankData.id : ""}-tank_name`}
            type="text"
            autoComplete="off"
            required={true}
          />
          {errors.name ? <p>{errors.name.message}</p> : <p>&nbsp;</p>}
          <label htmlFor={`${fuelTankData ? fuelTankData.id : ""}-tank_name`}>
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
            id={`${fuelTankData ? fuelTankData.id : ""}-tank_arm_in`}
            step="any"
            type="number"
            autoComplete="off"
          />
          {errors.arm_in ? <p>{errors.arm_in.message}</p> : <p>&nbsp;</p>}
          <label htmlFor={`${fuelTankData ? fuelTankData.id : ""}-tank_arm_in`}>
            <ArmIcon />
            {"Arm [in]"}
          </label>
        </HtmlInput>
        <HtmlInput
          $required={true}
          $hasValue={
            !!watch("fuel_capacity_gallons") ||
            watch("fuel_capacity_gallons") === 0
          }
          $accepted={!errors.fuel_capacity_gallons}
        >
          <input
            {...register("fuel_capacity_gallons", { valueAsNumber: true })}
            step="any"
            id={`${
              fuelTankData ? fuelTankData.id : ""
            }-tank_fuel_capacity_gallons`}
            type="number"
            autoComplete="off"
          />
          {errors.fuel_capacity_gallons ? (
            <p>{errors.fuel_capacity_gallons.message}</p>
          ) : (
            <p>&nbsp;</p>
          )}
          <label
            htmlFor={`${
              fuelTankData ? fuelTankData.id : ""
            }-tank_fuel_capacity_gallons`}
          >
            <CapacityIcon />
            {"Usable Capacity [gal]"}
          </label>
        </HtmlInput>
        <HtmlInput
          $required={false}
          $hasValue={
            !!watch("unusable_fuel_gallons") ||
            watch("unusable_fuel_gallons") === 0
          }
          $accepted={!errors.unusable_fuel_gallons}
        >
          <input
            {...register("unusable_fuel_gallons", {
              setValueAs: handleNullableNumberValue,
            })}
            id={`${
              fuelTankData ? fuelTankData.id : ""
            }-tank_unusable_fuel_gallons`}
            type="number"
            step="any"
            autoComplete="off"
          />
          {errors.unusable_fuel_gallons ? (
            <p>{errors.unusable_fuel_gallons.message}</p>
          ) : (
            <p>&nbsp;</p>
          )}
          <label
            htmlFor={`${
              fuelTankData ? fuelTankData.id : ""
            }-tank_unusable_fuel_gallons`}
          >
            <UnusableIcon />
            {"Unusable Fuel [gal]"}
          </label>
        </HtmlInput>
        <HtmlInput
          $required={false}
          $hasValue={!!watch("burn_sequence") || watch("burn_sequence") === 0}
          $accepted={!errors.burn_sequence}
        >
          <input
            {...register("burn_sequence", {
              setValueAs: handleNullableNumberValue,
            })}
            id={`${fuelTankData ? fuelTankData.id : ""}-tank_burn_sequence`}
            type="number"
            autoComplete="off"
          />
          {errors.burn_sequence ? (
            <p>{errors.burn_sequence.message}</p>
          ) : (
            <p>&nbsp;</p>
          )}
          <label
            htmlFor={`${
              fuelTankData ? fuelTankData.id : ""
            }-tank_burn_sequence`}
          >
            <SequenceIcon />
            {"Burn Sequence"}
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

export default EditFuelTankForm;
