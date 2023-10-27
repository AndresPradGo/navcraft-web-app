import { useQuery } from '@tanstack/react-query';

import APIClient, {APIClientError} from '../../services/apiClient';

interface UserDataFromAPI {
    id: number;
    email: string;
    name: string;
    is_admin: boolean;
    is_master: boolean;
    is_active: boolean;
    weight_lb: number;
}

interface EditUserData {
    make_admin: boolean;
    activate: boolean;
}

const apiClient = new APIClient<EditUserData, UserDataFromAPI>("/users")

const useUsersData = () => {
    return useQuery<UserDataFromAPI[], APIClientError>({
        queryKey: ["users"],
        queryFn: () => {
            return apiClient.getAll()
        }
    })
}

export default useUsersData