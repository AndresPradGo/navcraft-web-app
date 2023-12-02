import { useQuery } from "@tanstack/react-query";

import {APIClientError} from '../services/apiClient';
import apiClient, {OfficialAerodromeDataFromAPI} from '../services/officialAerodromeClient';


const useAerodromesData = (forPlanning?: boolean) => {
    return useQuery<OfficialAerodromeDataFromAPI[], APIClientError>({
        queryKey: ['aerodromes', 'all'],
        queryFn: () => {
            return apiClient.getAndPreProcessAll<OfficialAerodromeDataFromAPI>(
                (data) => {
                    return data.filter(item => !forPlanning || !item.hidden)
                },
                "/waypoints/aerodromes"
                )
        }
    })
}

export default useAerodromesData



