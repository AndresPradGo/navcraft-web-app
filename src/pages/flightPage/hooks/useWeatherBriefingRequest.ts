import { useMutation, useQueryClient} from '@tanstack/react-query';

import apiClient from '../services/briefingClient'
import { APIClientError } from '../../../services/apiClient';
import type { WeatherBriefingFromAPI, BriefingRequest } from '../services/briefingClient'
import errorToast from '../../../utils/errorToast';


const useWeatherBriefingRequest = (flightId: number) => {
    const queryClient = useQueryClient();
    return useMutation<WeatherBriefingFromAPI, APIClientError, BriefingRequest>({
        mutationFn: data => (
            apiClient.post(data, `/weather/${flightId}`) as Promise<WeatherBriefingFromAPI>
        ),
        onSuccess: (briefingData) => {
            queryClient.setQueryData<WeatherBriefingFromAPI>(
                ['weatherBriefing', flightId], 
                () => briefingData
            )
        },
        onError: (error) => {
            errorToast(error)
        }
    })
}

export default useWeatherBriefingRequest