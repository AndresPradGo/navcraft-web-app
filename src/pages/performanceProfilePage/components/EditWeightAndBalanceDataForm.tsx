import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm, FieldValues } from "react-hook-form";
import { AiOutlineSave } from "react-icons/ai";
import {
  BiSolidPlaneLand,
  BiSolidPlaneTakeOff,
  BiSolidEditAlt,
} from "react-icons/bi";
import { GiRadialBalance } from "react-icons/gi";
import { LiaTimesSolid } from "react-icons/lia";
import { MdNoLuggage, MdBalance } from "react-icons/md";
import { PiAirplane, PiAirplaneFill } from "react-icons/pi";
import { styled } from "styled-components";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Button from "../../../components/common/button";
import { WeightAndBalanceDataFromAPI } from "../../../services/weightBalanceClient";

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
    font-size: 18px;
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

const EditIcon = styled(BiSolidEditAlt)`
  flex-shrink: 0;
  font-size: 30px;
  margin: 0 2px 0 0;

  @media screen and (min-width: 510px) {
    font-size: 40px;
  }
`;

const BalanceIcon = styled(MdBalance)`
  flex-shrink: 0;
  font-size: 30px;
  margin: 0 10px 0 0;

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

const EmptyIcon = styled(PiAirplane)`
  font-size: 25px;
  margin: 0 5px 0 10px;
`;

const RampIcon = styled(PiAirplaneFill)`
  font-size: 25px;
  margin: 0 5px 0 10px;
`;

const TakeoffIcon = styled(BiSolidPlaneTakeOff)`
  font-size: 25px;
  margin: 0 5px 0 10px;
`;

const LandingIcon = styled(BiSolidPlaneLand)`
  font-size: 25px;
  margin: 0 5px 0 10px;
`;

const LuggageIcon = styled(MdNoLuggage)`
  font-size: 25px;
  margin: 0 5px 0 10px;
`;

const COGIcon = styled(GiRadialBalance)`
  font-size: 25px;
  margin: 0 5px 0 10px;
`;

const schema = z.object({
  center_of_gravity_in: z
    .number({ invalid_type_error: "Enter a number" })
    .max(9999.94, { message: "Must be less than 9999.95" })
    .min(0, { message: "Must be greater than zero" }),
  empty_weight_lb: z
    .number({ invalid_type_error: "Enter a number" })
    .max(9999.94, { message: "Must be less than 9999.95" })
    .min(0, { message: "Must be greater than zero" }),
  max_ramp_weight_lb: z
    .number({ invalid_type_error: "Enter a number" })
    .max(9999.94, { message: "Must be less than 9999.95" })
    .min(0, { message: "Must be greater than zero" }),
  max_takeoff_weight_lb: z
    .number({ invalid_type_error: "Enter a number" })
    .max(9999.94, { message: "Must be less than 9999.95" })
    .min(0, { message: "Must be greater than zero" }),
  max_landing_weight_lb: z
    .number({ invalid_type_error: "Enter a number" })
    .max(9999.94, { message: "Must be less than 9999.95" })
    .min(0, { message: "Must be greater than zero" }),
  baggage_allowance_lb: z
    .number({ invalid_type_error: "Enter a number" })
    .max(9999.94, { message: "Must be less than 9999.95" })
    .min(0, { message: "Must be greater than zero" }),
});

type FormDataType = z.infer<typeof schema>;

export interface WeightBalanceDataFromForm extends FormDataType {
  id: number;
}

interface Props {
  closeModal: () => void;
  isOpen: boolean;
  profileId: number;
}

const EditWeightAndBalanceDataForm = ({
  closeModal,
  isOpen,
  profileId,
}: Props) => {
  const queryClient = useQueryClient();
  const weightBalanceData =
    queryClient.getQueryData<WeightAndBalanceDataFromAPI>([
      "AircraftWeightBalanceData",
      profileId,
    ]);

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
        center_of_gravity_in: weightBalanceData?.center_of_gravity_in,
        empty_weight_lb: weightBalanceData?.empty_weight_lb,
        max_ramp_weight_lb: weightBalanceData?.max_ramp_weight_lb,
        max_takeoff_weight_lb: weightBalanceData?.max_takeoff_weight_lb,
        max_landing_weight_lb: weightBalanceData?.max_landing_weight_lb,
        baggage_allowance_lb: weightBalanceData?.baggage_allowance_lb,
      });
    }
  }, [isOpen]);

  const submitHandler = (data: FieldValues) => {
    closeModal();
    console.log(data);
  };
  return (
    <HtmlForm onSubmit={handleSubmit(submitHandler)}>
      <h1>
        <div>
          <EditIcon />
          <BalanceIcon />
          {`Edit Performance Profile W&B Data`}
        </div>
        <CloseIcon onClick={closeModal} />
      </h1>
      <HtmlInputContainer>
        <HtmlInput
          $required={true}
          $hasValue={
            !!watch("center_of_gravity_in") ||
            watch("center_of_gravity_in") === 0
          }
          $accepted={!errors.center_of_gravity_in}
        >
          <input
            {...register("center_of_gravity_in", { valueAsNumber: true })}
            id="center_of_gravity_in"
            step="any"
            type="number"
            autoComplete="off"
          />
          {errors.center_of_gravity_in ? (
            <p>{errors.center_of_gravity_in.message}</p>
          ) : (
            <p>&nbsp;</p>
          )}
          <label htmlFor="center_of_gravity_in">
            <COGIcon />
            {"CoG [in]"}
          </label>
        </HtmlInput>
        <HtmlInput
          $required={true}
          $hasValue={
            !!watch("empty_weight_lb") || watch("empty_weight_lb") === 0
          }
          $accepted={!errors.empty_weight_lb}
        >
          <input
            {...register("empty_weight_lb", { valueAsNumber: true })}
            id="empty_weight_lb"
            step="any"
            type="number"
            autoComplete="off"
          />
          {errors.empty_weight_lb ? (
            <p>{errors.empty_weight_lb.message}</p>
          ) : (
            <p>&nbsp;</p>
          )}
          <label htmlFor="empty_weight_lb">
            <EmptyIcon />
            {"Empty Weight [lb]"}
          </label>
        </HtmlInput>
        <HtmlInput
          $required={true}
          $hasValue={
            !!watch("max_ramp_weight_lb") || watch("max_ramp_weight_lb") === 0
          }
          $accepted={!errors.max_ramp_weight_lb}
        >
          <input
            {...register("max_ramp_weight_lb", { valueAsNumber: true })}
            id="max_ramp_weight_lb"
            step="any"
            type="number"
            autoComplete="off"
          />
          {errors.max_ramp_weight_lb ? (
            <p>{errors.max_ramp_weight_lb.message}</p>
          ) : (
            <p>&nbsp;</p>
          )}
          <label htmlFor="max_ramp_weight_lb">
            <RampIcon />
            {"Max Ramp Weight [lb]"}
          </label>
        </HtmlInput>
        <HtmlInput
          $required={true}
          $hasValue={
            !!watch("max_takeoff_weight_lb") ||
            watch("max_takeoff_weight_lb") === 0
          }
          $accepted={!errors.max_takeoff_weight_lb}
        >
          <input
            {...register("max_takeoff_weight_lb", { valueAsNumber: true })}
            id="max_takeoff_weight_lb"
            step="any"
            type="number"
            autoComplete="off"
          />
          {errors.max_takeoff_weight_lb ? (
            <p>{errors.max_takeoff_weight_lb.message}</p>
          ) : (
            <p>&nbsp;</p>
          )}
          <label htmlFor="max_takeoff_weight_lb">
            <TakeoffIcon />
            {"Max Takeoff Weight [lb]"}
          </label>
        </HtmlInput>
        <HtmlInput
          $required={true}
          $hasValue={
            !!watch("max_landing_weight_lb") ||
            watch("max_landing_weight_lb") === 0
          }
          $accepted={!errors.max_landing_weight_lb}
        >
          <input
            {...register("max_landing_weight_lb", { valueAsNumber: true })}
            id="max_landing_weight_lb"
            step="any"
            type="number"
            autoComplete="off"
          />
          {errors.max_landing_weight_lb ? (
            <p>{errors.max_landing_weight_lb.message}</p>
          ) : (
            <p>&nbsp;</p>
          )}
          <label htmlFor="max_landing_weight_lb">
            <LandingIcon />
            {"Max Landing Weight [lb]"}
          </label>
        </HtmlInput>
        <HtmlInput
          $required={true}
          $hasValue={
            !!watch("baggage_allowance_lb") ||
            watch("baggage_allowance_lb") === 0
          }
          $accepted={!errors.baggage_allowance_lb}
        >
          <input
            {...register("baggage_allowance_lb", { valueAsNumber: true })}
            id="baggage_allowance_lb"
            step="any"
            type="number"
            autoComplete="off"
          />
          {errors.baggage_allowance_lb ? (
            <p>{errors.baggage_allowance_lb.message}</p>
          ) : (
            <p>&nbsp;</p>
          )}
          <label htmlFor="baggage_allowance_lb">
            <LuggageIcon />
            {"Baggage Allowance [lb]"}
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

export default EditWeightAndBalanceDataForm;
