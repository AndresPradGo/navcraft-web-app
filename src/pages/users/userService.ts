import APIClient from '../../services/apiClient';

export interface UserDataFromAPI {
  id: number;
  email: string;
  name: string;
  is_admin: boolean;
  is_master: boolean;
  is_active: boolean;
  weight_lb: number;
  created_at: string;
  last_updated: string;
  is_trial: boolean;
}

export interface EditUserData {
  make_admin: boolean;
  activate: boolean;
}

const apiClient = new APIClient<EditUserData, UserDataFromAPI>('/users');

export default apiClient;
