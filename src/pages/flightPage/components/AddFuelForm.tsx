import { useEffect, useState, useCallback } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import { AiOutlineSave } from 'react-icons/ai';
import { BsFillFuelPumpFill } from 'react-icons/bs';
import { LiaTimesSolid } from 'react-icons/lia';
import { PiGasCanDuotone } from 'react-icons/pi';
import { styled } from 'styled-components';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import Button from '../../../components/common/button';
import useAddFuel from '../hooks/useAddFuel';
import Loader from '../../../components/Loader';

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
    cursor: ${(props) => (props.$hasValue ? 'default' : 'text')};
    position: absolute;
    top: 0;
    left: 0;
    font-size: 20px;
    display: flex;
    align-items: center;
    transform: ${(props) =>
      props.$hasValue
        ? 'translate(7px, 7px) scale(0.8)'
        : 'translate(17px, 47px)'};
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
  flex-shrink: 0;
`;

const TitleIcon = styled(BsFillFuelPumpFill)`
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
  cursor: ${(props) => (props.$disabled ? 'default' : 'pointer')};
  color: var(--color-grey);
  opacity: ${(props) => (props.$disabled ? '0.3' : '1')};

  &:hover,
  &:focus {
    color: ${(props) =>
      props.$disabled ? 'var(--color-grey)' : 'var(--color-white)'};
  }

  @media screen and (min-width: 510px) {
    margin: 0 10px;
    font-size: 30px;
  }
`;

const GallonsIcon = styled(PiGasCanDuotone)`
  font-size: 25px;
  margin: 0 5px 0 10px;
`;

const schema = z.object({
  gallons: z
    .number({ invalid_type_error: 'Enter a number' })
    .min(0, { message: 'Must be a positive number' }),
});
type FormDataType = z.infer<typeof schema>;

export interface FuelDataFromForm extends FormDataType {
  id: number;
}

interface Props {
  flightId: number;
  fuelData: FuelDataFromForm;
  tank: string;
  usableCapacity: number;
  closeModal: () => void;
  isOpen: boolean;
}

const AddFuelForm = ({
  flightId,
  fuelData,
  tank,
  usableCapacity,
  closeModal,
  isOpen,
}: Props) => {
  const [submited, setSubmited] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
    watch,
  } = useForm<FormDataType>({ resolver: zodResolver(schema) });

  const mutation = useAddFuel(flightId);

  useEffect(() => {
    if (isOpen) {
      reset({
        gallons: fuelData.gallons,
      });
    }
  }, [isOpen, fuelData.gallons, reset]);

  useEffect(() => {
    if (submited && !mutation.isLoading) {
      closeModal();
    }
  }, [submited, mutation.isLoading, closeModal]);

  const checkWithinCapacity = useCallback(
    (gallons: number): boolean => {
      if (gallons > usableCapacity) {
        setError('gallons', {
          type: 'manual',
          message: `Maximum usable capacity is ${usableCapacity} gallons`,
        });
        return false;
      } else {
        clearErrors('gallons');
        return true;
      }
    },
    [clearErrors, setError, usableCapacity],
  );

  const watchedGallons = watch('gallons');
  useEffect(() => {
    checkWithinCapacity(watch('gallons'));
  }, [watchedGallons, checkWithinCapacity, watch]);

  const submitHandler = (data: FieldValues) => {
    const isWithinCapacity = checkWithinCapacity(data.gallons as number);
    if (isWithinCapacity) {
      mutation.mutate({
        id: fuelData.id,
        gallons: data.gallons as number,
      });
      setSubmited(true);
    }
  };

  return (
    <HtmlForm onSubmit={handleSubmit(submitHandler) as () => void}>
      <h1>
        <div>
          <TitleIcon />
          {`${tank} Fuel`}
        </div>
        {mutation.isLoading ? (
          <CloseIcon onClick={() => {}} $disabled={true} />
        ) : (
          <CloseIcon onClick={closeModal} $disabled={false} />
        )}
      </h1>
      <HtmlInputContainer>
        {mutation.isLoading ? (
          <Loader message="Calculating flight data . . ." />
        ) : (
          <HtmlInput
            $required={true}
            $hasValue={!!watch('gallons') || watch('gallons') === 0}
            $accepted={!errors.gallons}
          >
            <input
              {...register('gallons', { valueAsNumber: true })}
              id={`${fuelData.id}-fuel`}
              type="number"
              autoComplete="off"
            />
            {errors.gallons ? <p>{errors.gallons.message}</p> : <p>&nbsp;</p>}
            <label htmlFor={`${fuelData.id}-fuel`}>
              <GallonsIcon />
              {'Gallons'}
            </label>
          </HtmlInput>
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
          disabled={mutation.isLoading}
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

export default AddFuelForm;
