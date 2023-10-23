import { useQuery } from "@tanstack/react-query";

import {APIClientError} from '../../services/apiClient';
import apiClient, {AerodromeDataFromAPI} from '../../services/userAerodromeClient';


const useAerodromeData = (aerodromeId: number) => {
    return useQuery<AerodromeDataFromAPI, APIClientError>({
        queryKey: ['aerodrome', aerodromeId],
        queryFn: () => {
            return apiClient.getAndPreProcess<AerodromeDataFromAPI[]>(
                (preData) => preData[0],
                `/aerodromes?aerodrome_id=${aerodromeId}`
            )
        }
    })
}

export default useAerodromeData



