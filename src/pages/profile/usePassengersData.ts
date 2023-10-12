import { useQuery } from "@tanstack/react-query";

import APIClient, {APIClientError} from '../../services/apiClient';
import {PassengerDataFromAPI} from './entities'
import useAuth from '../login/useAuth';

interface EditPassengerData {
    name: string
    weight: number
}

interface PassengerData extends EditPassengerData {
    id: number
}

const apiClient = new APIClient<EditPassengerData, PassengerData>("/users")

const usePassengerData = () => {
    const user = useAuth();
    return useQuery<PassengerData[], APIClientError>({
        queryKey: ['profile', 'passengers'],
        queryFn: () => {
            return apiClient.getAndPreProcessAll<PassengerDataFromAPI>(
                user? user.authorization: "",
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

export default usePassengerData



