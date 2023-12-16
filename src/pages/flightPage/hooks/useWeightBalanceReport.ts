import { useQuery } from '@tanstack/react-query';
import APIClient, { APIClientError } from '../../../services/apiClient';

interface BaseWeightData {
    weight_lb: number,
    arm_in: number,
    moment_lb_in: number,
}

interface BaseFuelWeightData extends BaseWeightData{
    gallons: number,
}

interface SeatsWeightData extends BaseWeightData{
    seat_row_id: number,
    seat_row_name: string
} 

interface BaggageCompartmentWeightData extends BaseWeightData{
    baggage_compartment_id: number,
    baggage_compartment_name: string,
}

interface FuelTankWeightData extends BaseFuelWeightData{
    fuel_tank_id: number,
    fuel_tank_name: string,
}

export interface WeightBalanceReportType {
    warnings: string[],
    seats: SeatsWeightData[],
    compartments: BaggageCompartmentWeightData[],
    fuel_on_board: FuelTankWeightData[],
    fuel_burned_pre_takeoff: BaseFuelWeightData,
    fuel_burned: FuelTankWeightData[],
    empty_weight: BaseWeightData,
    zero_fuel_weight: BaseWeightData,
    ramp_weight: BaseWeightData,
    takeoff_weight: BaseWeightData,
    landing_weight: BaseWeightData,
}

const apiClient = new APIClient<string, WeightBalanceReportType>("/flight-plans/weight-balance")

const useWeightBalanceReport = (flightId: number, noAircraft: boolean, noAerodrome: boolean) => {
    return useQuery<WeightBalanceReportType, APIClientError>({
        queryKey: ['weightBalanceReport', flightId],
        queryFn: () => {
            return apiClient.get(`/${flightId}`)
        },
        retry: noAircraft || noAerodrome ? 0 : 3,
        refetchOnWindowFocus: !noAircraft && !noAerodrome,
    })
}

export default useWeightBalanceReport