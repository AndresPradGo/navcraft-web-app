import APIClient from './apiClient';
import {WeightBalanceDataFromForm} from '../pages/performanceProfilePage/components/EditWeightAndBalanceDataForm'

interface WeightBalancelimits {
    id: number,
    cg_location_in: number,
    weight_lb: number,
    sequence: number
}

interface WeightAndBalanceProfile {
    name: string;
    limits : WeightBalancelimits[];
    created_at_utc: string;
    last_updated_utc: string;
}

export interface WeightAndBalanceDataFromAPI extends WeightBalanceDataFromForm {
    weight_balance_profiles: WeightAndBalanceProfile[]
}
const apiClient = new APIClient<
    WeightBalanceDataFromForm, 
    WeightAndBalanceDataFromAPI
>("/aircraft-weight-balance-data")

export default apiClient