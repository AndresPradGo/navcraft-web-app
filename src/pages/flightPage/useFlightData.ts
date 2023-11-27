import { useQuery } from "@tanstack/react-query";

import {APIClientError} from '../../services/apiClient';
import apiClient, {FlightDataFromApi} from "../../services/flightsClient"


const useFlightData = (flightId: number) => {
    return useQuery<FlightDataFromApi, APIClientError>({
        queryKey: ['flight', flightId],
        queryFn: () => {
            return apiClient.getAndPreProcess<FlightDataFromApi[]>(
                data => data[0],
                `?flight_id=${flightId}`
            )
        }
    })
}

export default useFlightData