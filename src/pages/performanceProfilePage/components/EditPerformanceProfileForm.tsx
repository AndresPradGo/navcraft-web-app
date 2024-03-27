import { useEffect } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import { AiOutlineSave, AiFillTag } from 'react-icons/ai';
import { BsFillFuelPumpFill, BsSpeedometer } from 'react-icons/bs';
import { LiaTimesSolid } from 'react-icons/lia';
import { styled } from 'styled-components';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import Button from '../../../components/common/button';
import { FuelTypeData } from '../../../hooks/useFuelTypes';
import DataList from '../../../components/common/datalist';
import { useQueryClient } from '@tanstack/react-query';
import useEditPerformanceProfile from '../hooks/useEditPerformanceProfile';

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

const HtmlInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
  padding: 20px 0;
  flex-grow: 1;

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
  padding: 10px 10px 0;

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

  @media screen and (min-width: 425px) {
    padding: 10px 20px 0;
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

const TitleIcon = styled(BsSpeedometer)`
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

const NameIcon = styled(AiFillTag)`
  font-size: 20px;
  margin: 0 5px 0 10px;
`;

const FuelIcon = styled(BsFillFuelPumpFill)`
  font-size: 20px;
  margin: 0 10px;
`;

const SaveIcon = styled(AiOutlineSave)`
  font-size: 25px;
`;

const schema = z.object({
  performance_profile_name: z
    .string()
    .min(2, { message: 'Must be at least 2 characters long' })
    .max(255, { message: 'Must be at most 255 characters long' })
    .regex(/^[a-zA-Z0-9\s.,()/\-]+$/, {
      message: 'Only letters, numbers, white space, and symbols .,-()/',
    }),
  fuel_type: z
    .string()
    .min(1, { message: 'Select a valid option' })
    .max(50, { message: 'Must be at most 50 characters long' })
    .regex(/^[-a-zA-Z0-9 /]+$/, {
      message: 'Only letters, numbers, white spaces, and symbols -/',
    }),
});
type AircraftProfileDataFromForm = z.infer<typeof schema>;

interface Props {
  closeModal: () => void;
  isOpen: boolean;
  aircraftId: number;
  profileName: string;
  fuelType: string;
  profileId: number;
}

const EditPerformanceProfileForm = ({
  closeModal,
  isOpen,
  aircraftId,
  profileName,
  fuelType,
  profileId,
}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    watch,
    setValue,
    clearErrors,
  } = useForm<AircraftProfileDataFromForm>({ resolver: zodResolver(schema) });

  const mutation = useEditPerformanceProfile(aircraftId);

  const queryClient = useQueryClient();
  const fuelOptions = queryClient.getQueryData<FuelTypeData[]>(['fuelTypes']);

  useEffect(() => {
    if (isOpen) {
      reset({
        performance_profile_name: profileName,
        fuel_type: fuelType,
      });
    }
  }, [isOpen]);

  const submitHandler = (data: FieldValues) => {
    const fuelId = fuelOptions?.find(
      (item) => item.name === data.fuel_type,
    )?.id;
    if (fuelId) {
      closeModal();
      mutation.mutate({
        id: profileId,
        performance_profile_name: data.performance_profile_name,
        fuel_type_id: fuelId,
      });
    } else
      setError('fuel_type', {
        type: 'manual',
        message: 'Select a valid fuel type',
      });
  };

  return (
    <HtmlForm onSubmit={handleSubmit(submitHandler)}>
      <h1>
        <div>
          <TitleIcon />
          Edit Performance Profile
        </div>
        <CloseIcon onClick={closeModal} />
      </h1>
      <HtmlInputContainer>
        <DataList
          setError={(message) =>
            setError('fuel_type', {
              type: 'manual',
              message: message,
            })
          }
          clearErrors={() => clearErrors('fuel_type')}
          required={true}
          value={watch('fuel_type')}
          hasError={!!errors.fuel_type}
          errorMessage={errors.fuel_type?.message || ''}
          options={fuelOptions ? fuelOptions.map((item) => item.name) : []}
          setValue={(value: string) => setValue('fuel_type', value)}
          name="fuel_type"
          formIsOpen={isOpen}
          resetValue={fuelType}
          lessPadding={true}
        >
          <FuelIcon /> Fuel
        </DataList>
        <HtmlInput
          $required={true}
          $hasValue={!!watch('performance_profile_name')}
          $accepted={!errors.performance_profile_name}
        >
          <input
            {...register('performance_profile_name')}
            id="performance_profile_name"
            type="text"
            autoComplete="off"
            required={true}
          />
          {errors.performance_profile_name ? (
            <p>{errors.performance_profile_name.message}</p>
          ) : (
            <p>&nbsp;</p>
          )}
          <label htmlFor="performance_profile_name">
            <NameIcon />
            Descriptive Name
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

export default EditPerformanceProfileForm;
