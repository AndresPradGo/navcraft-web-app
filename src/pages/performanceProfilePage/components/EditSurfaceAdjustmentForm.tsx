import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useForm, FieldValues } from 'react-hook-form';
import { AiOutlineSave } from 'react-icons/ai';
import { GiConcreteBag } from 'react-icons/gi';
import { ImRoad } from 'react-icons/im';
import { LiaTimesSolid } from 'react-icons/lia';
import { LuPercent } from 'react-icons/lu';
import { styled } from 'styled-components';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import Button from '../../../components/common/button';
import { RunwaySurfaceData } from '../../../hooks/useRunwaySurfaces';
import DataList from '../../../components/common/datalist/index';
import useEditSurfaceAdjustmentData from '../hooks/useEditSurfaceAdjustmentData';

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
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
  padding: 20px 0;

  & p:first-of-type {
    margin: 20px;
    text-wrap: wrap;
  }

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
    font-size: 18px;
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
  max-height: 65px;
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

const TitleIcon = styled(ImRoad)`
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

const SurfaceIcon = styled(GiConcreteBag)`
  font-size: 25px;
  margin: 0 10px;
`;

const PercentIcon = styled(LuPercent)`
  font-size: 25px;
  margin: 0 10px;
`;

const schema = z.object({
  surface: z
    .string()
    .min(2, { message: 'Must be at least 2 characters long' })
    .max(50, { message: 'Must be at most 50 characters long' })
    .regex(/^[-a-zA-Z ']+$/, {
      message: "Only letters, spaces and symbols ' -",
    }),
  percent: z
    .number({ invalid_type_error: 'Enter a number' })
    .max(99.94, { message: 'Must be less than 99.95' })
    .min(0, { message: 'Must be greater than zero' }),
});

type FormDataType = z.infer<typeof schema>;

interface Props {
  closeModal: () => void;
  isOpen: boolean;
  profileId: number;
  surface_id: number;
  percent: number;
  isTakeoff: boolean;
}

const EditSurfaceAdjustmentForm = ({
  closeModal,
  isOpen,
  profileId,
  isTakeoff,
  surface_id,
  percent,
}: Props) => {
  const queryClient = useQueryClient();
  const surfaces = queryClient.getQueryData<RunwaySurfaceData[]>([
    'runwaySurface',
  ]);

  const mutation = useEditSurfaceAdjustmentData(profileId, isTakeoff);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setError,
    clearErrors,
    setValue,
  } = useForm<FormDataType>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (isOpen) {
      reset({
        surface: surfaces?.find((s) => s.id === surface_id)?.surface || '',
        percent: percent,
      });
    }
  }, [isOpen]);

  const submitHandler = (data: FieldValues) => {
    closeModal();
    mutation.mutate({
      surface_id: surfaces?.find((s) => s.surface === data.surface)?.id || -1,
      percent: data.percent,
    });
  };

  return (
    <HtmlForm onSubmit={handleSubmit(submitHandler)}>
      <h1>
        <div>
          <TitleIcon />
          {`Edit ${isTakeoff ? 'Takeoff' : 'Landing'} Surface Adjustments`}
        </div>
        <CloseIcon onClick={closeModal} />
      </h1>
      <HtmlInputContainer>
        <p>
          {`This is the percentage of the ground roll, by which the ${
            isTakeoff ? 'takeoff' : 'landing'
          } distance will be increased, for a given runway surface.`}
        </p>
        <DataList
          setError={(message) =>
            setError('surface', {
              type: 'manual',
              message: message,
            })
          }
          clearErrors={() => clearErrors('surface')}
          required={true}
          value={watch('surface')}
          hasError={!!errors.surface}
          errorMessage={errors.surface?.message || ''}
          options={surfaces ? surfaces.map((item) => item.surface) : []}
          setValue={(value: string) => setValue('surface', value)}
          name={`${isTakeoff ? 'takeoff' : 'landing'}-surface`}
          formIsOpen={isOpen}
          resetValue={surfaces?.find((s) => s.id === surface_id)?.surface || ''}
        >
          <SurfaceIcon /> Surface
        </DataList>
        <HtmlInput
          $required={true}
          $hasValue={!!watch('percent') || watch('percent') === 0}
          $accepted={!errors.percent}
        >
          <input
            {...register('percent', {
              valueAsNumber: true,
            })}
            id={`${isTakeoff ? 'takeoff' : 'landing'}-percent`}
            step="any"
            type="number"
            autoComplete="off"
          />
          {errors.percent ? <p>{errors.percent.message}</p> : <p>&nbsp;</p>}
          <label htmlFor={`${isTakeoff ? 'takeoff' : 'landing'}-percent`}>
            <PercentIcon />
            {'of Ground Roll'}
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

export default EditSurfaceAdjustmentForm;
