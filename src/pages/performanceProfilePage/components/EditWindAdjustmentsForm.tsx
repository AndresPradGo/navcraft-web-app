import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm, FieldValues } from "react-hook-form";
import { AiOutlineSave } from "react-icons/ai";
import { LiaTimesSolid } from "react-icons/lia";
import { PiWind } from "react-icons/pi";
import { TbWindsock } from "react-icons/tb";
import { styled } from "styled-components";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Button from "../../../components/common/button";
import { TakeoffLandingDataFromAPI } from "../../../services/takeoffLandingPerformanceDataClient";
import useEditWindAdjustmentData from "../hooks/useEditWindAdjustmentData";

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

  & ul {
    & li {
      text-wrap: wrap;
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

const TitleIcon = styled(TbWindsock)`
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

const HeadwindIcon = styled(PiWind)`
  font-size: 25px;
  margin: 0 5px 0 10px;
  transform: rotate(180deg);
`;

const TailwindIcon = styled(PiWind)`
  font-size: 25px;
  margin: 0 5px 0 10px;
`;

const schema = z.object({
  percent_decrease_knot_headwind: z
    .number({ invalid_type_error: "Enter a number" })
    .max(99.94, { message: "Must be less than 99.95" })
    .min(0, { message: "Must be greater than zero" }),
  percent_increase_knot_tailwind: z
    .number({ invalid_type_error: "Enter a number" })
    .max(99.94, { message: "Must be less than 99.95" })
    .min(0, { message: "Must be greater than zero" }),
});

export type WindAdjustmentDataFromForm = z.infer<typeof schema>;

interface Props {
  closeModal: () => void;
  isOpen: boolean;
  profileId: number;
  isTakeoff: boolean;
}
const EditWindAdjustmentsForm = ({
  closeModal,
  isOpen,
  profileId,
  isTakeoff,
}: Props) => {
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<TakeoffLandingDataFromAPI>([
    isTakeoff ? "takeoffPerformance" : "landingPerformance",
    profileId,
  ]);

  const mutation = useEditWindAdjustmentData(profileId, isTakeoff);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<WindAdjustmentDataFromForm>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (isOpen) {
      reset({
        percent_decrease_knot_headwind:
          data?.percent_decrease_knot_headwind || 0,
        percent_increase_knot_tailwind:
          data?.percent_increase_knot_tailwind || 0,
      });
    }
  }, [isOpen]);

  const submitHandler = (data: FieldValues) => {
    closeModal();
    mutation.mutate({
      percent_decrease_knot_headwind: data.percent_decrease_knot_headwind,
      percent_increase_knot_tailwind: data.percent_increase_knot_tailwind,
    });
  };

  return (
    <HtmlForm onSubmit={handleSubmit(submitHandler)}>
      <h1>
        <div>
          <TitleIcon />
          {`Edit ${isTakeoff ? "Takeoff" : "Landing"} Wind Adjustments`}
        </div>
        <CloseIcon onClick={closeModal} />
      </h1>
      <HtmlInputContainer>
        <ul>
          <li>
            {`These are the percentages by which the ${
              isTakeoff ? "takeoff" : "landing"
            } distance will be decreased/increased, with every knot of headwind/tailwind.`}
          </li>
        </ul>
        <HtmlInput
          $required={true}
          $hasValue={
            !!watch("percent_decrease_knot_headwind") ||
            watch("percent_decrease_knot_headwind") === 0
          }
          $accepted={!errors.percent_decrease_knot_headwind}
        >
          <input
            {...register("percent_decrease_knot_headwind", {
              valueAsNumber: true,
            })}
            id="percent_decrease_knot_headwind"
            step="any"
            type="number"
            autoComplete="off"
          />
          {errors.percent_decrease_knot_headwind ? (
            <p>{errors.percent_decrease_knot_headwind.message}</p>
          ) : (
            <p>&nbsp;</p>
          )}
          <label htmlFor="percent_decrease_knot_headwind">
            <HeadwindIcon />
            {"Headwind [%]"}
          </label>
        </HtmlInput>
        <HtmlInput
          $required={true}
          $hasValue={
            !!watch("percent_increase_knot_tailwind") ||
            watch("percent_increase_knot_tailwind") === 0
          }
          $accepted={!errors.percent_increase_knot_tailwind}
        >
          <input
            {...register("percent_increase_knot_tailwind", {
              valueAsNumber: true,
            })}
            id="percent_increase_knot_tailwind"
            step="any"
            type="number"
            autoComplete="off"
          />
          {errors.percent_increase_knot_tailwind ? (
            <p>{errors.percent_increase_knot_tailwind.message}</p>
          ) : (
            <p>&nbsp;</p>
          )}
          <label htmlFor="percent_increase_knot_tailwind">
            <TailwindIcon />
            {"Tailwind [%]"}
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

export default EditWindAdjustmentsForm;
