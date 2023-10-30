import APIClient from './apiClient'


export interface RunwayDataFromAPI {
    id: number;
    number: number;
    position?: "R" | "L" | "C";
    length_ft: number;
    landing_length_ft?: number;
    intersection_departure_length_ft?: number;
    surface: string;
    surface_id: number;
}

export interface OfficialAerodromeDataFromAPI {
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
    elevation_ft: number;
    hidden: boolean;
    has_taf: boolean;
    has_metar: boolean;
    has_fds: boolean;
    status: string;
    registered: boolean;
    runways: RunwayDataFromAPI[];
}

export interface EditOfficialAerodromeData {
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
    elevation_ft: number;
    status: number;
    hidden: boolean | null;
    has_taf: boolean;
    has_metar: boolean;
    has_fds: boolean;
}


const apiClient = new APIClient<EditOfficialAerodromeData, OfficialAerodromeDataFromAPI>("")

export default apiClient;