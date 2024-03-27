import { useQuery } from '@tanstack/react-query';
import APIClient, { APIClientError } from '../../../services/apiClient';

interface Waypoint {
  code: string;
  name: string;
  latitude_degrees: number;
  longitude_degrees: number;
}

export interface NavLogLegData {
  leg_id: number;
  from_waypoint: Waypoint;
  to_waypoint: Waypoint;
  desired_altitude_ft: number;
  actual_altitud_ft: number;
  truncated_altitude: number;
  rpm: number;
  temperature_c: number;
  truncated_temperature_c: number;
  ktas: number;
  kcas: number;
  true_track: number;
  wind_magnitude_knot: number;
  wind_direction: number;
  true_heading: number;
  magnetic_variation: number;
  magnetic_heading: number;
  ground_speed: number;
  distance_to_climb: number;
  distance_enroute: number;
  total_distance: number;
  time_to_climb_min: number;
  time_enroute_min: number;
  fuel_to_climb_gallons: number;
  cruise_gph: number;
}

const apiClient = new APIClient<string, NavLogLegData>('/flight-plans/nav-log');

const useNavLogData = (
  flightId: number,
  noAircraft: boolean,
  noAerodrome: boolean,
) => {
  return useQuery<NavLogLegData[], APIClientError>({
    queryKey: ['navLog', flightId],
    queryFn: () => {
      return apiClient.getAll(`/${flightId}`);
    },
    retry: noAircraft || noAerodrome ? 0 : 3,
    refetchOnWindowFocus: !noAircraft && !noAerodrome,
  });
};

export default useNavLogData;
