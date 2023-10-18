import { useQuery } from "@tanstack/react-query";

import APIClient, {APIClientError} from '../services/apiClient';
import {PassengerDataFromAPI} from '../pages/profile/entities'

interface EditPassengerData {
    name: string
    weight_lb: number
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
                    weight_lb: passenger.weight_lb
                })))
            )
        }
    })
}

export default usePassengersData



