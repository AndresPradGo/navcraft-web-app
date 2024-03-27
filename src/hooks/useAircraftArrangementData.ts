import { useQuery } from '@tanstack/react-query';

import { APIClientError } from '../services/apiClient';
import apiClient, {
  AircraftArrangementDataFromAPI,
} from '../services/aircraftArrangementClient';

const useAircraftArrangementData = (profileId: number) => {
  return useQuery<AircraftArrangementDataFromAPI, APIClientError>({
    queryKey: ['AircraftArrangementData', profileId],
    queryFn: () => {
      return apiClient.get(`/${profileId}`);
    },
  });
};

export default useAircraftArrangementData;
