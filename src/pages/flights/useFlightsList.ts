import { useQuery } from "@tanstack/react-query";

import {APIClientError} from '../../services/apiClient';
import apiClient, {FlightDataFromApi} from "../../services/flightsClient"


const useFlightsList = () => {
    return useQuery<FlightDataFromApi[], APIClientError>({
        queryKey: ['flights', 'all'],
        queryFn: () => {
            return apiClient.getAll()
        }
    })
}

export default useFlightsList