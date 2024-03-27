import { RunwayDataFromAPI } from '../services/userAerodromeClient';
import APIClient from '../services/apiClient';

export interface EditRunwayData {
  length_ft: number;
  landing_length_ft?: number;
  intersection_departure_length_ft?: number;
  number: number;
  position?: 'R' | 'L' | 'C';
  surface_id: number;
  aerodrome_id: number;
}

export interface RunwayData extends RunwayDataFromAPI {
  aerodrome: string;
  aerodrome_id: number;
}

const apiClient = new APIClient<EditRunwayData, RunwayData>('/runways');
export default apiClient;
