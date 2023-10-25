import { useQuery } from "@tanstack/react-query";

import APIClient, {APIClientError} from '../services/apiClient';

interface RunwaySurfaceData {
    surface: string
    id: number
}


const apiClient = new APIClient<string, RunwaySurfaceData>("/runways/surface")

const useRunwaySurfaces = () => {
    return useQuery<RunwaySurfaceData[], APIClientError>({
        queryKey: ['runwaySurface'],
        queryFn: () => apiClient.getAll("s")
    })
}

export default useRunwaySurfaces



