import { useQuery } from '@tanstack/react-query';

import APIClient, { APIClientError } from '../services/apiClient';

export interface AerodromeStatus {
  status: string;
  id: number;
}

const apiClient = new APIClient<string, AerodromeStatus>(
  '/waypoints/aerodromes-status',
);

const useAerodromeStatusList = () => {
  return useQuery<AerodromeStatus[], APIClientError>({
    queryKey: ['aerodromeStatusList'],
    queryFn: () => apiClient.getAll(),
  });
};

export default useAerodromeStatusList;
