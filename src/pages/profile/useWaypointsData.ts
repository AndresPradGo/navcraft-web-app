import { useQuery } from "@tanstack/react-query";

import APIClient, {APIClientError} from '../../services/apiClient';
import {WaypointDataFromAPI} from './entities'
import useAuth from '../login/useAuth';

interface EditWaypointData {
    code: string,
    name: string,
    lat_degrees: number,
    lat_minutes: number,
    lat_seconds: number,
    lat_direction: string,
    lon_degrees: number,
    lon_minutes: number,
    lon_seconds: number,
    lon_direction: string,
    magnetic_variation: number,
}

interface WaypointData {
    id: number,
    code: string,
    name: string,
    latitude: string,
    longitude: string,
    variation: string
}

const apiClient = new APIClient<EditWaypointData, WaypointData>("/waypoints/user")

const useWaypointsData = () => {
    const user = useAuth();
    return useQuery<WaypointData[], APIClientError>({
        queryKey: ['profile', 'wypoints'],
        queryFn: () => {
            return apiClient.getAndPreProcessAll<WaypointDataFromAPI>(
                user? user.authorization: "",
                (data: WaypointDataFromAPI[]) => (data.map(w => {
                    return ({
                        id: w.id,
                        code: w.code,
                        name: w.name,
                        latitude: `${w.lat_direction}${w.lat_degrees}\u00B0${w.lat_minutes}'${w.lat_seconds}"`,
                        longitude: `${w.lon_direction}${w.lon_degrees}\u00B0${w.lon_minutes}'${w.lon_seconds}"`,
                        variation: `${Math.abs(w.magnetic_variation)}${w.magnetic_variation < 0 ? "E" : "W"}`
                    })
                }))
            )
        }
    })
}

export default useWaypointsData



