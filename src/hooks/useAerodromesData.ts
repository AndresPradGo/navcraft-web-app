import { useQuery } from "@tanstack/react-query";

import {APIClientError} from '../services/apiClient';
import apiClient, {OfficialAerodromeDataFromAPI} from '../services/officialAerodromeClient';


const useAerodromesData = () => {
    return useQuery<OfficialAerodromeDataFromAPI[], APIClientError>({
        queryKey: ['aerodromes', 'all'],
        queryFn: () => {
            return apiClient.getAll("/waypoints/aerodromes")
        }
    })
}

export default useAerodromesData



