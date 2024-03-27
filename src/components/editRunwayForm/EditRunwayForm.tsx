import { useEffect, useCallback } from 'react';
import { AiOutlineFieldNumber, AiOutlineSave } from 'react-icons/ai';
import { BsSignIntersectionSide } from 'react-icons/bs';
import { CgMoveUp } from 'react-icons/cg';
import { FaLinesLeaning } from 'react-icons/fa6';
import { GiConcreteBag } from 'react-icons/gi';
import { LiaTimesSolid } from 'react-icons/lia';
import { MdAddRoad, MdEditRoad } from 'react-icons/md';
import { PiAirTrafficControlDuotone } from 'react-icons/pi';
import { TfiRuler } from 'react-icons/tfi';
import { styled } from 'styled-components';
import { useForm, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import Button from '../common/button';
import DataList from '../common/datalist';
import useRunwaySurfaces from '../../hooks/useRunwaySurfaces';
import Loader from '../Loader';
import useEditRunway from './useEditRunway';
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
    }

    @media screen and (min-width: 425px) {
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

  & h2 {
    margin: 20px;
    border-bottom: 1px solid var(--color-grey-bright);
    display: flex;
    align-items: center;
    text-wrap: wrap;
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

const AerodromeIcon = styled(PiAirTrafficControlDuotone as ReactIconType)`
  font-size: 35px;
  margin: 0 10px;
  flex-shrink: 0;
`;

const NumberIcon = styled(AiOutlineFieldNumber as ReactIconType)`
  font-size: 25px;
  margin: 0 10px;
`;

const PositionIcon = styled(FaLinesLeaning as ReactIconType)`
  font-size: 25px;
  margin: 0 10px;
`;

const LengthIcon = styled(TfiRuler as ReactIconType)`
  font-size: 25px;
  margin: 0 10px;
`;

const DisplacementIcon = styled(CgMoveUp as ReactIconType)`
  font-size: 30px;
  margin: 0 10px;
`;

const IntersectionIcon = styled(BsSignIntersectionSide as ReactIconType)`
  font-size: 25px;
  margin: 0 10px;
`;

const SurfaceIcon = styled(GiConcreteBag as ReactIconType)`
  font-size: 25px;
  margin: 0 10px;
`;

const SaveIcon = styled(AiOutlineSave as ReactIconType)`
  font-size: 25px;
`;

const AddRunwayIcon = styled(MdAddRoad as ReactIconType)`
  font-size: 35px;
  margin: 0 5px;

  @media screen and (min-width: 425px) {
    margin: 0 10px;
    font-size: 40px;
  }
`;

const EditRunwayIcon = styled(MdEditRoad as ReactIconType)`
  font-size: 35px;
  margin: 0 5px;

  @media screen and (min-width: 425px) {
    margin: 0 10px;
    font-size: 40px;
  }
`;

const CloseIcon = styled(LiaTimesSolid as ReactIconType)`
  font-size: 25px;
  margin: 0 5px;
  cursor: pointer;
  color: var(--color-grey);

  &:hover,
  &:focus {
    color: var(--color-white);
  }

  @media screen and (min-width: 425px) {
    margin: 0 10px;
    font-size: 30px;
  }
`;

const schema = z.object({
  number: z
    .number({ invalid_type_error: 'Enter valid runway number' })
    .int('Enter valid runway number')
    .min(1, 'Enter valid runway number')
    .max(36, 'Enter valid runway number'),
  position: z.union([z.string().nullable(), z.literal(null)]),
  length_ft: z
    .number({ invalid_type_error: 'Enter round number' })
    .int('Round Numbers only'),
  thld_displ: z.union([
    z
      .number({ invalid_type_error: 'Round Numbers only' })
      .int('Round Numbers only')
      .nullable(),
    z.literal(null),
  ]),
  intersection_departure_length_ft: z.union([
    z
      .number({ invalid_type_error: 'Round Numbers only' })
      .int('Round Numbers only')
      .nullable(),
    z.literal(null),
  ]),
  surface: z
    .string()
    .min(2, { message: 'Must be at least 2 characters long' })
    .max(50, { message: 'Must be at most 50 characters long' })
    .regex(/^[-a-zA-Z ']+$/, {
      message: "Only letters, spaces and symbols ' -",
    }),
});
type FormDataType = z.infer<typeof schema>;

export interface RunwayDataType extends FormDataType {
  id: number;
  aerodromeId: number;
}

interface Props {
  runwayData: RunwayDataType;
  closeModal: () => void;
  isOpen: boolean;
  aerodromeName: string;
  fromAerodrome: boolean;
}

const EditRunwayForm = ({
  runwayData,
  closeModal,
  isOpen,
  aerodromeName,
  fromAerodrome,
}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    watch,
    clearErrors,
    setValue,
  } = useForm<FormDataType>({ resolver: zodResolver(schema) });
  const { data: surfaces, isLoading } = useRunwaySurfaces();
  const mutation = useEditRunway(fromAerodrome);

  useEffect(() => {
    register('position');
    register('surface');
  }, [register]);

  useEffect(() => {
    if (isOpen) {
      reset({
        number: runwayData.number,
        position: runwayData.position,
        length_ft: runwayData.length_ft,
        thld_displ: runwayData.thld_displ,
        intersection_departure_length_ft:
          runwayData.intersection_departure_length_ft,
        surface: runwayData.surface,
      });
    }
  }, [
    isOpen,
    runwayData.number,
    runwayData.position,
    runwayData.length_ft,
    runwayData.thld_displ,
    runwayData.intersection_departure_length_ft,
    runwayData.surface,
    reset,
  ]);

  const checkIntersectionDeparture = useCallback(
    (data: FieldValues): boolean => {
      const errorMessage =
        'Threshold displacement must be less than runway length';

      if (errors.intersection_departure_length_ft)
        if (errors.intersection_departure_length_ft.message !== errorMessage)
          return true;
      if ((data.intersection_departure_length_ft || 1) >= data.length_ft) {
        setError('intersection_departure_length_ft', {
          type: 'manual',
          message: errorMessage,
        });
        return true;
      }
      return false;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setError],
  );

  const intersecDepartWatch = watch('intersection_departure_length_ft');
  const lengthWatch = watch('length_ft');
  useEffect(() => {
    const wrongIntxnDep = checkIntersectionDeparture({
      intersection_departure_length_ft: watch(
        'intersection_departure_length_ft',
      ),
      length_ft: watch('length_ft'),
    });
    if (!wrongIntxnDep) clearErrors('intersection_departure_length_ft');
  }, [
    intersecDepartWatch,
    lengthWatch,
    clearErrors,
    watch,
    checkIntersectionDeparture,
  ]);

  const checkThresholdDisplacement = useCallback(
    (data: FieldValues): boolean => {
      const errorMessage =
        'Threshold displacement must be less than runway length';

      if (errors.thld_displ)
        if (errors.thld_displ.message !== errorMessage) return true;

      if ((data.thld_displ || 1) >= data.length_ft) {
        setError('thld_displ', {
          type: 'manual',
          message: errorMessage,
        });
        return true;
      }
      return false;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setError],
  );

  const thldDispl = watch('thld_displ');
  useEffect(() => {
    const wrongThldDispl = checkThresholdDisplacement({
      thld_displ: watch('thld_displ'),
      length_ft: watch('length_ft'),
    });
    if (!wrongThldDispl) clearErrors('thld_displ');
  }, [thldDispl, lengthWatch, clearErrors, watch, checkThresholdDisplacement]);

  const handleOptionalLengthValues = (value: string): number | null => {
    if (Number.isNaN(parseFloat(value))) return null;
    return parseFloat(value);
  };

  const handleCancel = () => {
    closeModal();
  };

  const submitHandler = (data: FieldValues) => {
    const wrongThldDispl = checkThresholdDisplacement(data);
    const wrongIntxnDep = checkIntersectionDeparture(data);
    const surface_id = surfaces?.find(
      (item) => item.surface === data.surface,
    )?.id;

    if (!surface_id) {
      setError('surface', {
        type: 'manual',
        message: 'Select a valid option',
      });
    }

    if (!wrongThldDispl && !wrongIntxnDep && surface_id) {
      closeModal();
      const pos = data.position as string;
      mutation.mutate({
        id: runwayData.id,
        aerodrome_id: runwayData.aerodromeId,
        number: data.number as number,
        position:
          pos === 'Right'
            ? 'R'
            : pos === 'Left'
              ? 'L'
              : pos === 'Center'
                ? 'C'
                : undefined,
        length_ft: data.length_ft as number,
        landing_length_ft: data.thld_displ
          ? data.length_ft - data.thld_displ
          : undefined,
        intersection_departure_length_ft:
          data.intersection_departure_length_ft as number,
        surface: data.surface as string,
        surface_id: surface_id,
      });
    }
  };

  return (
    <HtmlForm onSubmit={handleSubmit(submitHandler) as () => void}>
      <h1>
        <div>
          {runwayData.id !== 0 ? <EditRunwayIcon /> : <AddRunwayIcon />}
          {`${runwayData.id !== 0 ? 'Edit' : 'Add'} Runway`}
        </div>
        <CloseIcon onClick={handleCancel} />
      </h1>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <HtmlInputContainer>
            <h2>
              <AerodromeIcon />
              {aerodromeName}
            </h2>
            <HtmlInput
              $hasValue={!!watch('number') || watch('number') === 0}
              $accepted={!errors.number}
              $required={true}
            >
              <input
                {...register('number', { valueAsNumber: true })}
                id="runway_number"
                type="number"
                autoComplete="off"
                required={true}
              />
              {errors.number ? <p>{errors.number.message}</p> : <p>&nbsp;</p>}
              <label htmlFor="runway_number">
                <NumberIcon />
                Runway Number
              </label>
            </HtmlInput>
            <DataList
              setError={(message) =>
                setError('position', {
                  type: 'manual',
                  message: message,
                })
              }
              clearErrors={() => clearErrors('position')}
              required={false}
              value={watch('position') || ''}
              hasError={!!errors.position}
              errorMessage={errors.position?.message || ''}
              options={['Right', 'Left', 'Center']}
              setValue={(value: string) => setValue('position', value)}
              name="runway_position"
              formIsOpen={isOpen}
              resetValue={runwayData.position ? runwayData.position : ''}
            >
              <PositionIcon /> Parallel Position
            </DataList>
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
              name="runway_surface"
              formIsOpen={isOpen}
              resetValue={runwayData.surface ? runwayData.surface : ''}
            >
              <SurfaceIcon /> Surface
            </DataList>
            <HtmlInput
              $hasValue={!!watch('length_ft') || watch('length_ft') === 0}
              $accepted={!errors.length_ft}
              $required={true}
            >
              <input
                {...register('length_ft', { valueAsNumber: true })}
                id="runway_length_ft"
                type="number"
                autoComplete="off"
                required={true}
              />
              {errors.length_ft ? (
                <p>{errors.length_ft.message}</p>
              ) : (
                <p>&nbsp;</p>
              )}
              <label htmlFor="runway_length_ft">
                <LengthIcon />
                {'Length [ft]'}
              </label>
            </HtmlInput>
            <HtmlInput
              $required={false}
              $hasValue={!!watch('thld_displ') || watch('thld_displ') === 0}
              $accepted={!errors.thld_displ}
            >
              <input
                {...register('thld_displ', {
                  setValueAs: handleOptionalLengthValues,
                })}
                id="runway_thld_displ"
                type="number"
                autoComplete="off"
              />
              {errors.thld_displ ? (
                <p>{errors.thld_displ.message}</p>
              ) : (
                <p>&nbsp;</p>
              )}
              <label htmlFor="runway_thld_displ">
                <DisplacementIcon />
                {'Thld Displ [ft]'}
              </label>
            </HtmlInput>
            <HtmlInput
              $required={false}
              $hasValue={
                !!watch('intersection_departure_length_ft') ||
                watch('intersection_departure_length_ft') === 0
              }
              $accepted={!errors.intersection_departure_length_ft}
            >
              <input
                {...register('intersection_departure_length_ft', {
                  setValueAs: handleOptionalLengthValues,
                })}
                id="runway_intersection_departure_length_ft"
                type="number"
                autoComplete="off"
              />
              {errors.intersection_departure_length_ft ? (
                <p>{errors.intersection_departure_length_ft.message}</p>
              ) : (
                <p>&nbsp;</p>
              )}
              <label htmlFor="runway_intersection_departure_length_ft">
                <IntersectionIcon />
                {'Intxn Dep [ft]'}
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
        </>
      )}
    </HtmlForm>
  );
};

export default EditRunwayForm;
