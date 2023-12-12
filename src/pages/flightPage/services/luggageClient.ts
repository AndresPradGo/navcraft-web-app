import APIClient from '../../../services/apiClient';
interface EditBaggageData {
    baggage_compartment_id: number,
    name: string,
    weight_lb: number
}

export interface BaggageDataFromAPI extends  EditBaggageData{
    id: number,
}


const apiClient = new APIClient<EditBaggageData, BaggageDataFromAPI>("/flight-weight-balance-data/baggage")

export default apiClient;