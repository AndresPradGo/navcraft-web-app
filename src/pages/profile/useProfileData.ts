import { useQuery } from "@tanstack/react-query";

import APIClient, {APIClientError} from '../../services/apiClient';
import {ProfileDataFromAPI} from './entities'
import useAuth from '../login/useAuth';

interface EditProfileData {
    name: string,
    weight_lb: number
}

interface ProfileData {
    name: string
    email: string
    weight: number
}


const apiClient = new APIClient<EditProfileData, ProfileData>("/users")

const useProfileData = () => {
    const user = useAuth();
    return useQuery<ProfileData, APIClientError>({
    queryKey: ['profile'],
    queryFn: () => {
        return apiClient.getAndPreProcess<ProfileDataFromAPI>(
            user? user.authorization: "",
            (data: ProfileDataFromAPI) => {
            return {
                name: data.name,
                email: data.email,
                weight: data.weight_lb
            }
        } , "/me")
    }
})}

export default useProfileData

