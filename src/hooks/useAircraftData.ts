import { useQuery } from "@tanstack/react-query";

import {APIClientError} from '../services/apiClient';
import apiClient, {AircraftDataFromAPI} from '../services/aircraftClient';


const useAircraftDataList = (id: number) => {
    return useQuery<AircraftDataFromAPI, APIClientError>({
        queryKey: ['aircraft', id],
        queryFn: () => apiClient.getAndPreProcess<AircraftDataFromAPI[]>(
            dataList => dataList[0],
            `?aircraft_id=${id}`
        )
    })
}

export default useAircraftDataList