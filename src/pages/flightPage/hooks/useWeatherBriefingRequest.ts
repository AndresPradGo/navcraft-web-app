import { useMutation, useQueryClient } from '@tanstack/react-query';

import apiClient from '../services/briefingClient';
import { APIClientError } from '../../../services/apiClient';
import type {
  WeatherBriefingData,
  WeatherBriefingFromAPI,
  BriefingRequest,
} from '../services/briefingClient';

const useWeatherBriefingRequest = (flightId: number) => {
  const queryClient = useQueryClient();
  return useMutation<WeatherBriefingData, APIClientError, BriefingRequest>({
    mutationFn: (data) =>
      apiClient.post(
        data,
        `/weather/${flightId}`,
      ) as Promise<WeatherBriefingFromAPI>,
    onMutate: () => {
      queryClient.setQueryData<WeatherBriefingData>(
        ['weatherBriefing', flightId],
        () => 'mutating' as 'mutating',
      );
    },
    onSuccess: (briefingData) => {
      queryClient.setQueryData<WeatherBriefingData>(
        ['weatherBriefing', flightId],
        () => briefingData,
      );
    },
    onError: () => {
      queryClient.setQueryData<WeatherBriefingData>(
        ['weatherBriefing', flightId],
        () => 'error' as 'error',
      );
    },
  });
};

export default useWeatherBriefingRequest;
