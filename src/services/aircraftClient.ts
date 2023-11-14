import APIClient from '../services/apiClient';
import {AircraftDataFromForm} from '../components/editAircraftForm'


export interface PerformanceProfileBaseData {
    id: number;
    is_preferred: boolean;
    is_complete: boolean;
    fuel_type_id: number;
    performance_profile_name: string;
    created_at_utc: string;
    last_updated_utc: string;
}

export interface CompletePerformanceProfileDataFromAPI extends PerformanceProfileBaseData{
    center_of_gravity_in: number,
    empty_weight_lb: number,
    max_ramp_weight_lb: number,
    max_takeoff_weight_lb: number,
    max_landing_weight_lb: number,
    baggage_allowance_lb: number,
}

export interface AircraftDataFromAPI extends AircraftDataFromForm {
    profiles: PerformanceProfileBaseData[]
    created_at_utc: string;
    last_updated_utc: string;
}

const apiClient = new APIClient<AircraftDataFromForm, AircraftDataFromAPI>("/aircraft")

export default apiClient