import APIClient from '../../services/apiClient';
import {ProfileData} from './entities'


interface EditProfileData {
    name: string,
    weight_lb: number
}


const apiClient = new APIClient<EditProfileData, ProfileData>("/users")

export default apiClient
