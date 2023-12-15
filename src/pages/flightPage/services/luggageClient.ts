import APIClient from '../../../services/apiClient';
import {LuggageDataFromForm} from '../components/AddLuggageForm'
export interface BaggageDataFromAPI extends  LuggageDataFromForm{
    baggage_compartment_id: number,
    name: string,
}

const apiClient = new APIClient<BaggageDataFromAPI, BaggageDataFromAPI>("/flight-weight-balance-data/baggage")

export default apiClient;