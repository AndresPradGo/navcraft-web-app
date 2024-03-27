import { useQuery } from '@tanstack/react-query';

import APIClient, { APIClientError } from '../services/apiClient';

export interface RunwaySurfaceData {
  surface: string;
  id: number;
}

const apiClient = new APIClient<string, RunwaySurfaceData>('/runways/surfaces');

const useRunwaySurfaces = () => {
  return useQuery<RunwaySurfaceData[], APIClientError>({
    queryKey: ['runwaySurface'],
    queryFn: () => apiClient.getAll(),
  });
};

export default useRunwaySurfaces;
