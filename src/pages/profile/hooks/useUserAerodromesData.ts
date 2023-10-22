import { useQuery } from "@tanstack/react-query";

import {APIClientError} from '../../../services/apiClient';
import apiClient, {AerodromeDataFromAPI} from '../../../services/userAerodromeClient';


const useUserAerodromesData = () => {
    return useQuery<AerodromeDataFromAPI[], APIClientError>({
        queryKey: ['aerodromes', 'user'],
        queryFn: () => {
            return apiClient.getAndPreProcessAll<AerodromeDataFromAPI>(
                (data: AerodromeDataFromAPI[]) => data.filter(a => !a.registered),
                "/aerodromes"
            )
        }
    })
}

export default useUserAerodromesData



