import { useEffect } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import { AiOutlineSave } from 'react-icons/ai';
import { BiSolidEditAlt } from 'react-icons/bi';
import { BsFillFuelPumpFill, BsThermometerSun } from 'react-icons/bs';
import { LiaTimesSolid } from 'react-icons/lia';
import { TbTrendingUp2 } from 'react-icons/tb';
import { styled } from 'styled-components';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import Button from '../../../components/common/button';
import useEditClimbData from '../hooks/useEditClimbData';

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
    cursor: ${(props) => (props.$hasValue ? 'default' : 'text')};
    position: absolute;
    top: 0;
    left: 0;
    font-size: 15px;
    display: flex;
    align-items: center;
    transform: ${(props) =>
      props.$hasValue
        ? 'translate(7px, 7px) scale(0.8)'
        : 'translate(17px, 50px)'};
    color: ${(props) =>
      props.$hasValue
        ? props.$accepted
          ? 'var(--color-grey-bright)'
          : 'var(--color-highlight)'
        : 'var(--color-grey-bright)'};
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
            ? 'var(--color-grey)'
            : 'var(--color-highlight)'
          : 'var(--color-grey)'};
    color: var(--color-white);
    font-size: 20px;

    &:focus ~ label {
      cursor: default;
      color: ${(props) =>
        props.$accepted && (props.$hasValue || !props.$required)
          ? 'var(--color-white)'
          : 'var(--color-highlight)'};
      transform: translate(7px, 7px) scale(0.8);
    }

    &:focus {
      box-shadow: ${(props) =>
        props.$accepted && (props.$hasValue || !props.$required)
          ? '0'
          : '0 0 6px 0 var(--color-highlight)'};
      border: 1px solid
        ${(props) =>
          props.$accepted && (props.$hasValue || !props.$required)
            ? 'var(--color-white)'
            : 'var(--color-highlight)'};
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

const TemperatureIcon = styled(BsThermometerSun)`
  font-size: 25px;
  margin: 0 0 0 10px;
`;

const FuelIcon = styled(BsFillFuelPumpFill)`
  font-size: 18px;
  margin: 0 5px 0 10px;
`;

const EditIcon = styled(BiSolidEditAlt)`
  flex-shrink: 0;
  font-size: 30px;
  margin: 0 2px 0 0;

  @media screen and (min-width: 510px) {
    font-size: 40px;
  }
`;

const ClimbIcon = styled(TbTrendingUp2)`
  flex-shrink: 0;
  font-size: 30px;
  margin: 0 10px 0 0;

  @media screen and (min-width: 510px) {
    font-size: 40px;
  }
`;

const schema = z.object({
  take_off_taxi_fuel_gallons: z.union([
    z
      .number({ invalid_type_error: 'Enter a number' })
      .max(99.94, { message: 'Must be less than 99.94' })
      .min(0, { message: 'Must be greater than zero' })
      .nullable(),
    z.literal(null),
  ]),
  percent_increase_climb_temperature_c: z.union([
    z
      .number({ invalid_type_error: 'Enter a number' })
      .max(99.94, { message: 'Must be less than 99.94' })
      .min(0, { message: 'Must be greater than zero' })
      .nullable(),
    z.literal(null),
  ]),
});
export type ClimbAdjustmentValuesFromForm = z.infer<typeof schema>;

interface Props {
  data: ClimbAdjustmentValuesFromForm;
  closeModal: () => void;
  isOpen: boolean;
  profileId: number;
}

const EditClimbDataForm = ({ data, closeModal, isOpen, profileId }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ClimbAdjustmentValuesFromForm>({ resolver: zodResolver(schema) });

  const mutation = useEditClimbData(profileId);

  useEffect(() => {
    if (isOpen) {
      reset({
        take_off_taxi_fuel_gallons: data.take_off_taxi_fuel_gallons,
        percent_increase_climb_temperature_c:
          data.percent_increase_climb_temperature_c,
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
      take_off_taxi_fuel_gallons: data.take_off_taxi_fuel_gallons,
      percent_increase_climb_temperature_c:
        data.percent_increase_climb_temperature_c,
    });
  };

  return (
    <HtmlForm onSubmit={handleSubmit(submitHandler)}>
      <h1>
        <div>
          <EditIcon />
          <ClimbIcon />
          Edit Climb Performance Adjustment Values
        </div>
        <CloseIcon onClick={closeModal} />
      </h1>
      <HtmlInputContainer>
        <ul>
          <li>
            The Ground Fuel, is the gallons of fuel allowed for ground
            operations. That is, engine start, taxi, warmup and takeoff.
          </li>
          <li>
            The Temperature Losses, is the percentage by which the time,
            distance and fuel to climb, will be increased for every &deg;C of
            air temperature above standard.
          </li>
        </ul>
        <HtmlInput
          $required={false}
          $hasValue={
            !!watch('take_off_taxi_fuel_gallons') ||
            watch('take_off_taxi_fuel_gallons') === 0
          }
          $accepted={!errors.take_off_taxi_fuel_gallons}
        >
          <input
            {...register('take_off_taxi_fuel_gallons', {
              setValueAs: handleNullableNumberValue,
            })}
            id="take_off_taxi_fuel_gallons"
            type="number"
            step="any"
            autoComplete="off"
          />
          {errors.take_off_taxi_fuel_gallons ? (
            <p>{errors.take_off_taxi_fuel_gallons.message}</p>
          ) : (
            <p>&nbsp;</p>
          )}
          <label htmlFor="take_off_taxi_fuel_gallons">
            <FuelIcon />
            {'Ground Fuel [gal]'}
          </label>
        </HtmlInput>
        <HtmlInput
          $required={false}
          $hasValue={
            !!watch('percent_increase_climb_temperature_c') ||
            watch('percent_increase_climb_temperature_c') === 0
          }
          $accepted={!errors.percent_increase_climb_temperature_c}
        >
          <input
            {...register('percent_increase_climb_temperature_c', {
              setValueAs: handleNullableNumberValue,
            })}
            id="percent_increase_climb_temperature_c"
            type="number"
            step="any"
            autoComplete="off"
          />
          {errors.percent_increase_climb_temperature_c ? (
            <p>{errors.percent_increase_climb_temperature_c.message}</p>
          ) : (
            <p>&nbsp;</p>
          )}
          <label htmlFor="percent_increase_climb_temperature_c">
            <TemperatureIcon />
            {'Temperature Losses [% per \u00B0C]'}
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

export default EditClimbDataForm;
