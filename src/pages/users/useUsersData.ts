import { useQuery } from '@tanstack/react-query';

import { APIClientError } from '../../services/apiClient';
import apiClient, { UserDataFromAPI } from './userService';

const useUsersData = () => {
  return useQuery<UserDataFromAPI[], APIClientError>({
    queryKey: ['users'],
    queryFn: () => {
      return apiClient.getAll();
    },
  });
};

export default useUsersData;
