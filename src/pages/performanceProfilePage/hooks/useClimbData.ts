import { useQuery } from "@tanstack/react-query";

import {APIClientError} from '../../../services/apiClient';
import apiClient, {ClimbPerformanceDataFromAPI} from '../../../services/aircraftClimbDataClient'


const useClimbData = (profileId: number) => {
    return useQuery<ClimbPerformanceDataFromAPI, APIClientError>({
        queryKey: ['aircraftClimbPerformance', profileId],
        queryFn: () => {
            return apiClient.get(`/climb/${profileId}`)
        }
    })
}

export default useClimbData