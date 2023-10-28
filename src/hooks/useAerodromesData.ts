import { useQuery } from "@tanstack/react-query";

import {APIClientError} from '../services/apiClient';
import apiClient, {AerodromeDataFromAPI} from '../services/userAerodromeClient';


const useAerodromesData = () => {
    return useQuery<AerodromeDataFromAPI[], APIClientError>({
        queryKey: ['aerodromes', 'all'],
        queryFn: () => {
            return apiClient.getAll("/aerodromes")
        }
    })
}

export default useAerodromesData



