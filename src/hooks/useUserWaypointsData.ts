import { useQuery } from '@tanstack/react-query';

import { APIClientError } from '../services/apiClient';
import apiClient, { WaypointDataFromAPI } from '../services/userWaypointClient';

const useUserWaypointsData = () => {
  return useQuery<WaypointDataFromAPI[], APIClientError>({
    queryKey: ['waypoints', 'user'],
    queryFn: () => {
      return apiClient.getAll();
    },
  });
};

export default useUserWaypointsData;
