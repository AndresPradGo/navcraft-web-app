import { useEffect, useCallback } from 'react';
import { AiOutlineSave } from 'react-icons/ai';
import { BiHide } from 'react-icons/bi';
import { LiaMapSignsSolid, LiaTimesSolid } from 'react-icons/lia';
import { ImCompass2 } from 'react-icons/im';
import {
  TbMapPinCog,
  TbMapPinPlus,
  TbMapSearch,
  TbWorldLatitude,
  TbWorldLongitude,
} from 'react-icons/tb';
import { useForm, FieldValues } from 'react-hook-form';
import { styled } from 'styled-components';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import Button from '../common/button';
import useEditVfrWaypoint from './useEditVfrWaypoint';
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
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
  padding: 20px 0;

  border-top: 1px solid var(--color-grey);
  border-bottom: 1px solid var(--color-grey);
`;

const HtmlInputGroup = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 40px 20px 0;

  & h2 {
    border-bottom: 1px solid var(--color-grey-bright);
    width: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    font-size: 20px;

    @media screen and (min-width: 510px) {
      font-size: 27px;
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

const HtmlSelectElement = styled.select`
  cursor: pointer;
  position: relative;
  appearance: none;
  width: 100%;
  padding: 10px 20px;
  margin: 0;
  margin-top: 20px;
  border-radius: 5px;
  background-color: var(--color-grey-dark);
  outline: none;
  border: 1px solid var(--color-grey);
  color: var(--color-grey-bright);
  font-size: 20px;

  &:focus {
    border: 1px solid var(--color-white);
  }

  & option {
    cursor: pointer;
  }
`;

const HtmlCheckbox = styled.label`
  width: 290px;
  align-self: center;
  display: flex;
  min-width: 0;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  transition: all 0.2s linear;

  color: var(--color-grey-bright);
  padding: 10px;
  cursor: pointer;
  flex-grow: 0;

  &:hover,
  &:focus {
    background-color: var(--color-primary);
  }

  &[for='hide-waypoint'] {
    color: var(--color-contrast);
  }

  & input[type='checkbox'] {
    cursor: pointer;
    margin: 0;
    min-height: 20px;
    min-width: 20px;
    transition: all 0.2s linear;
  }

  & span {
    display: flex;
    align-items: center;
    text-align: left;
    cursor: pointer;
    margin-left: 5px;
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

const CodeIcon = styled(TbMapSearch as ReactIconType)`
  font-size: 25px;
  margin: 0 10px;
`;

const NameIcon = styled(LiaMapSignsSolid as ReactIconType)`
  font-size: 25px;
  margin: 0 10px;
`;

const LatitudeIcon = styled(TbWorldLatitude as ReactIconType)`
  font-size: 25px;
  margin: 0 10px;
`;

const LongitudeIcon = styled(TbWorldLongitude as ReactIconType)`
  font-size: 25px;
  margin: 0 10px;
`;

const CompassIcon = styled(ImCompass2 as ReactIconType)`
  font-size: 25px;
  margin: 0 10px;
`;

const HideIcon = styled(BiHide as ReactIconType)`
  font-size: 25px;
  margin: 0 10px;
`;

const EditWaypointIcon = styled(TbMapPinCog as ReactIconType)`
  flex-shrink: 0;
  font-size: 25px;
  margin: 0 10px;

  @media screen and (min-width: 510px) {
    font-size: 30px;
  }
`;

const AddWaypointIcon = styled(TbMapPinPlus as ReactIconType)`
  flex-shrink: 0;
  font-size: 25px;
  margin: 0 10px;

  @media screen and (min-width: 510px) {
    font-size: 30px;
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
  code: z
    .string()
    .min(2, { message: 'Must be at least 2 characters long' })
    .max(12, { message: 'Must be at most 12 characters long' })
    .regex(/^[-A-Za-z0-9']+$/, {
      message: "Only letters, numbers and symbols -'",
    }),
  name: z
    .string()
    .min(2, { message: 'Must be at least 2 characters long' })
    .max(50, { message: 'Must be at most 50 characters long' }),
  lat_degrees: z
    .number({ invalid_type_error: 'Enter a number' })
    .int('Coordinates must be round numbers')
    .min(0, `Latitude must be between S 89° 59' 59" and N 89° 59' 59"`)
    .max(89, `Latitude must be between S89° 59' 59" and N 89° 59' 59"`),
  lat_minutes: z
    .number({ invalid_type_error: 'Enter a number' })
    .int('Coordinates must be round numbers')
    .min(0, 'Minutes must be bewteen 0 and 59')
    .max(59, 'Minutes must be bewteen 0 and 59'),
  lat_seconds: z
    .number({ invalid_type_error: 'Enter a number' })
    .int('Coordinates must be round numbers')
    .min(0, 'Seconds must be bewteen 0 and 59')
    .max(59, 'Seconds must be bewteen 0 and 59'),
  lat_direction: z.enum(['North', 'South']),
  lon_degrees: z
    .number({ invalid_type_error: 'Enter a number' })
    .int('Coordinates must be round numbers')
    .min(0, `Longitude must be between W 179° 59' 59" and E 180° 0' 0"`)
    .max(180, `Longitude must be between W 179° 59' 59" and E 180° 0' 0"`),
  lon_minutes: z
    .number({ invalid_type_error: 'Enter a number' })
    .int('Coordinates must be round numbers')
    .min(0, 'Minutes must be bewteen 0 and 59')
    .max(59, 'Minutes must be bewteen 0 and 59'),
  lon_seconds: z
    .number({ invalid_type_error: 'Enter a number' })
    .int('Coordinates must be round numbers')
    .min(0, 'Seconds must be bewteen 0 and 59')
    .max(59, 'Seconds must be bewteen 0 and 59'),
  lon_direction: z.enum(['East', 'West']),
  magnetic_variation: z.union([
    z
      .number({ invalid_type_error: 'Enter a number' })
      .max(99.94, { message: 'Must be less than 99.95' })
      .min(-99.94, { message: 'Must be greater than -99.95' })
      .nullable(),
    z.literal(null),
  ]),
  hide: z.boolean(),
});
type FormDataType = z.infer<typeof schema>;

export interface WaypointDataFromForm extends FormDataType {
  id: number;
}

interface Props {
  waypointData: WaypointDataFromForm;
  closeModal: () => void;
  isOpen: boolean;
}

const EditVfrWaypointForm = ({ waypointData, closeModal, isOpen }: Props) => {
  const mutation = useEditVfrWaypoint();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    watch,
    clearErrors,
  } = useForm<FormDataType>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (isOpen) {
      reset({
        code: waypointData.code,
        name: waypointData.name,
        lat_degrees: waypointData.lat_degrees,
        lat_minutes: waypointData.lat_minutes,
        lat_seconds: waypointData.lat_seconds,
        lat_direction: waypointData.lat_direction,
        lon_degrees: waypointData.lon_degrees,
        lon_minutes: waypointData.lon_minutes,
        lon_seconds: waypointData.lon_seconds,
        lon_direction: waypointData.lon_direction,
        magnetic_variation: waypointData.magnetic_variation,
        hide: waypointData.hide,
      });
    }
  }, [
    isOpen,
    waypointData.code,
    waypointData.name,
    waypointData.lat_degrees,
    waypointData.lat_minutes,
    waypointData.lat_seconds,
    waypointData.lat_direction,
    waypointData.lon_degrees,
    waypointData.lon_minutes,
    waypointData.lon_seconds,
    waypointData.lon_direction,
    waypointData.magnetic_variation,
    waypointData.hide,
    reset,
  ]);

  const checkCoordinates = useCallback(
    (data: FieldValues) => {
      const { lon_direction, lon_degrees, lon_minutes, lon_seconds } = data;
      if (
        (lon_direction === 'E' &&
          lon_degrees >= 180 &&
          (lon_minutes > 59 || lon_seconds > 59)) ||
        (lon_direction === 'W' && lon_degrees > 179)
      ) {
        setError('lon_degrees', {
          type: 'manual',
          message: `Longitude must be between W 179° 59' 59" and E 180° 0' 0"`,
        });
        return true;
      }
      return false;
    },
    [setError],
  );

  const lonDirWatch = watch('lon_direction');
  const lonDegWatch = watch('lon_degrees');
  const lonMinWatch = watch('lon_minutes');
  const lonSecWatch = watch('lon_seconds');
  useEffect(() => {
    const badData = checkCoordinates({
      lon_direction: watch('lon_direction'),
      lon_degrees: watch('lon_degrees'),
      lon_minutes: watch('lon_minutes'),
      lon_seconds: watch('lon_seconds'),
    });
    if (!badData) clearErrors('lon_degrees');
  }, [
    lonDirWatch,
    lonDegWatch,
    lonMinWatch,
    lonSecWatch,
    clearErrors,
    watch,
    checkCoordinates,
  ]);

  const handleCancel = () => {
    closeModal();
  };

  const handleMagneticVariationValue = (value: string): number | null => {
    if (Number.isNaN(parseFloat(value))) return null;
    return parseFloat(value);
  };

  const submitHandler = (data: FieldValues) => {
    const badData = checkCoordinates(data);
    if (!badData) {
      closeModal();
      mutation.mutate({
        id: waypointData.id,
        code: data.code as string,
        name: data.name as string,
        lat_degrees: data.lat_degrees as number,
        lat_minutes: data.lat_minutes as number,
        lat_seconds: data.lat_seconds as number,
        lat_direction: data.lat_direction as 'North' | 'South',
        lon_degrees: data.lon_degrees as number,
        lon_minutes: data.lon_minutes as number,
        lon_seconds: data.lon_seconds as number,
        lon_direction: data.lon_direction as 'East' | 'West',
        magnetic_variation: data.magnetic_variation as number,
        hide: data.hide as boolean,
      });
    }
  };

  return (
    <HtmlForm onSubmit={handleSubmit(submitHandler) as () => void}>
      <h1>
        <div>
          {waypointData.id !== 0 ? <EditWaypointIcon /> : <AddWaypointIcon />}
          {`${waypointData.id !== 0 ? 'Edit' : 'Add'} VFR Waypoint`}
        </div>
        <CloseIcon onClick={handleCancel} />
      </h1>
      <HtmlInputContainer>
        <HtmlCheckbox htmlFor="hide-waypoint">
          <input {...register('hide')} type="checkbox" id="hide-waypoint" />
          <span>
            <HideIcon />
            Hide Waypoint from Users
          </span>
        </HtmlCheckbox>
        <HtmlInput
          $required={true}
          $hasValue={!!watch('code')}
          $accepted={!errors.code}
        >
          <input
            {...register('code')}
            id="vfr_waypoint_code"
            type="text"
            autoComplete="off"
            required={true}
          />
          {errors.code ? <p>{errors.code.message}</p> : <p>&nbsp;</p>}
          <label htmlFor="vfr_waypoint_code">
            <CodeIcon />
            Code
          </label>
        </HtmlInput>
        <HtmlInput
          $required={true}
          $hasValue={!!watch('name')}
          $accepted={!errors.name}
        >
          <input
            {...register('name')}
            id="vfr_waypoint_name"
            type="text"
            autoComplete="off"
            required={true}
          />
          {errors.name ? <p>{errors.name.message}</p> : <p>&nbsp;</p>}
          <label htmlFor="vfr_waypoint_name">
            <NameIcon />
            Name
          </label>
        </HtmlInput>
        <HtmlInput
          $required={false}
          $hasValue={
            !!watch('magnetic_variation') || watch('magnetic_variation') === 0
          }
          $accepted={!errors.magnetic_variation}
        >
          <input
            {...register('magnetic_variation', {
              setValueAs: handleMagneticVariationValue,
            })}
            id="vfr_waypoint_magnetic_variation"
            step="any"
            type="number"
            autoComplete="off"
          />
          {errors.magnetic_variation ? (
            <p>{errors.magnetic_variation.message}</p>
          ) : (
            <p>&nbsp;</p>
          )}
          <label htmlFor="vfr_waypoint_magnetic_variation">
            <CompassIcon />
            Magnetic Variation
          </label>
        </HtmlInput>
        <HtmlInputGroup>
          <h2>
            <LatitudeIcon />
            Latitude
          </h2>
          <HtmlInput
            $required={true}
            $hasValue={!!watch('lat_direction')}
            $accepted={!errors.lat_direction}
          >
            <HtmlSelectElement
              {...register('lat_direction')}
              id="vfr_waypoint_lat_direction"
              autoComplete="off"
              required={true}
            >
              <option value="North">North</option>
              <option value="South">South</option>
            </HtmlSelectElement>
            {errors.lat_direction ? (
              <p>{errors.lat_direction.message}</p>
            ) : (
              <p>&nbsp;</p>
            )}
          </HtmlInput>
          <HtmlInput
            $required={true}
            $hasValue={!!watch('lat_degrees') || watch('lat_degrees') === 0}
            $accepted={!errors.lat_degrees}
          >
            <input
              {...register('lat_degrees', { valueAsNumber: true })}
              id="vfr_waypoint_lat_degrees"
              type="number"
              autoComplete="off"
              required={true}
            />
            {errors.lat_degrees ? (
              <p>{errors.lat_degrees.message}</p>
            ) : (
              <p>&nbsp;</p>
            )}
            <label htmlFor="vfr_waypoint_lat_degrees">
              <span>Degrees&nbsp;&deg;</span>
            </label>
          </HtmlInput>
          <HtmlInput
            $required={true}
            $hasValue={!!watch('lat_minutes') || watch('lat_minutes') === 0}
            $accepted={!errors.lat_minutes}
          >
            <input
              {...register('lat_minutes', { valueAsNumber: true })}
              id="vfr_waypoint_lat_minutes"
              type="number"
              autoComplete="off"
              required={true}
            />
            {errors.lat_minutes ? (
              <p>{errors.lat_minutes.message}</p>
            ) : (
              <p>&nbsp;</p>
            )}
            <label htmlFor="vfr_waypoint_lat_minutes">
              <span>Minutes&nbsp;'</span>
            </label>
          </HtmlInput>
          <HtmlInput
            $required={true}
            $hasValue={!!watch('lat_seconds') || watch('lat_seconds') === 0}
            $accepted={!errors.lat_seconds}
          >
            <input
              {...register('lat_seconds', { valueAsNumber: true })}
              id="vfr_waypoint_lat_seconds"
              type="number"
              autoComplete="off"
              required={true}
            />
            {errors.lat_seconds ? (
              <p>{errors.lat_seconds.message}</p>
            ) : (
              <p>&nbsp;</p>
            )}
            <label htmlFor="vfr_waypoint_lat_seconds">
              <span>Seconds&nbsp;"</span>
            </label>
          </HtmlInput>
        </HtmlInputGroup>
        <HtmlInputGroup>
          <h2>
            <LongitudeIcon />
            Longitude
          </h2>
          <HtmlInput
            $required={true}
            $hasValue={!!watch('lon_direction')}
            $accepted={!errors.lon_direction}
          >
            <HtmlSelectElement
              {...register('lon_direction')}
              id="vfr_waypoint_lon_direction"
              autoComplete="off"
              required={true}
            >
              <option value="East">East</option>
              <option value="West">West</option>
            </HtmlSelectElement>
            {errors.lon_direction ? (
              <p>{errors.lon_direction.message}</p>
            ) : (
              <p>&nbsp;</p>
            )}
          </HtmlInput>
          <HtmlInput
            $required={true}
            $hasValue={!!watch('lon_degrees') || watch('lon_degrees') === 0}
            $accepted={!errors.lon_degrees}
          >
            <input
              {...register('lon_degrees', { valueAsNumber: true })}
              id="vfr_waypoint_lon_degrees"
              type="number"
              autoComplete="off"
              required={true}
            />
            {errors.lon_degrees ? (
              <p>{errors.lon_degrees.message}</p>
            ) : (
              <p>&nbsp;</p>
            )}
            <label htmlFor="vfr_waypoint_lon_degrees">
              <span>Degrees&nbsp;&deg;</span>
            </label>
          </HtmlInput>
          <HtmlInput
            $required={true}
            $hasValue={!!watch('lon_minutes') || watch('lon_minutes') === 0}
            $accepted={!errors.lon_minutes}
          >
            <input
              {...register('lon_minutes', { valueAsNumber: true })}
              id="vfr_waypoint_lon_minutes"
              type="number"
              autoComplete="off"
              required={true}
            />
            {errors.lon_minutes ? (
              <p>{errors.lon_minutes.message}</p>
            ) : (
              <p>&nbsp;</p>
            )}
            <label htmlFor="vfr_waypoint_lon_minutes">
              <span>Minutes&nbsp;'</span>
            </label>
          </HtmlInput>
          <HtmlInput
            $required={true}
            $hasValue={!!watch('lon_seconds') || watch('lon_seconds') === 0}
            $accepted={!errors.lon_seconds}
          >
            <input
              {...register('lon_seconds', { valueAsNumber: true })}
              id="vfr_waypoint_lon_seconds"
              type="number"
              autoComplete="off"
              required={true}
            />
            {errors.lon_seconds ? (
              <p>{errors.lon_seconds.message}</p>
            ) : (
              <p>&nbsp;</p>
            )}
            <label htmlFor="vfr_waypoint_lon_seconds">
              <span>Seconds&nbsp;"</span>
            </label>
          </HtmlInput>
        </HtmlInputGroup>
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

export default EditVfrWaypointForm;
