import { useQuery } from '@tanstack/react-query';
import { APIClientError } from '../../../services/apiClient';
import apiClient, {
  PersonOnBoardDataFromAPI,
} from '../services/personOnBoardClient';

const usePersonsOnBoard = (flightId: number) => {
  return useQuery<PersonOnBoardDataFromAPI[], APIClientError>({
    queryKey: ['personsOnBoard', flightId],
    queryFn: () => {
      return apiClient.getAll(`/${flightId}`);
    },
  });
};

export default usePersonsOnBoard;
