import APIClient from '../services/apiClient';


export interface EditAircraftData {
    make: string,
    model: string,
    abbreviation: string,
    registration: string,
    id: number,
}

interface PerformanceProfileBaseData {
    id: number;
    is_preferred: boolean;
    is_complete: boolean;
    fuel_type_id: number;
    performance_profile_name: string;
}

export interface AircraftDataFromAPI extends EditAircraftData {
    profiles: PerformanceProfileBaseData[]
}

const apiClient = new APIClient<EditAircraftData, AircraftDataFromAPI>("/aircraft")

export default apiClient