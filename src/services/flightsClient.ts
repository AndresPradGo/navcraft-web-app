import APIClient from './apiClient';

export interface AddFlightData {
    departure_time: string;
    aircraft_id: number | null;
    departure_aerodrome_id: number;
    arrival_aerodrome_id: number;
}

export interface FlightSummaryDataFromApi extends AddFlightData {
    id: number;
    departure_aerodrome_is_private: boolean;
    arrival_aerodrome_is_private: boolean;
    waypoints: string[];
}

const apiClient = new APIClient<AddFlightData, FlightSummaryDataFromApi>("/flights")

export default apiClient;