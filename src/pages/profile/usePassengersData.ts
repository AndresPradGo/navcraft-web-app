import { useQuery } from "@tanstack/react-query";

import APIClient, {APIClientError} from '../../services/apiClient';
import {PassengerDataFromAPI} from './entities'

interface EditPassengerData {
    name: string
    weight: number
}

interface PassengerData extends EditPassengerData {
    id: number
}

const apiClient = new APIClient<EditPassengerData, PassengerData>("/users")

const usePassengersData = (userId: number) => {
    return useQuery<PassengerData[], APIClientError>({
        queryKey: ['profile', userId, 'passengers'],
        queryFn: () => {
            return apiClient.getAndPreProcessAll<PassengerDataFromAPI>(
                (data: PassengerDataFromAPI[]) => (data.map(passenger => ({
                    id: passenger.id,
                    name: passenger.name,
                    weight: passenger.weight_lb
                }))),
                "/passenger-profiles"
            )
        }
    })
}

export default usePassengersData



