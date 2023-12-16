import { useQuery } from '@tanstack/react-query';
import APIClient, { APIClientError } from '../../../services/apiClient';

interface TakeoffLandingDistancesData {
    runway_id: number;
    runway: string;
    length_available_ft: number;
    intersection_departure_length: number;
    weight_lb: number;
    pressure_altitude_ft: number;
    truncated_pressure_altitude_ft: number;
    temperature_c: number;
    truncated_temperature_c: number;
    headwind_knot: number;
    x_wind_knot: number;
    ground_roll_ft: number;
    obstacle_clearance_ft: number;
    adjusted_ground_roll_ft: number;
    adjusted_obstacle_clearance_ft: number;
}

export interface TakeoffLandingDistancesDataFromApi {
    departure: TakeoffLandingDistancesData[]
    arrival: TakeoffLandingDistancesData[]
}

const apiClient = new APIClient<string, TakeoffLandingDistancesDataFromApi>("/flight-plans/takeoff-landing-distances")

const useTakeoffLandingDistances = (flightId: number, noAircraft: boolean, noAerodrome: boolean) => {
    return useQuery<TakeoffLandingDistancesDataFromApi, APIClientError>({
        queryKey: ['takeoffLandingDistances', flightId],
        queryFn: () => {
            return apiClient.get(`/${flightId}`)
        },
        retry: noAircraft || noAerodrome ? 0 : 3,
        refetchOnWindowFocus: !noAircraft && !noAerodrome,
    })
}

export default useTakeoffLandingDistances