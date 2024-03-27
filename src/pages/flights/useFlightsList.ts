import { useQuery } from '@tanstack/react-query';

import { APIClientError } from '../../services/apiClient';
import apiClient, {
  FlightSummaryDataFromApi,
} from '../../services/flightsClient';

const useFlightsList = () => {
  return useQuery<FlightSummaryDataFromApi[], APIClientError>({
    queryKey: ['flights', 'all'],
    queryFn: () => {
      return apiClient.getAll('/');
    },
  });
};

export default useFlightsList;
