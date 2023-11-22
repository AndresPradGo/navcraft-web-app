import { useQuery } from "@tanstack/react-query";

import {APIClientError} from '../services/apiClient';
import apiClient, {TakeoffLandingDataFromAPI} from '../services/takeoffLandingPerformanceDataClient'


const useLandingPerformanceData = (profileId: number) => {
    return useQuery<TakeoffLandingDataFromAPI, APIClientError>({
        queryKey: ['landingPerformance', profileId],
        queryFn: () => {
            return apiClient.get(`/takeoff-landing/${profileId}/?is_takeoff=false`)
        }
    })
}

export default useLandingPerformanceData