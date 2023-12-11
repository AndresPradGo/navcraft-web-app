import { useQuery } from '@tanstack/react-query';
import { APIClientError } from '../../../services/apiClient';
import apiClient, {BaggageDataFromAPI} from '../services/luggageClient'


const usePersonsOnBoard = (flightId: number) => {
    return useQuery<BaggageDataFromAPI[], APIClientError>({
        queryKey: ['luggage', flightId],
        queryFn: () => {
            return apiClient.getAll(`/${flightId}`)
        }
    })
}

export default usePersonsOnBoard