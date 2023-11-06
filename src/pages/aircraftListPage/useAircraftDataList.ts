import { useQuery } from "@tanstack/react-query";

import {APIClientError} from '../../services/apiClient';
import apiClient, {AircraftDataFromAPI} from '../../services/aircraftClient';


const useAircraftDataList = () => {
    return useQuery<AircraftDataFromAPI[], APIClientError>({
        queryKey: ['aircraft', 'list'],
        queryFn: () => apiClient.getAll()
    })
}

export default useAircraftDataList