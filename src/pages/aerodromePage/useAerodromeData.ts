import { useQuery } from "@tanstack/react-query";

import {APIClientError} from '../../services/apiClient';
import apiClient, {OfficialAerodromeDataFromAPI} from '../../services/officialAerodromeClient';


const useAerodromeData = (aerodromeId: number) => {
    return useQuery<OfficialAerodromeDataFromAPI, APIClientError>({
        queryKey: ['aerodrome', aerodromeId],
        queryFn: () => {
            return apiClient.getAndPreProcess<OfficialAerodromeDataFromAPI[]>(
                (preData) => preData[0],
                `/waypoints/aerodromes?aerodrome_id=${aerodromeId}`
            )
        }
    })
}

export default useAerodromeData



