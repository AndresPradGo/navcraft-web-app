import { useQuery } from "@tanstack/react-query";

import APIClient, {APIClientError} from '../services/apiClient';

export interface FuelTypeData {
    name: string
    id: number
    density_lb_gal: number
}


const apiClient = new APIClient<string, FuelTypeData>("/aircraft-models/fuel-type")

const useFuelTypes = () => {
    return useQuery<FuelTypeData[], APIClientError>({
        queryKey: ['fuelTypes'],
        queryFn: () => apiClient.getAll()
    })
}

export default useFuelTypes



