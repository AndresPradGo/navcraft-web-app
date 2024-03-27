import { useQuery } from '@tanstack/react-query';

import APIClient, { APIClientError } from '../../services/apiClient';

interface Runway {
  length_ft: number;
  landing_length_ft?: number;
  intersection_departure_length_ft?: number;
  number: number;
  position?: string;
  surface_id: number;
  aerodrome_id: number;
  id: number;
  surface: string;
  aerodrome: string;
  created_at_utc: string;
  last_updated_utc: string;
}

interface EditRunwayData {
  length_ft: number;
  landing_length_ft?: number;
  intersection_departure_length_ft?: number;
  number: number;
  position?: 'R' | 'L' | 'C';
  surface_id: number;
  aerodrome_id: number;
}

const apiClient = new APIClient<EditRunwayData, Runway>('/runways');

const useAerodromeStatusList = (isAdmin: boolean) => {
  return useQuery<Runway[], APIClientError>({
    queryKey: ['runways'],
    queryFn: () => apiClient.getAll(),
    enabled: isAdmin,
  });
};

export default useAerodromeStatusList;
