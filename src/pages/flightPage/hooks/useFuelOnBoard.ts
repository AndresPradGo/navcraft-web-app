import { useQuery } from '@tanstack/react-query';
import { APIClientError } from '../../../services/apiClient';
import apiClient, {
  FuelOnBoardDataFromAPI,
} from '../services/fuelOnBoardClient';

const useFuelOnBoard = (flightId: number) => {
  return useQuery<FuelOnBoardDataFromAPI[], APIClientError>({
    queryKey: ['fuelOnBoard', flightId],
    queryFn: () => {
      return apiClient.getAll(`/${flightId}`);
    },
  });
};

export default useFuelOnBoard;
