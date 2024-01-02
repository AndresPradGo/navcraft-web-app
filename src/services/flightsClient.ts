import APIClient from './apiClient';
import {FlightWaypointDataFromAPI} from './userWaypointClient'

export interface AddFlightData {
    departure_time: string;
    aircraft_id: number | null;
    departure_aerodrome_id: number;
    arrival_aerodrome_id: number;
}

interface BaseWeatherReportRequestData {
    code: string;
    distance_from_target_nm: number;
}

interface LegDataFromAPI {
    id: number;
    temperature_c: number;
    altimeter_inhg: number;
    wind_direction: number;
    wind_magnitude_knot: number;
    temperature_last_updated: string;
    wind_last_updated: string;
    altimeter_last_updated: string;
    sequence: number;
    altitude_ft: number;
    upper_wind_aerodromes: BaseWeatherReportRequestData[];
    metar_aerodromes: BaseWeatherReportRequestData[];
    briefing_aerodromes: BaseWeatherReportRequestData[];
    waypoint?: FlightWaypointDataFromAPI;
}

export interface DepartureArrivalWeather {
    temperature_c: number; 
    altimeter_inhg: number; 
    wind_direction: number | null; 
    wind_magnitude_knot: number; 
    temperature_last_updated: string; 
    wind_last_updated: string; 
    altimeter_last_updated: string; 
}


export interface FlightDataFromApi extends AddFlightData {
    id: number;
    bhp_percent: number;
    added_enroute_time_hours: number;
    reserve_fuel_hours: number;
    contingency_fuel_hours: number;
    departure_aerodrome_is_private: boolean;
    arrival_aerodrome_is_private: boolean;
    legs: LegDataFromAPI[];
    departure_weather: DepartureArrivalWeather;
    arrival_weather: DepartureArrivalWeather;
    briefing_radius_nm: number;
    diversion_radius_nm: number;
    all_weather_is_official: boolean;
    weather_hours_from_etd: number;
    departure_taf_aerodromes: BaseWeatherReportRequestData[];
    departure_metar_aerodromes: BaseWeatherReportRequestData[];
    arrival_taf_aerodromes: BaseWeatherReportRequestData[];
    arrival_metar_aerodromes: BaseWeatherReportRequestData[];
    diversion_options: BaseWeatherReportRequestData[];
}

const apiClient = new APIClient<AddFlightData, FlightDataFromApi>("/flights")

export default apiClient;