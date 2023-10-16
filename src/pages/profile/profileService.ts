import APIClient from '../../services/apiClient';


interface EditProfileData {
    name: string,
    weight_lb: number
}

export interface ProfileData {
    id: number,
    name: string
    email: string
    weight: number
}

const apiClient = new APIClient<EditProfileData, ProfileData>("/users")

export default apiClient
