import { useQuery } from "@tanstack/react-query";

import {APIClientError} from '../../services/apiClient';
import {ProfileDataFromAPI} from './entities'
import useAuth from '../login/useAuth';
import apiClient, {ProfileData} from './profileService'


const useProfileData = () => {
    const user = useAuth();
    return useQuery<ProfileData, APIClientError>({
        queryKey: ['profile'],
        queryFn: () => {
            return apiClient.getAndPreProcess<ProfileDataFromAPI>(
                user? user.authorization: "",
                (data: ProfileDataFromAPI) => {
                return {
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    weight: data.weight_lb
                }
            })
        }
    })
}

export default useProfileData

