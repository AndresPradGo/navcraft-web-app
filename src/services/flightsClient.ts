import APIClient from './apiClient';
import {FlightWaypointDataFromAPI} from './userWaypointClient'

interface AddFlightData {
    departure_time: string,
    aircraft_id: number,
    departure_aerodrome_id: number,
    arrival_aerodrome_id: number
}

interface LegDataFromAPI {
    id: number,
    temperature_c: number,
      altimeter_inhg: number,
      wind_direction: number,
      wind_magnitude_knot: number,
      temperature_last_updated: string,
      wind_last_updated: string,
      altimeter_last_updated: string,
      sequence: number,
      altitude_ft: number,
      waypoint: FlightWaypointDataFromAPI
}


export interface FlightDataFromApi extends AddFlightData {
    id: number,
    bhp_percent: number,
    added_enroute_time_hours: number,
    reserve_fuel_hours: number,
    contingency_fuel_hours: number,
    departure_aerodrome_is_private: true,
    arrival_aerodrome_is_private: true,
    legs: LegDataFromAPI[]
}

const apiClient = new APIClient<AddFlightData, FlightDataFromApi>("/flights")

export default apiClient;