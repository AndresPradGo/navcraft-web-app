import APIClient from './apiClient';
import { ClimbAdjustmentValuesFromForm } from '../pages/performanceProfilePage/components/EditClimbDataForm';

interface ClimbPerformanceData {
  weight_lb: number;
  pressure_alt_ft: number;
  temperature_c: number;
  kias: number | null;
  fpm: number | null;
  time_min: number;
  fuel_gal: number;
  distance_nm: number;
}

export interface ClimbPerformanceDataFromAPI
  extends ClimbAdjustmentValuesFromForm {
  performance_data: ClimbPerformanceData[];
}

const apiClient = new APIClient<
  ClimbAdjustmentValuesFromForm,
  ClimbPerformanceDataFromAPI
>('/aircraft-performance-data');

export default apiClient;
