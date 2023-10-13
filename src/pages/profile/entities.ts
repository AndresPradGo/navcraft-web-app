

export interface PassengerDataFromAPI {
    name: string,
    weight_lb: number,
    id: number
}

export interface ProfileDataFromAPI {
  email: string,
  name: string,
  id: number,
  is_admin: boolean,
  is_master: boolean,
  is_active: boolean,
  weight_lb: number,
  passenger_profiles: PassengerDataFromAPI[]
}

export interface WaypointDataFromAPI {
    id: number,
    code: string,
    name: string,
    lat_degrees: number,
    lat_minutes: number,
    lat_seconds: number,
    lat_direction: string,
    lon_degrees: number,
    lon_minutes: number,
    lon_seconds: number,
    lon_direction: string,
    magnetic_variation: number,
    created_at_utc: string,
    last_updated_utc: string
}