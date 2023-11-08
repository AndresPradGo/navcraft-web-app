import { useQuery } from "@tanstack/react-query";

import {APIClientError} from '../services/apiClient';
import apiClient, {PerformanceModelDataFromAPI} from '../services/aircraftModelClient';


const useAircraftModels = () => {
    return useQuery<PerformanceModelDataFromAPI[], APIClientError>({
        queryKey: ['aircraftModel', 'list'],
        queryFn: () => apiClient.getAll()
    })
}

export default useAircraftModels