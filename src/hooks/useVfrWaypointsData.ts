import { useQuery } from '@tanstack/react-query';

import { APIClientError } from '../services/apiClient';
import apiClient, {
  VfrWaypointDataFromAPI,
} from '../services/vfrWaypointClient';

const useVfrWaypointsData = (isAdmin: boolean) => {
  return useQuery<VfrWaypointDataFromAPI[], APIClientError>({
    queryKey: ['waypoints', 'vfr'],
    queryFn: () => {
      return apiClient.getAndPreProcessAll<VfrWaypointDataFromAPI>((data) => {
        return data.filter((item) => isAdmin || !item.hidden);
      }, '/waypoints/vfr');
    },
  });
};

export default useVfrWaypointsData;
