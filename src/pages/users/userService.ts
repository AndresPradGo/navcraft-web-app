import APIClient from '../../services/apiClient';


export interface UserDataFromAPI {
    id: number;
    email: string;
    name: string;
    is_admin: boolean;
    is_master: boolean;
    is_active: boolean;
    weight_lb: number;
}

export interface EditUserData {
    make_admin: boolean;
    activate: boolean;
}

const apiClient = new APIClient<EditUserData, UserDataFromAPI>("/users")

 export default apiClient