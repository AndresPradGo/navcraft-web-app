import APIClient from './apiClient';

export interface RunwayDataFromAPI {
  id: number;
  number: number;
  position?: 'R' | 'L' | 'C';
  length_ft: number;
  landing_length_ft?: number;
  intersection_departure_length_ft?: number;
  surface: string;
  surface_id: number;
  created_at_utc: string;
  last_updated_utc: string;
}

export interface AerodromeDataFromAPI {
  id: number;
  code: string;
  name: string;
  lat_degrees: number;
  lat_minutes: number;
  lat_seconds: number;
  lat_direction: 'N' | 'S';
  lon_degrees: number;
  lon_minutes: number;
  lon_seconds: number;
  lon_direction: 'E' | 'W';
  magnetic_variation: number;
  created_at_utc: string;
  last_updated_utc: string;
  elevation_ft: number;
  hidden: boolean;
  status: string;
  registered: boolean;
  runways: RunwayDataFromAPI[];
}

export interface EditAerodromeData {
  code: string;
  name: string;
  lat_degrees: number;
  lat_minutes: number;
  lat_seconds: number;
  lat_direction: 'N' | 'S';
  lon_degrees: number;
  lon_minutes: number;
  lon_seconds: number;
  lon_direction: 'E' | 'W';
  magnetic_variation?: number;
  elevation_ft: number;
  status: number;
}

const apiClient = new APIClient<EditAerodromeData, AerodromeDataFromAPI>(
  '/waypoints',
);

export default apiClient;
