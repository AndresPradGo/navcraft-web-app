import { useQuery } from '@tanstack/react-query';
import APIClient, { APIClientError } from '../../../services/apiClient';

interface FueltTimeType {
    hours: number,
    gallons: number,
}

export interface FuelCalculationsData {
    pre_takeoff_gallons: number;
    climb_gallons: number;
    average_gph: number;
    enroute_fuel: FueltTimeType;
    additional_fuel: FueltTimeType;
    reserve_fuel: FueltTimeType;
    contingency_fuel: FueltTimeType;
    gallons_on_board: number;
}

const apiClient = new APIClient<string, FuelCalculationsData>("/flight-plans/fuel-calculations")
const useFuelCalculations = (flightId: number, noAircraft: boolean, noAerodrome: boolean) => {
    return useQuery<FuelCalculationsData, APIClientError>({
        queryKey: ['fuelCalculations', flightId],
        queryFn: () => {
            return apiClient.get(`/${flightId}`)
        },
        retry: noAircraft || noAerodrome ? 0 : 3,
        refetchOnWindowFocus: !noAircraft && !noAerodrome,
    })
}

export default useFuelCalculations