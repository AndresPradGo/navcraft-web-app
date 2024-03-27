import { useQuery } from '@tanstack/react-query';

import { APIClientError } from '../services/apiClient';
import apiClient, {
  WeightAndBalanceDataFromAPI,
} from '../services/weightBalanceClient';

const useWeightBalanceData = (profileId: number) => {
  return useQuery<WeightAndBalanceDataFromAPI, APIClientError>({
    queryKey: ['AircraftWeightBalanceData', profileId],
    queryFn: () => {
      return apiClient.get(`/${profileId}`);
    },
  });
};

export default useWeightBalanceData;
