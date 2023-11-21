import APIClient from './apiClient';
import {WeightBalanceDataFromForm} from '../pages/performanceProfilePage/components/EditWeightAndBalanceDataForm'
import {WeightAndBalanceProfileType} from './weightBalanceProfileClient'

export interface WeightAndBalanceDataFromAPI extends WeightBalanceDataFromForm {
    weight_balance_profiles: WeightAndBalanceProfileType[]
}

const apiClient = new APIClient<
    WeightBalanceDataFromForm, 
    WeightAndBalanceDataFromAPI
>("/aircraft-weight-balance-data")

export default apiClient