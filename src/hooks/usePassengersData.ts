import { useQuery } from "@tanstack/react-query";

import APIClient, {APIClientError} from '../services/apiClient';
import {PassengerDataFromAPI} from '../pages/profile/entities'

interface EditPassengerData {
    name: string
    weight: number
}

export interface PassengerData extends EditPassengerData {
    id: number
}

const apiClient = new APIClient<EditPassengerData, PassengerData>("/users/passenger-profiles")

const usePassengersData = () => {
    return useQuery<PassengerData[], APIClientError>({
        queryKey: ['passengers'],
        queryFn: () => {
            return apiClient.getAndPreProcessAll<PassengerDataFromAPI>(
                (data: PassengerDataFromAPI[]) => (data.map(passenger => ({
                    id: passenger.id,
                    name: passenger.name,
                    weight: passenger.weight_lb
                })))
            )
        }
    })
}

export default usePassengersData



