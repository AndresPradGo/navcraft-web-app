import APIClient from './apiClient';

export interface PerformanceModelDataFromAPI {
    id: number;
    is_complete: boolean;
    fuel_type_id: number;
    performance_profile_name: string;
}

const apiClient = new APIClient<PerformanceModelDataFromAPI, PerformanceModelDataFromAPI>("/aircraft-models")

export default apiClient