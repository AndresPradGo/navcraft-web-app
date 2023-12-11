import APIClient from '../../../services/apiClient';

export interface BaggageDataFromAPI {
    id: number,
    baggage_compartment_id: number,
    name: string,
    weight_lb: number,
}

interface EditPersonOnBoardData {
    baggage_compartment_id: number,
    name: string,
    weight_lb: number
}

const apiClient = new APIClient<EditPersonOnBoardData, BaggageDataFromAPI>("/flight-weight-balance-data/baggage")

export default apiClient;