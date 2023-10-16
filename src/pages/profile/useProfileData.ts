import { useQuery } from "@tanstack/react-query";

import {APIClientError} from '../../services/apiClient';
import {ProfileDataFromAPI} from './entities'
import apiClient, {ProfileData} from './profileService'


const useProfileData = () => {
    return useQuery<ProfileData, APIClientError>({
        queryKey: ['profile'],
        queryFn: () => {
            return apiClient.getAndPreProcess<ProfileDataFromAPI>(
                (data: ProfileDataFromAPI) => {
                return {
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    weight: data.weight_lb
                }
            }, "/me")
        }
    })
}

export default useProfileData

