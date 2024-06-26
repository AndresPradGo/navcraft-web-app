import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { AiOutlineSwap } from 'react-icons/ai';
import { BiSolidPlaneLand, BiSolidPlaneTakeOff } from 'react-icons/bi';
import { BsCalendarDate, BsNewspaper } from 'react-icons/bs';
import { FaClipboardList, FaRoute, FaCloudSunRain } from 'react-icons/fa';
import { FaScaleUnbalanced, FaHandHoldingDroplet } from 'react-icons/fa6';
import { IoAirplane } from 'react-icons/io5';
import { MdOutlineStart } from 'react-icons/md';
import {
  PiMapPinDuotone,
  PiChartPolarDuotone,
  PiCircleDuotone,
} from 'react-icons/pi';
import { RiMapPinUserFill } from 'react-icons/ri';
import { styled } from 'styled-components';

import { ContentLayout } from '../layout';
import useFlightData from './hooks/useFlightData';
import Loader from '../../components/Loader';
import useAerodromesData from '../../hooks/useAerodromesData';
import useAircraftDataList from '../../hooks/useAircraftDataList';
import formatUTCDate from '../../utils/formatUTCDate';
import formatUTCTime from '../../utils/formatUTCTime';
import SideBarContent from './components/SideBarContent';
import { useModal, Modal } from '../../components/common/modal';
import DeleteFlightForm from '../../components/deleteFlightForm';
import EditFlightForm from './components/EditFlightForm';
import ChangeAircraftForm from './components/ChangeAircraftForm';
import EditDepartureArrivalForm from './components/EditDepartureArrivalForm';
import RefreshWeatherForm from './components/RefreshWeatherForm';
import MapSection from './components/map/MapSection';
import { useSideBar } from '../../components/sidebar';
import useNavLogData from './hooks/useNavLogData';
import useWeightBalanceReport from './hooks/useWeightBalanceReport';
import useTakeoffLandingDistances from './hooks/useTakeoffLandingDistances';
import useFuelCalculations from './hooks/useFuelCalculations';
import useVfrWaypointsData from '../../hooks/useVfrWaypointsData';
import useUserWaypointsData from '../../hooks/useUserWaypointsData';
import {
  MapStateType,
  MapInputStyleType,
} from '../../components/SideBarMapOptions';
import NavLogSection from './components/NavLogSection';
import TakeoffLandinDistancesSection from './components/TakeoffLandinDistancesSection';
import AddLegForm from './components/AddLegForm';
import WeightBalanceSection from './components/WeightBalanceSection';
import FuelCalculationsSection from './components/FuelCalculationsSection';
import WeatherBriefingSection from './components/WeatherBriefingSection';
import NotamsBriefingSection from './components/NotamsBriefingSection';
import useSetTitle from '../../hooks/useSetTitle';
import useUnauthorizedErrorHandler from '../../hooks/useUnauthorizedErrorHandler';
import AnnouncementBox from '../../components/common/AnnouncementBox';
import useWeatherBriefing from './hooks/useWeatherBriefing';
import useNotamBriefing from './hooks/useNotamBriefing';

const HtmlContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  text-wrap: nowrap;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

interface TitleData {
  $isMap: boolean;
}
const HtmlTitleContainer = styled.div<TitleData>`
  margin-bottom: ${(props) => (props.$isMap ? '0' : '30px')};
  width: 100%;
  max-width: 1380px;
  align-self: center;
  padding: 0 ${(props) => (props.$isMap ? '3%' : '0')};

  @media screen and (min-width: 1000px) {
    padding: 0 ${(props) => (props.$isMap ? '30px' : '0')};
  }

  & div:first-of-type {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    max-width: 292px;
    flex-wrap: nowrap !important;
    margin: 10px 0 25px 0 !important;

    h1:first-of-type {
      display: flex;
      align-items: center;
      font-size: 25px;
      text-wrap: wrap;
      line-height: 0.98;
      width: 257px;
      margin: 0;

      & svg {
        flex-shrink: 0;
        font-size: 35px;
        margin: 0 10px 0 0;
      }
    }

    @media screen and (min-width: 425px) {
      max-width: 395px;
      & h1:first-of-type {
        width: 352px;
        font-size: 35px;

        & svg {
          margin: 0 10px 0 0;
          font-size: 45px;
        }
      }
    }
  }

  & div:last-of-type {
    margin: 0 10px 10px 15px;
    color: var(--color-grey);
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    align-content: flex-start;

    & span {
      margin: 0 10px 10px 0;
      display: flex;
      align-items: center;

      & i {
        padding: 0;
        display: flex;
        align-items: center;
        text-wrap: wrap;

        & svg {
          font-size: 25px;
          margin: 0 5px 0 0;
          flex-shrink: 0;
        }
      }

      & svg {
        font-size: 25px;
        margin: 0 10px;
      }
    }

    & span {
      & i:last-of-type {
        color: var(--color-grey-bright);
        padding: 0 0 0 10px;
        display: flex;
        align-items: flex-start;
      }
    }
  }
`;

const ChangeIcon = styled(AiOutlineSwap)`
  flex-shrink: 0;
  color: var(--color-contrast);
  cursor: pointer;
  font-size: 30px;
  margin-left: 5px;

  &:hover {
    color: var(--color-contrast-hover);
  }

  @media screen and (min-width: 425px) {
    font-size: 35px;
  }
`;

const FlightPage = () => {
  const [sectionIdx, setSectionIdx] = useState<number>(0);
  const [mapState, setMapState] = useState<MapStateType>({
    open: false,
    showAerodromes: false,
    showVfrWaypoints: false,
    showSavedAerodromes: false,
    showSavedWaypoints: false,
    showCharts: false,
  });
  const [formToDisplay, setFormToDisplay] = useState<'delete' | 'edit'>(
    'delete',
  );

  const generalModal = useModal();
  const aircraftModal = useModal();
  const departureModal = useModal();
  const arrivalModal = useModal();
  const weatherModal = useModal();
  const addLegModal = useModal();

  const { handleExpandSideBar } = useSideBar();

  const { id: stringId } = useParams();
  const flightId = parseInt(stringId || '0');
  const { data: flightData, error, isLoading } = useFlightData(flightId);

  const {
    data: aircraftList,
    isLoading: aircraftListIsLoading,
    error: aircraftListError,
  } = useAircraftDataList(true);
  const aircraft = aircraftList?.find((a) => a.id === flightData?.aircraft_id);
  const aircraftProfile = aircraft?.profiles.find((p) => p.is_preferred);

  const {
    data: aerodromes,
    isLoading: aerodromesIsLoading,
    error: aerodromesError,
  } = useAerodromesData(true);
  const departure = aerodromes?.find(
    (a) => a.id === flightData?.departure_aerodrome_id,
  );
  const arrival = aerodromes?.find(
    (a) => a.id === flightData?.arrival_aerodrome_id,
  );

  useSetTitle(
    departure && arrival
      ? `Flight from ${departure.code} to ${arrival.code}`
      : 'Flight',
  );

  const missingAerodrome = !departure || !arrival;

  const {
    data: legsData,
    isLoading: legsIsLoading,
    error: legsError,
    isFetching: legsIsFetching,
    isStale: legsIsStale,
  } = useNavLogData(flightId, !aircraft || !aircraftProfile, missingAerodrome);

  const {
    isLoading: weatherBriefingIsLoading,
    isFetching: weatherBriefingIsFetching,
    isStale: weatherBriefingIsStale,
    error: weatherBriefingError,
  } = useWeatherBriefing(flightId);

  const {
    isLoading: notamBriefingIsLoading,
    isFetching: notamBriefingIsFetching,
    isStale: notamBriefingIsStale,
    error: notamBriefingError,
  } = useNotamBriefing(flightId);

  const {
    isLoading: weightBalanceIsLoading,
    error: weightBalanceError,
    isFetching: weightBalanceIsFetching,
    isStale: weightBalanceIsStale,
  } = useWeightBalanceReport(
    flightId,
    !aircraft || !aircraftProfile,
    missingAerodrome,
  );

  const { isLoading: vfrWaypointsIsLoading, error: vfrWaypointsError } =
    useVfrWaypointsData(false);

  const {
    data: userWaypointsData,
    isLoading: userWaypointsIsLoading,
    error: userWaypointsError,
  } = useUserWaypointsData();

  const {
    isLoading: fuelCalculationsIsLoading,
    error: fuelCalculationsError,
    isFetching: fuelCalculationsIsFetching,
    isStale: fuelCalculationsIsStale,
  } = useFuelCalculations(
    flightId,
    !aircraft || !aircraftProfile,
    missingAerodrome,
  );

  const {
    isLoading: takeoffLandingDistancesIsLoading,
    error: takeoffLandingDistancesError,
    isFetching: takeoffLandingDistancesIsFetching,
    isStale: takeoffLandingDistancesIsStale,
  } = useTakeoffLandingDistances(
    flightId,
    !aircraft || !aircraftProfile,
    missingAerodrome,
  );

  useUnauthorizedErrorHandler([error]);

  if (
    (error && error.message !== 'Network Error') ||
    (legsError && legsError.response?.data.detail === 'Flight not found.')
  )
    throw new Error('notFound');
  else if (
    (error && error.message === 'Network Error') ||
    aerodromesError ||
    weatherBriefingError ||
    notamBriefingError ||
    aircraftListError ||
    (legsError &&
      legsError?.response?.data.detail !== "Flight doesn't have an aircraft." &&
      legsError?.response?.data.detail !==
        "The flight's aircraft doesn't have preferred performance profile." &&
      legsError?.response?.data.detail !==
        'Please make sure the flight has a departure and arrival aerodrome.') ||
    vfrWaypointsError ||
    userWaypointsError ||
    (weightBalanceError &&
      weightBalanceError?.response?.data.detail !==
        "Flight doesn't have an aircraft." &&
      weightBalanceError?.response?.data.detail !==
        "The flight's aircraft doesn't have preferred performance profile." &&
      weightBalanceError?.response?.data.detail !==
        'Please make sure the flight has a departure and arrival aerodrome.') ||
    (fuelCalculationsError &&
      fuelCalculationsError?.response?.data.detail !==
        "Flight doesn't have an aircraft." &&
      fuelCalculationsError?.response?.data.detail !==
        "The flight's aircraft doesn't have preferred performance profile." &&
      fuelCalculationsError?.response?.data.detail !==
        'Please make sure the flight has a departure and arrival aerodrome.') ||
    (takeoffLandingDistancesError &&
      takeoffLandingDistancesError?.response?.data.detail !==
        "Flight doesn't have an aircraft." &&
      takeoffLandingDistancesError?.response?.data.detail !==
        "The flight's aircraft doesn't have preferred performance profile." &&
      takeoffLandingDistancesError?.response?.data.detail !==
        'Please make sure the flight has a departure and arrival aerodrome.')
  )
    throw new Error('');

  if (
    aircraftListIsLoading ||
    isLoading ||
    aerodromesIsLoading ||
    vfrWaypointsIsLoading ||
    userWaypointsIsLoading ||
    legsIsLoading ||
    weightBalanceIsLoading ||
    fuelCalculationsIsLoading ||
    takeoffLandingDistancesIsLoading
  )
    return <Loader message="Calculating flight data . . ." />;

  const sections = [
    {
      key: 'navLog',
      title: 'Flight Summary',
      icon: <FaClipboardList />,
    },
    {
      key: 'weightBalance',
      title: 'Weight & Balance',
      icon: <FaScaleUnbalanced />,
    },
    {
      key: 'fuelLog',
      title: 'Fuel Calculations',
      icon: <FaHandHoldingDroplet />,
    },
    {
      key: 'takeoff',
      title: 'Takeoff Distances',
      icon: <BiSolidPlaneTakeOff />,
    },
    {
      key: 'landing',
      title: 'Landing Distances',
      icon: <BiSolidPlaneLand />,
    },
    {
      key: 'weather',
      title: 'Weather Briefing',
      icon: <FaCloudSunRain />,
    },
    {
      key: 'notam',
      title: 'NOTAMs Briefing',
      icon: <BsNewspaper />,
    },
  ];

  const handleMapStateChange = (key: keyof MapStateType, value: boolean) => {
    if (key === 'open') handleExpandSideBar(false);
    setMapState((prev) => {
      const newMapState = { ...prev };
      newMapState[key] = value;
      return newMapState;
    });
  };

  const aircraftRegistration = aircraft?.registration || '';

  const handleChangeToNextTable = () => {
    if (sectionIdx >= sections.length - 1) setSectionIdx(0);
    else setSectionIdx(sectionIdx + 1);
  };

  const mapInputs = [
    {
      key: 'showAerodromes',
      icon: <PiChartPolarDuotone />,
      text: 'Aerodromes',
      color: 'var(--color-nav-3)',
    },
    {
      key: 'showVfrWaypoints',
      icon: <PiMapPinDuotone />,
      text: 'VFR Waypoints',
      color: 'var(--color-nav-4)',
    },
    {
      key: 'showSavedAerodromes',
      icon: <PiCircleDuotone />,
      text: 'Saved Aerodromes',
      color: 'var(--color-nav-3)',
    },
    {
      key: 'showSavedWaypoints',
      icon: <RiMapPinUserFill />,
      text: 'Saved Waypoints',
      color: 'var(--color-nav-4)',
    },
  ] as MapInputStyleType[];

  if (!userWaypointsData.length) {
    mapInputs.splice(3, 1);
  }
  if (!aerodromes.filter((a) => !a.registered).length) {
    mapInputs.splice(2, 1);
  }

  return (
    <>
      <Modal isOpen={addLegModal.isOpen} fullHeight={true}>
        <AddLegForm
          flightId={flightId}
          closeModal={addLegModal.handleClose}
          isOpen={addLegModal.isOpen}
          departureAerodrome={departure || aerodromes[0]}
          arrivalAerodrome={arrival || aerodromes[0]}
        />
      </Modal>
      <Modal isOpen={arrivalModal.isOpen || !arrival} fullHeight={true}>
        <EditDepartureArrivalForm
          noAerodrome={!arrival}
          flightId={flightId}
          currentData={{
            aerodrome: `${arrival?.code}: ${arrival?.name}` || '',
            wind_magnitude_knot: flightData
              ? flightData.arrival_weather.wind_magnitude_knot
              : 0,
            wind_direction: flightData
              ? flightData.arrival_weather.wind_direction
              : null,
            temperature_c: flightData
              ? flightData.arrival_weather.temperature_c
              : 15,
            altimeter_inhg: flightData
              ? flightData.arrival_weather.altimeter_inhg
              : 29.92,
          }}
          closeModal={arrivalModal.handleClose}
          isOpen={arrivalModal.isOpen || !arrival}
          isDeparture={false}
        />
      </Modal>
      <Modal isOpen={departureModal.isOpen || !departure} fullHeight={true}>
        <EditDepartureArrivalForm
          noAerodrome={!departure}
          flightId={flightId}
          currentData={{
            aerodrome: `${departure?.code}: ${departure?.name}` || '',
            wind_magnitude_knot: flightData
              ? flightData.departure_weather.wind_magnitude_knot
              : 0,
            wind_direction: flightData
              ? flightData.departure_weather.wind_direction
              : null,
            temperature_c: flightData
              ? flightData.departure_weather.temperature_c
              : 15,
            altimeter_inhg: flightData
              ? flightData.departure_weather.altimeter_inhg
              : 29.92,
          }}
          closeModal={departureModal.handleClose}
          isOpen={departureModal.isOpen || !departure}
          isDeparture={true}
        />
      </Modal>
      <Modal
        isOpen={aircraftModal.isOpen || !aircraft || !aircraftProfile}
        fullHeight={true}
      >
        <ChangeAircraftForm
          flightId={flightId}
          closeModal={aircraftModal.handleClose}
          isOpen={aircraftModal.isOpen || !aircraft || !aircraftProfile}
          noAircraft={!aircraft || !aircraftProfile}
          aircraft={aircraftRegistration}
        />
      </Modal>
      <Modal isOpen={generalModal.isOpen}>
        {formToDisplay === 'delete' ? (
          <DeleteFlightForm
            closeModal={generalModal.handleClose}
            route={`from ${departure?.code} to ${arrival?.code}`}
            flightId={flightId}
            redirect={true}
          />
        ) : formToDisplay === 'edit' ? (
          <EditFlightForm
            closeModal={generalModal.handleClose}
            flightId={flightId}
            isOpen={generalModal.isOpen}
          />
        ) : null}
      </Modal>
      <Modal isOpen={weatherModal.isOpen}>
        <RefreshWeatherForm
          closeModal={weatherModal.handleClose}
          flightId={flightId}
        />
      </Modal>
      <ContentLayout
        map={{
          isOpen: mapState.open,
          component: (
            <MapSection
              handleEditDeparture={departureModal.handleOpen}
              handleEditArrival={arrivalModal.handleOpen}
              mapState={mapState}
              markers={mapInputs}
              flightId={flightId}
              departureAerodrome={departure || aerodromes[0]}
              arrivalAerodrome={arrival || aerodromes[0]}
            />
          ),
        }}
        sideBarContent={
          <SideBarContent
            flightId={flightId}
            mapState={mapState}
            mapStateSetter={handleMapStateChange}
            mapInputs={mapInputs}
            handleChangeSection={(id: number) => {
              setSectionIdx(id);
              handleMapStateChange('open', false);
            }}
            sectionIndex={sectionIdx}
            sectionOptions={sections}
            handleEditFlight={() => {
              setFormToDisplay('edit');
              generalModal.handleOpen();
            }}
            handleEditDeparture={departureModal.handleOpen}
            handleEditArrival={arrivalModal.handleOpen}
            handleChangeAircraft={aircraftModal.handleOpen}
            handleRefreshWeather={weatherModal.handleOpen}
            handleDeleteFlight={() => {
              setFormToDisplay('delete');
              generalModal.handleOpen();
            }}
          />
        }
      >
        <HtmlContainer>
          <HtmlTitleContainer $isMap={mapState.open}>
            <div>
              <h1>
                {sections[sectionIdx].icon}
                {sections[sectionIdx].title}
              </h1>
              <ChangeIcon onClick={handleChangeToNextTable} />
            </div>
            <div>
              <span>
                Flight
                <MdOutlineStart />
              </span>
              <span>
                <i>Route:</i>
                <i>
                  <FaRoute />
                  {`${departure?.code} - ${arrival?.code}`}
                </i>
              </span>
              <span>|</span>
              <span>
                <i>Aircraft:</i>
                <i>
                  <IoAirplane />
                  {aircraftRegistration}
                </i>
              </span>
              <span>|</span>
              <span>
                <i>ETD:</i>
                <i>
                  <BsCalendarDate />
                  {flightData
                    ? `${formatUTCDate(
                        flightData.departure_time,
                      )}@${formatUTCTime(flightData.departure_time)}`
                    : ''}
                </i>
              </span>
            </div>
          </HtmlTitleContainer>
          {flightData ? (
            flightData.weather_hours_from_etd < 0 ? (
              <AnnouncementBox
                margin="0 0 20px"
                maxWidth={800}
                isDanger={true}
                title="Update ETD!"
                message="The Estimated Time of Departure is in the past. Update the ETD to keep the weather data accurate."
              />
            ) : flightData.weather_hours_from_etd > 10000 ? (
              <AnnouncementBox
                margin="0 0 20px"
                maxWidth={800}
                isWarning={true}
                title="Update Weather!"
                message={`The weather data used for flight planning hasn't been updated. For a more accurate flight plan, use the "Refresh Weather Data" option, or manually enter reliable weather data.`}
              />
            ) : (
              <AnnouncementBox
                margin="0 0 20px"
                maxWidth={800}
                isDanger={false}
                isWarning={false}
                title="Weather Last Updated"
                message={`All the weather data used for planning was last updated ${
                  flightData.weather_hours_from_etd
                } hours away from the ETD.${
                  flightData.weather_hours_from_etd > 4
                    ? ' For a more accurate flight plan, update the weather data closer to the ETD.'
                    : ''
                }`}
              />
            )
          ) : null}
          {legsData && legsData.find((l) => l.total_distance > 150) ? (
            <AnnouncementBox
              margin="0 0 20px"
              maxWidth={800}
              isDanger={true}
              title="Some legs are too long!"
              message={`Long distances introduce error to the true track angles, consider shortening your legs under 150 NM.`}
            />
          ) : null}
          {sectionIdx === 0 ? (
            <NavLogSection
              handleAdd={addLegModal.handleOpen}
              flightId={flightId}
              isLoading={legsIsFetching && legsIsStale}
            />
          ) : sectionIdx === 1 ? (
            <WeightBalanceSection
              profileId={aircraftProfile ? aircraftProfile.id : 0}
              flightId={flightId}
              isLoading={
                (weightBalanceIsFetching && weightBalanceIsStale) ||
                (fuelCalculationsIsFetching && fuelCalculationsIsStale)
              }
            />
          ) : sectionIdx === 2 ? (
            <FuelCalculationsSection
              flightId={flightId}
              isLoading={fuelCalculationsIsFetching && fuelCalculationsIsStale}
            />
          ) : sectionIdx === 3 ? (
            <TakeoffLandinDistancesSection
              isTakeoff={true}
              aerodrome={departure ? departure.name : '-'}
              elevation={departure ? departure.elevation_ft : 0}
              flightId={flightId}
              isLoading={
                takeoffLandingDistancesIsFetching &&
                takeoffLandingDistancesIsStale
              }
            />
          ) : sectionIdx === 4 ? (
            <TakeoffLandinDistancesSection
              isTakeoff={false}
              aerodrome={arrival ? arrival.name : '-'}
              elevation={arrival ? arrival.elevation_ft : 0}
              flightId={flightId}
              isLoading={
                takeoffLandingDistancesIsFetching &&
                takeoffLandingDistancesIsStale
              }
            />
          ) : sectionIdx === 5 ? (
            <WeatherBriefingSection
              flightId={flightId}
              departureAerodrome={departure || aerodromes[0]}
              arrivalAerodrome={arrival || aerodromes[0]}
              isLoading={
                weatherBriefingIsLoading ||
                (weatherBriefingIsFetching && weatherBriefingIsStale)
              }
              flightDataIsChanging={
                isLoading || (legsIsFetching && legsIsStale)
              }
            />
          ) : sectionIdx === 6 ? (
            <NotamsBriefingSection
              flightId={flightId}
              departureAerodrome={departure || aerodromes[0]}
              arrivalAerodrome={arrival || aerodromes[0]}
              isLoading={
                notamBriefingIsLoading ||
                (notamBriefingIsFetching && notamBriefingIsStale)
              }
              flightDataIsChanging={
                isLoading || (legsIsFetching && legsIsStale)
              }
            />
          ) : null}
        </HtmlContainer>
      </ContentLayout>
    </>
  );
};

export default FlightPage;
