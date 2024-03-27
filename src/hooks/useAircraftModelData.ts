import { useQuery } from '@tanstack/react-query';

import { APIClientError } from '../services/apiClient';
import apiClient, {
  PerformanceModelDataFromAPI,
} from '../services/aircraftModelClient';

const useAircraftModelData = (id: number, isProfile?: boolean) => {
  return useQuery<PerformanceModelDataFromAPI, APIClientError>({
    queryKey: ['aircraftModel', id],
    queryFn: () =>
      id && !isProfile
        ? apiClient.getAndPreProcess<PerformanceModelDataFromAPI[]>(
            (dataList) => dataList[0],
            `?profile_id=${id}`,
          )
        : {
            id: 0,
            is_complete: false,
            fuel_type_id: 0,
            performance_profile_name: '',
            created_at_utc: '',
            last_updated_utc: '',
          },
  });
};

export default useAircraftModelData;
