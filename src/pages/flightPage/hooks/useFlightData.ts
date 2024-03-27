import { useQuery } from '@tanstack/react-query';

import { APIClientError } from '../../../services/apiClient';
import apiClient, { FlightDataFromApi } from '../../../services/flightClient';

const useFlightData = (flightId: number) => {
  return useQuery<FlightDataFromApi, APIClientError>({
    queryKey: ['flight', flightId],
    queryFn: () => {
      return apiClient.get(`/${flightId}`);
    },
  });
};

export default useFlightData;
