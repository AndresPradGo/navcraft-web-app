import APIClient from './apiClient';


export interface EditPerformanceModelData {
    id: number;
    is_complete: boolean;
    fuel_type_id: number;
    performance_profile_name: string;
}
export interface PerformanceModelDataFromAPI extends EditPerformanceModelData {
    created_at_utc: string;
    last_updated_utc: string;
}

export interface CompletePerformanceModelDataFromAPI extends PerformanceModelDataFromAPI{
  center_of_gravity_in: number,
  empty_weight_lb: number,
  max_ramp_weight_lb: number,
  max_takeoff_weight_lb: number,
  max_landing_weight_lb: number,
  baggage_allowance_lb: number,
  is_preferred: boolean
}

const apiClient = new APIClient<EditPerformanceModelData, PerformanceModelDataFromAPI>("/aircraft-models")

export default apiClient