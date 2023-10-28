import APIClient from './apiClient'

export interface WaypointDataFromAPI {
    id: number;
    code: string;
    name: string;
    lat_degrees: number;
    lat_minutes: number;
    lat_seconds: number;
    lat_direction: "N" | "S";
    lon_degrees: number;
    lon_minutes: number;
    lon_seconds: number;
    lon_direction: "E" | "W";
    magnetic_variation: number;
    created_at_utc: string;
    last_updated_utc: string;
}

export interface EditWaypointData {
    code: string;
    name: string;
    lat_degrees: number;
    lat_minutes: number;
    lat_seconds: number;
    lat_direction: "N" | "S";
    lon_degrees: number;
    lon_minutes: number;
    lon_seconds: number;
    lon_direction: "E" | "W";
    magnetic_variation?: number;
}

const apiClient = new APIClient<EditWaypointData, WaypointDataFromAPI>("/waypoints/user");

export default apiClient;