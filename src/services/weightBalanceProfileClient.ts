import APIClient from './apiClient';
import {LimitDataType} from '../pages/performanceProfilePage/components/EditWeightBalanceProfileForm'

interface WeightBalanceEditlimits extends LimitDataType {
    sequence: number
}

interface WeightBalancelimits extends WeightBalanceEditlimits {
    id: number,
}

interface EditWeightAndBalanceProfileType {
    name: string;
    limits : WeightBalanceEditlimits[];
}

export interface WeightAndBalanceProfileType {
    id: number;
    name: string;
    limits : WeightBalancelimits[];
    created_at_utc: string;
    last_updated_utc: string;
}

const apiClient = new APIClient<
    EditWeightAndBalanceProfileType, 
    WeightAndBalanceProfileType
>("/aircraft-weight-balance-data/weight-balance-profile")

export default apiClient