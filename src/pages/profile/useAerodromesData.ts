import { useQuery } from "@tanstack/react-query";

import APIClient, {APIClientError} from '../../services/apiClient';
import {AerodromeDataFromAPI} from './entities'
import useAuth from '../login/useAuth';

interface EditAerodromeData {
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
    elevation: number
}

interface AerodromeData {
    id: number,
    code: string,
    name: string,
    latitude: string,
    longitude: string,
    elevation: number,
    runways: string,
    variation: string,
}

const apiClient = new APIClient<EditAerodromeData, AerodromeData>("/waypoints/aerodromes")

const useWaypointsData = () => {
    const user = useAuth();
    return useQuery<AerodromeData[], APIClientError>({
        queryKey: ['profile', 'aerodromes'],
        queryFn: () => {
            return apiClient.getAndPreProcessAll<AerodromeDataFromAPI>(
                user? user.authorization: "",
                (data: AerodromeDataFromAPI[]) => {
                    const privateAerodromes = data.filter(a => a.registered)
                    return (privateAerodromes.map(a => ({
                        id: a.id,
                        code: a.code,
                        name: a.name,
                        latitude: `${a.lat_direction}${a.lat_degrees}\u00B0${a.lat_minutes}'${a.lat_seconds}"`,
                        longitude: `${a.lon_direction}${a.lon_degrees}\u00B0${a.lon_minutes}'${a.lon_seconds}"`,
                        elevation: a.elevation_ft,
                        runways: a.runways.map((r) => `${r.number.toString().padStart(2,'0')}${r.position ? r.position : ''}`).join(', '),
                        variation: `${Math.abs(a.magnetic_variation)}\u00B0${a.magnetic_variation < 0 ? "E" : "W"}`,
                    })))
                }
            )
        }
    })
}

export default useWaypointsData



