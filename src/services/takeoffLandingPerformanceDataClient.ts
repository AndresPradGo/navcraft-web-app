
import APIClient from './apiClient';
import {
    WindAdjustmentDataFromForm
} from '../pages/performanceProfilePage/components/EditWindAdjustmentsForm'

interface EditRunwayAdjustmentData {
    surface_id: number,
    percent: number
}

export interface EditTakeoffLandingData extends WindAdjustmentDataFromForm {
    percent_increase_runway_surfaces: EditRunwayAdjustmentData[]
}

interface TakeoffLandingPerformanceData {
    weight_lb: number;
    pressure_alt_ft: number;
    temperature_c: number;
    groundroll_ft: number;
    obstacle_clearance_ft: number;
    }

export interface TakeoffLandingDataFromAPI extends  EditTakeoffLandingData {
    performance_data: TakeoffLandingPerformanceData[]
}

const apiClient = new APIClient<
    EditTakeoffLandingData, 
    TakeoffLandingDataFromAPI
>("/aircraft-performance-data")

export default apiClient