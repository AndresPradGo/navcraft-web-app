import { useQuery } from '@tanstack/react-query';

import APIClient, { APIClientError } from '../../../services/apiClient';

interface PerformanceData {
  weight_lb: number;
  pressure_alt_ft: number;
  temperature_c: number;
  bhp_percent: number;
  gph: number;
  rpm: number;
  ktas: number;
}

export interface CruisePerformanceDataFromAPI {
  performance_data: PerformanceData[];
}

const apiClient = new APIClient<undefined, CruisePerformanceDataFromAPI>(
  '/aircraft-performance-data/cruise',
);

const useCruiseData = (profileId: number) => {
  return useQuery<CruisePerformanceDataFromAPI, APIClientError>({
    queryKey: ['aircraftCruisePerformance', profileId],
    queryFn: () => {
      return apiClient.get(`/${profileId}`);
    },
  });
};

export default useCruiseData;
