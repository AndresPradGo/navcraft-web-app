export interface ProfileData {
    id: number,
    name: string
    email: string
    weight: number
}

export interface PassengerDataFromAPI {
    name: string;
    weight_lb: number;
    id: number;
}

export interface ProfileDataFromAPI {
  email: string;
  name: string;
  id: number;
  is_admin: boolean;
  is_master: boolean;
  is_active: boolean;
  weight_lb: number;
  passenger_profiles: PassengerDataFromAPI[];
}

interface RunwayDataFromAPI {
    id: number;
    number: number;
    position?: string;
    length_ft: number;
    landing_length_ft?: number;
    interception_departure_length_ft?: number;
    surface: string;
    surface_id: number;
}

export interface AerodromeDataFromAPI {
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
    status: string;
    registered: boolean;
    runways: RunwayDataFromAPI[];
}

export interface EditUserResponse {
    email: string;
    name: string;
    id: number;
    is_admin: boolean;
    is_master: boolean;
    is_active: boolean;
    weight_lb: number;
}

export interface ProfileDataWithJWT extends  ProfileData{
    token: string,
    tokenType: string
}