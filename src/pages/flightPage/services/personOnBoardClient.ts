import APIClient from '../../../services/apiClient';

export interface PersonOnBoardDataFromAPI {
    id: number;
    seat_row_id: number;
    seat_number: number;
    name: string;
    weight_lb: number;
    user_id?: number
    passenger_profile_id?: number
}

export interface EditPersonOnBoardData {
    id: number;
    seat_row_id: number;
    seat_number: number;
    name?: string;
    weight_lb?: number;
    is_me?: boolean;
    passenger_profile_id?: number;
}

const apiClient = new APIClient<EditPersonOnBoardData, PersonOnBoardDataFromAPI>("/flight-weight-balance-data/person-on-board")

export default apiClient;