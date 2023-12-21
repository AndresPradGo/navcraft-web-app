import APIClient from './apiClient';
import {FlightWaypointDataFromAPI} from './userWaypointClient'

export interface AddFlightData {
    departure_time: string,
    aircraft_id: number | null,
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
    waypoint?: FlightWaypointDataFromAPI
}

export interface DepartureArrivalWeather {
    temperature_c: number, 
    altimeter_inhg: number, 
    wind_direction: number | null, 
    wind_magnitude_knot: number, 
    temperature_last_updated: string, 
    wind_last_updated: string, 
    altimeter_last_updated: string, 
}


export interface FlightDataFromApi extends AddFlightData {
    id: number,
    bhp_percent: number,
    added_enroute_time_hours: number,
    reserve_fuel_hours: number,
    contingency_fuel_hours: number,
    departure_aerodrome_is_private: boolean,
    arrival_aerodrome_is_private: boolean,
    legs: LegDataFromAPI[],
    departure_weather: DepartureArrivalWeather,
    arrival_weather: DepartureArrivalWeather,
    briefing_radius_nm: number,
    diversion_radius_nm: number
}

const apiClient = new APIClient<AddFlightData, FlightDataFromApi>("/flights")

export default apiClient;