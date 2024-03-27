import { useQuery } from '@tanstack/react-query';

import { APIClientError } from '../services/apiClient';
import apiClient, {
  TakeoffLandingDataFromAPI,
} from '../services/takeoffLandingPerformanceDataClient';

const useTakeoffPerformanceData = (profileId: number) => {
  return useQuery<TakeoffLandingDataFromAPI, APIClientError>({
    queryKey: ['takeoffPerformance', profileId],
    queryFn: () => {
      return apiClient.get(`/takeoff-landing/${profileId}/?is_takeoff=true`);
    },
  });
};

export default useTakeoffPerformanceData;
