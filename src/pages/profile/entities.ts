export interface ProfileData {
  id: number;
  name: string;
  email: string;
  weight: number;
}

export interface PassengerDataFromAPI {
  name: string;
  weight_lb: number;
  id: number;
}

export interface ProfileDataFromAPI {
  email: string;
  name: string;
  id: number;
  is_admin: boolean;
  is_master: boolean;
  is_active: boolean;
  weight_lb: number;
  passenger_profiles: PassengerDataFromAPI[];
}

export interface EditUserResponse {
  email: string;
  name: string;
  id: number;
  is_admin: boolean;
  is_master: boolean;
  is_active: boolean;
  weight_lb: number;
}

export interface ProfileDataWithJWT extends ProfileData {
  token: string;
  tokenType: string;
}
