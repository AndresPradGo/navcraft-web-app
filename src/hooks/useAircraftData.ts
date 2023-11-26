import { useQuery } from "@tanstack/react-query";

import {APIClientError} from '../services/apiClient';
import apiClient, {AircraftDataFromAPI} from '../services/aircraftClient';


const useAircraftData = (id: number) => {
    return useQuery<AircraftDataFromAPI, APIClientError>({
        queryKey: ['aircraft', id],
        queryFn: () => id ? apiClient.getAndPreProcess<AircraftDataFromAPI[]>(
            dataList => dataList[0],
            `?aircraft_id=${id}`
        ) : {
            id: 0,
            profiles: [],
            created_at_utc: "",
            last_updated_utc: "",
            make: "",
            model: "",
            abbreviation: "",
            registration: "",
        }
    })
}

export default useAircraftData