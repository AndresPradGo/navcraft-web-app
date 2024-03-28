import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AiOutlineSave } from 'react-icons/ai';
import { LiaTimesSolid } from 'react-icons/lia';
import { MdAltRoute } from 'react-icons/md';
import { RiMapPinAddFill } from 'react-icons/ri';
import { TbRoute } from 'react-icons/tb';
import { styled } from 'styled-components';
import { useForm, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import Button from '../../../components/common/button';
import DataList from '../../../components/common/datalist';
import usePostNewLeg from '../hooks/usePostNewLeg';
import { OfficialAerodromeDataFromAPI } from '../../../services/officialAerodromeClient';
import { VfrWaypointDataFromAPI } from '../../../services/vfrWaypointClient';
import { WaypointDataFromAPI } from '../../../services/userWaypointClient';
import { FlightDataFromApi } from '../../../services/flightClient';
import Loader from '../../../components/Loader';

const HtmlForm = styled.form`
  width: 100%;
  flex-grow: 1;
  min-height: 100%;
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

interface HtmlInputContainerProps {
  $isLoading: boolean;
}

const HtmlInputContainer = styled.div<HtmlInputContainerProps>`
  display: flex;
  flex-direction: column;
  justify-content: ${(props) => (props.$isLoading ? 'center' : 'flex-start')};
  min-height: 100%;
  width: 100%;
  overflow-y: auto;
  padding: 20px 0;
  flex-grow: 1;

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

const HtmlButtons = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  padding: 10px 20px;
`;

const TitleIcon = styled(TbRoute)`
  flex-shrink: 0;
  font-size: 30px;
  margin: 0 2px 0 0;

  @media screen and (min-width: 510px) {
    font-size: 40px;
  }
`;

const SaveIcon = styled(AiOutlineSave)`
  font-size: 25px;
`;

const NewWaypointIcon = styled(RiMapPinAddFill)`
  font-size: 25px;
  margin: 0 3px 0 5px;
  flex-shrink: 0;

  @media screen and (min-width: 425px) {
    margin: 0 10px;
  }
`;

const InterceptingWaypointIcon = styled(MdAltRoute)`
  font-size: 25px;
  margin: 0 3px 0 5px;
  flex-shrink: 0;

  @media screen and (min-width: 425px) {
    margin: 0 10px;
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

const schema = z.object({
  interceptingWaypoint: z.string(),
  newWaypoint: z.string(),
});
type FormDataType = z.infer<typeof schema>;

interface Props {
  flightId: number;
  closeModal: () => void;
  isOpen: boolean;
  departureAerodrome: OfficialAerodromeDataFromAPI;
  arrivalAerodrome: OfficialAerodromeDataFromAPI;
}

const AddLegForm = ({
  flightId,
  closeModal,
  isOpen,
  departureAerodrome,
}: Props) => {
  const queryClient = useQueryClient();
  const flightData = queryClient.getQueryData<FlightDataFromApi>([
    'flight',
    flightId,
  ]);

  const aerodromes = queryClient.getQueryData<OfficialAerodromeDataFromAPI[]>([
    'aerodromes',
    'all',
  ]);

  const vfrWaypoints = queryClient.getQueryData<VfrWaypointDataFromAPI[]>([
    'waypoints',
    'vfr',
  ]);

  const userWaypoints = queryClient.getQueryData<WaypointDataFromAPI[]>([
    'waypoints',
    'user',
  ]);

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

  const [submited, setSubmited] = useState(false);

  const mutation = usePostNewLeg(flightId, true);

  useEffect(() => {
    if (submited && !mutation.isLoading) {
      closeModal();
    }
  }, [submited, mutation.isLoading, closeModal]);

  useEffect(() => {
    register('interceptingWaypoint');
    register('newWaypoint');
  }, [register]);

  useEffect(() => {
    if (isOpen) {
      reset({
        interceptingWaypoint: '',
        newWaypoint: '',
      });
    }
  }, [isOpen, reset]);

  const submitHandler = (data: FieldValues) => {
    const sequence =
      flightWaypoints.indexOf(data.interceptingWaypoint as string) + 1;
    const aerodromeData = aerodromes?.find(
      (a) =>
        `${a.code}: ${a.name}${a.registered ? '' : ' (saved)'}` ===
        data.newWaypoint,
    );
    let waypointId = aerodromeData?.id;
    let type:
      | 'aerodrome'
      | 'waypoint'
      | 'user aerodrome'
      | 'user waypoint'
      | undefined = aerodromeData?.registered
      ? 'aerodrome'
      : waypointId
        ? 'user aerodrome'
        : undefined;
    if (!waypointId) {
      const waypointData = vfrWaypoints?.find(
        (v) => `${v.code}: ${v.name}` === data.newWaypoint,
      );
      waypointId = waypointData?.id;
      type = waypointId ? 'waypoint' : undefined;
    }
    if (!waypointId) {
      const waypointData = userWaypoints?.find(
        (u) => `${u.code}: ${u.name} (saved)` === data.newWaypoint,
      );
      waypointId = waypointData?.id;
      type = waypointId ? 'user waypoint' : undefined;
    }

    if (sequence === 0) {
      setError('interceptingWaypoint', {
        type: 'manual',
        message: 'Select a valid option',
      });
    } else if (!waypointId) {
      setError('newWaypoint', {
        type: 'manual',
        message: 'Select a valid option',
      });
    } else {
      mutation.mutate({
        type,
        existing_waypoint_id: waypointId,
        new_waypoint: {
          code: '',
          name: '',
          lat_degrees: 0,
          lat_minutes: 0,
          lat_seconds: 0,
          lat_direction: 'N',
          lon_degrees: 0,
          lon_minutes: 0,
          lon_seconds: 0,
          lon_direction: 'W',
        },
        sequence,
      });
      setSubmited(true);
    }
  };

  const flightWaypoints = [
    `${departureAerodrome.code}: ${departureAerodrome.name}${
      departureAerodrome.registered ? '' : ' (saved)'
    }`,
  ];
  for (const leg of flightData?.legs || []) {
    if (leg.waypoint)
      flightWaypoints.push(
        `${leg.waypoint.code}: ${leg.waypoint.name}${
          !leg.waypoint.from_user_waypoint ? '' : ' (saved)'
        }`,
      );
  }

  const newWaypointOptions = (
    vfrWaypoints?.map((v) => `${v.code}: ${v.name}`) || []
  )
    .concat(
      userWaypoints?.map((u) => `${u.code}: ${u.name} (saved)`) || [],
      aerodromes?.map(
        (a) => `${a.code}: ${a.name}${a.registered ? '' : ' (saved)'}`,
      ) || [],
    )
    .filter((item) => item !== watch('interceptingWaypoint'))
    .sort();

  return (
    <HtmlForm onSubmit={handleSubmit(submitHandler) as () => void}>
      <h1>
        <div>
          <TitleIcon />
          Add Flight Leg
        </div>
        {mutation.isLoading ? (
          <CloseIcon onClick={() => {}} $disabled={true} />
        ) : (
          <CloseIcon onClick={closeModal} $disabled={false} />
        )}
      </h1>
      <HtmlInputContainer $isLoading={mutation.isLoading}>
        {mutation.isLoading ? (
          <Loader message="Calculating flight data . . ." />
        ) : (
          <>
            <DataList
              setError={(message) =>
                setError('interceptingWaypoint', {
                  type: 'manual',
                  message: message,
                })
              }
              clearErrors={() => clearErrors('interceptingWaypoint')}
              required={true}
              value={watch('interceptingWaypoint')}
              hasError={!!errors.interceptingWaypoint}
              errorMessage={errors.interceptingWaypoint?.message || ''}
              options={flightWaypoints}
              setValue={(value: string) =>
                setValue('interceptingWaypoint', value)
              }
              name="addFlightLeg-interceptingWaypoint"
              formIsOpen={isOpen}
              resetValue=""
            >
              <InterceptingWaypointIcon />
              Interception Waypoint
            </DataList>
            <DataList
              setError={(message) =>
                setError('newWaypoint', {
                  type: 'manual',
                  message: message,
                })
              }
              clearErrors={() => clearErrors('newWaypoint')}
              required={true}
              value={watch('newWaypoint')}
              hasError={!!errors.newWaypoint}
              errorMessage={errors.newWaypoint?.message || ''}
              options={newWaypointOptions}
              setValue={(value: string) => setValue('newWaypoint', value)}
              name="addFlightLeg-newWaypoint"
              formIsOpen={isOpen}
              resetValue=""
            >
              <NewWaypointIcon />
              New Waypoint
            </DataList>
          </>
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

export default AddLegForm;
