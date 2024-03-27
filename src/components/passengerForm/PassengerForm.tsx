import { useEffect } from 'react';
import { AiOutlineSave } from 'react-icons/ai';
import { FaUser, FaWeightScale } from 'react-icons/fa6';
import { BsPersonFillAdd, BsPersonFillGear } from 'react-icons/bs';
import { LiaTimesSolid } from 'react-icons/lia';
import { useForm, FieldValues } from 'react-hook-form';
import { styled } from 'styled-components';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import Button from '../common/button';
import useEditPassenger from './useEditPassenger';
import type { ReactIconType } from '../../services/reactIconEntity';

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

const SaveIcon = styled(AiOutlineSave as ReactIconType)`
  font-size: 25px;
`;

const NameIcon = styled(FaUser as ReactIconType)`
  font-size: 25px;
  margin: 0 10px;
`;

const WeightIcon = styled(FaWeightScale as ReactIconType)`
  font-size: 25px;
  margin: 0 10px;
`;

const AddPassengerIcon = styled(BsPersonFillAdd as ReactIconType)`
  flex-shrink: 0;
  font-size: 30px;
  margin: 0 10px;
`;

const EditPassengerIcon = styled(BsPersonFillGear as ReactIconType)`
flex-shrink: 0;
  font-size: 30px;
  margin: 0 10px;
  }
`;

const CloseIcon = styled(LiaTimesSolid as ReactIconType)`
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

const schema = z.object({
  name: z
    .string()
    .min(2, { message: 'Must be at least 2 characters long' })
    .max(255, { message: 'Must be at most 255 characters long' })
    .regex(/^[A-Za-z0-9 /.'-]+$/, {
      message: "Only letters, numbers, spaces and symbols /'.-",
    }),
  weight_lb: z
    .number({ invalid_type_error: 'Enter a number' })
    .nonnegative('Must be greater than or equal to 0')
    .max(999.94, { message: 'Must be less than 999.95' }),
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
    watch,
  } = useForm<FormDataType>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: passengerData.name,
        weight_lb: passengerData.weight_lb,
      });
    }
  }, [isOpen, passengerData.name, passengerData.weight_lb, reset]);

  const editPassengerMutation = useEditPassenger();

  const handleCancel = () => {
    closeModal();
  };

  const submitHandler = (data: FieldValues) => {
    closeModal();
    editPassengerMutation.mutate({
      name: data.name as string,
      weight_lb: data.weight_lb as number,
      id: passengerData.id,
    });
  };

  return (
    <HtmlForm onSubmit={handleSubmit(submitHandler) as () => void}>
      <h1>
        <div>
          {passengerData.id !== 0 ? (
            <EditPassengerIcon />
          ) : (
            <AddPassengerIcon />
          )}
          {`${passengerData.id !== 0 ? 'Edit' : 'Add'} Passenger`}
        </div>
        <CloseIcon onClick={handleCancel} />
      </h1>
      <HtmlInputContainer>
        <HtmlInput
          $hasValue={!!watch('name')}
          $accepted={!errors.name}
          $required={true}
        >
          <input
            {...register('name')}
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
        <HtmlInput
          $hasValue={!!watch('weight_lb') || watch('weight_lb') === 0}
          $accepted={!errors.weight_lb}
          $required={true}
        >
          <input
            {...register('weight_lb', { valueAsNumber: true })}
            id="passenger_weight_lb"
            step="any"
            type="number"
            autoComplete="off"
            required={true}
          />
          {errors.weight_lb ? <p>{errors.weight_lb.message}</p> : <p>&nbsp;</p>}
          <label htmlFor="passenger_weight_lb">
            <WeightIcon />
            {'Weight [lb]'}
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
