import { useQueryClient } from '@tanstack/react-query';
import { BsThermometerSun } from 'react-icons/bs';
import { FaArrowUpFromGroundWater } from 'react-icons/fa6';
import { GiWeight } from 'react-icons/gi';
import { LiaMountainSolid } from 'react-icons/lia';
import {
  PiAirTrafficControlDuotone,
  PiWindLight,
  PiClipboardTextDuotone,
} from 'react-icons/pi';
import { TbWindsock } from 'react-icons/tb';
import { WiBarometer } from 'react-icons/wi';
import { styled } from 'styled-components';

import { FlightDataFromApi } from '../../../services/flightClient';
import { TakeoffLandingDistancesDataFromApi } from '../hooks/useTakeoffLandingDistances';
import DataTableList from '../../../components/common/DataTableList';
import Table from '../../../components/common/ExpandibleTable';
import FlightWarningList from '../../../components/common/FlightWarningList';

const WeightIcon = styled(GiWeight)`
  font-size: 25px;
  margin: 0 10px 0 0;
  flex-shrink: 0;
`;

const AerodromeIcon = styled(PiAirTrafficControlDuotone)`
  font-size: 25px;
  margin: 0 10px 0 0;
  flex-shrink: 0;
`;

const ElevationIcon = styled(LiaMountainSolid)`
  font-size: 25px;
  margin: 0 10px 0 0;
  flex-shrink: 0;
`;

const AltimeterIcon = styled(FaArrowUpFromGroundWater)`
  font-size: 25px;
  margin: 0 10px 0 0;
  flex-shrink: 0;
`;

const PressureAltitudeIcon = styled(WiBarometer)`
  font-size: 40px;
  margin: -10px 0 -10px -10px;
  flex-shrink: 0;
`;

const TemperatureIcon = styled(BsThermometerSun)`
  font-size: 25px;
  margin: 0 10px 0 0;
  flex-shrink: 0;
`;

const WindMagnitudeIcon = styled(PiWindLight)`
  font-size: 25px;
  margin: 0 10px 0 0;
  flex-shrink: 0;
`;

const WindDirectionIcon = styled(TbWindsock)`
  font-size: 25px;
  margin: 0 10px 0 0;
  flex-shrink: 0;
`;

const ReportIcon = styled(PiClipboardTextDuotone)`
  font-size: 30px;
  margin: 0 5px 0 0;
  flex-shrink: 0;

  @media screen and (min-width: 425px) {
    margin-right: 20px;
  }
`;

interface Props {
  isTakeoff: boolean;
  flightId: number;
  aerodrome: string;
  elevation: number;
  isLoading: boolean;
}

const TakeoffLandinDistancesSection = ({
  isTakeoff,
  flightId,
  aerodrome,
  elevation,
  isLoading,
}: Props) => {
  const queryClient = useQueryClient();
  const flightData = queryClient.getQueryData<FlightDataFromApi>([
    'flight',
    flightId,
  ]);

  const distancesData =
    queryClient.getQueryData<TakeoffLandingDistancesDataFromApi>([
      'takeoffLandingDistances',
      flightId,
    ]);

  const dataListData =
    flightData && distancesData
      ? [
          {
            key: 'weight_lb',
            title: 'Weight [lb]',
            icon: <WeightIcon />,
            data: isTakeoff
              ? distancesData.departure.length
                ? Math.round(distancesData.departure[0].weight_lb * 100) / 100
                : 0
              : distancesData.arrival.length
                ? Math.round(distancesData.arrival[0].weight_lb * 100) / 100
                : 0,
          },
          {
            key: 'aerodrome',
            title: 'Aerodrome',
            icon: <AerodromeIcon />,
            data: aerodrome,
          },
          {
            key: 'elevation',
            title: 'Elevation [ft]',
            icon: <ElevationIcon />,
            data: elevation,
          },
          {
            key: 'altimeter_inhg',
            title: 'Altimeter [in Hg]',
            icon: <AltimeterIcon />,
            data: isTakeoff
              ? flightData.departure_weather.altimeter_inhg
              : flightData.arrival_weather.altimeter_inhg,
          },
          {
            key: 'pressure_altitude',
            title: 'Pressure Alt [ft]',
            icon: <PressureAltitudeIcon />,
            data: isTakeoff
              ? distancesData.departure.length
                ? distancesData.departure[0].pressure_altitude_ft
                : 0
              : distancesData.arrival.length
                ? distancesData.arrival[0].pressure_altitude_ft
                : 0,
          },
          {
            key: 'temperature_c',
            title: 'Temperature [\u00B0C]',
            icon: <TemperatureIcon />,
            data: isTakeoff
              ? flightData.departure_weather.temperature_c
              : flightData.arrival_weather.temperature_c,
          },
          {
            key: 'wind_magnitude_knot',
            title: 'Wind Magnitude [Kts]',
            icon: <WindMagnitudeIcon />,
            data: isTakeoff
              ? flightData.departure_weather.wind_magnitude_knot || '-'
              : flightData.arrival_weather.wind_magnitude_knot || '-',
          },
          {
            key: 'wind_direction',
            title: 'Wind Direction [\u00B0True]',
            icon: <WindDirectionIcon />,
            data: isTakeoff
              ? (flightData.departure_weather.wind_direction === 0
                  ? 'VRB'
                  : flightData.departure_weather.wind_direction) || '-'
              : (flightData.arrival_weather.wind_direction === 0
                  ? 'VRB'
                  : flightData.arrival_weather.wind_direction) || '-',
          },
        ]
      : [];
  const tableData = {
    keys: [
      'runway',
      'x_wind_knot',
      'headwind_knot',
      'length',
      'ground_roll_ft',
      'obstacle_clearance_ft',
      'adjusted_ground_roll_ft',
      'adjusted_obstacle_clearance_ft',
    ],
    headers: {
      runway: 'Runway',
      x_wind_knot: 'X-Wind [Kts]',
      headwind_knot: 'Headwind [Kts]',
      length: 'Rwy Length [ft]',
      ground_roll_ft: 'Gnd Roll [ft]',
      obstacle_clearance_ft: "50' Clearance [ft]",
      adjusted_ground_roll_ft: 'Adjusted Gnd Roll [ft]',
      adjusted_obstacle_clearance_ft: "Adjusted 50' Clearance [ft]",
    },
    rows: distancesData
      ? isTakeoff
        ? distancesData.departure.map((rwy) => {
            return {
              id: rwy.runway_id,
              runway: rwy.runway,
              x_wind_knot: rwy.x_wind_knot,
              headwind_knot: rwy.headwind_knot,
              length:
                rwy.intersection_departure_length || rwy.length_available_ft,
              ground_roll_ft: rwy.ground_roll_ft,
              obstacle_clearance_ft: rwy.obstacle_clearance_ft,
              adjusted_ground_roll_ft: rwy.adjusted_ground_roll_ft,
              adjusted_obstacle_clearance_ft:
                rwy.adjusted_obstacle_clearance_ft,
              handleEdit: () => {},
              handleDelete: () => {},
              permissions: undefined,
            };
          })
        : distancesData.arrival.map((rwy) => {
            return {
              id: rwy.runway_id,
              runway: rwy.runway,
              x_wind_knot: rwy.x_wind_knot,
              headwind_knot: rwy.headwind_knot,
              length: rwy.length_available_ft,
              ground_roll_ft: rwy.ground_roll_ft,
              obstacle_clearance_ft: rwy.obstacle_clearance_ft,
              adjusted_ground_roll_ft: rwy.adjusted_ground_roll_ft,
              adjusted_obstacle_clearance_ft:
                rwy.adjusted_obstacle_clearance_ft,
              handleEdit: () => {},
              handleDelete: () => {},
              permissions: undefined,
            };
          })
      : [],
    breakingPoint: 768,
  };

  const sortData = [
    {
      title: 'Runway',
      key: 'runway',
    },
    {
      title: 'X-Wind',
      key: 'x_wind_knot',
    },
    {
      title: 'Headwind',
      key: 'headwind_knot',
    },
    {
      title: 'Rwy Length [ft]',
      key: 'length',
    },
    {
      title: 'Gnd Roll',
      key: 'ground_roll_ft',
    },
    {
      title: "50' Clearance",
      key: 'obstacle_clearance_ft',
    },
    {
      title: 'Adjusted Gnd Roll',
      key: 'adjusted_ground_roll_ft',
    },
    {
      title: "Adjusted 50' Clearance",
      key: 'adjusted_obstacle_clearance_ft',
    },
  ];

  const warnings = [];

  if (isTakeoff) {
    if (flightData?.departure_weather.wind_direction === 0) {
      warnings.push(
        'Wind direction is variable, so 30\u00B0 tailwind is being considered.',
      );
    }
    if (distancesData && distancesData.departure.length) {
      if (
        distancesData.departure[0].truncated_pressure_altitude_ft <
        distancesData.departure[0].pressure_altitude_ft
      ) {
        warnings.push(
          `The maximum pressure altitude recommended for takeoff performance is ${distancesData.departure[0].truncated_pressure_altitude_ft} ft`,
        );
      }
      if (
        distancesData.departure[0].truncated_temperature_c <
        distancesData.departure[0].temperature_c
      ) {
        warnings.push(
          `The maximum temperature recommended for takeoff performance is ${distancesData.departure[0].truncated_temperature_c}\u00B0C`,
        );
      }
    }
  } else {
    if (flightData?.arrival_weather.wind_direction === 0) {
      warnings.push(
        'Wind direction is varible, so 30\u00B0 tailwind is being considered.',
      );
    }
    if (distancesData && distancesData.arrival.length) {
      if (
        distancesData.arrival[0].truncated_pressure_altitude_ft <
        distancesData.arrival[0].pressure_altitude_ft
      ) {
        warnings.push(
          `The maximum pressure altitude recommended for landing performance is ${distancesData.arrival[0].truncated_pressure_altitude_ft} ft`,
        );
      }
      if (
        distancesData.arrival[0].truncated_temperature_c <
        distancesData.arrival[0].temperature_c
      ) {
        warnings.push(
          `The maximum temperature recommended for landing performance is ${distancesData.arrival[0].truncated_temperature_c}\u00B0C`,
        );
      }
    }
  }

  return (
    <>
      <DataTableList dataList={dataListData} margin="0 0 40px" />
      <Table
        title={
          isTakeoff
            ? isLoading
              ? 'Takeoff Performance Report'
              : 'Takeoff Performance Report'
            : isLoading
              ? 'Landing Performance Report'
              : 'Landing Performance Report'
        }
        hanldeAdd={() => {}}
        disableAdd={true}
        tableData={tableData}
        sortColumnOptions={sortData}
        emptyTableMessage=""
        notExpandible={true}
        icon={<ReportIcon />}
        otherComponent={<FlightWarningList warnings={[warnings]} />}
      />
    </>
  );
};

export default TakeoffLandinDistancesSection;
