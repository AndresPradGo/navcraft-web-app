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

export interface AircraftDataFromAPI extends AircraftDataFromForm {
    profiles: PerformanceProfileBaseData[]
    created_at_utc: string;
    last_updated_utc: string;
}

const apiClient = new APIClient<AircraftDataFromForm, AircraftDataFromAPI>("/aircraft")

export default apiClient