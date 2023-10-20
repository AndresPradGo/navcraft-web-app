import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { APIClientError } from '../../services/apiClient';
import {FormDataType} from './EditWaypointForm';
import apiClient, {EditWaypointData, WaypointDataFromAPI} from '../../services/waypointClient';

interface WaypointFormDataWithId extends FormDataType {
    id: number;
}

interface WaypointContext {
    previusData?: WaypointDataFromAPI[]
}

function getUTCNowString(): string {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
    const day = String(now.getUTCDate()).padStart(2, '0');
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const seconds = String(now.getUTCSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
  }  

const useEditWaypoint = () => {
    const queryClient = useQueryClient()
    return useMutation<WaypointDataFromAPI, APIClientError, WaypointFormDataWithId, WaypointContext>({
        mutationFn: (data) => {
            const waypointData = {
                code: data.code,
                name: data.name,
                lat_degrees: data.lat_degrees,
                lat_minutes: data.lat_minutes,
                lat_seconds: data.lat_seconds,
                lat_direction: data.lat_direction === "South" ? "S" : "N",
                lon_degrees: data.lon_degrees,
                lon_minutes: data.lon_minutes,
                lon_seconds: data.lon_seconds,
                lon_direction: data.lon_direction === "East" ? "E" : "W",
                magnetic_variation: data.magnetic_variation ? data.magnetic_variation : undefined,
            } as EditWaypointData
            if (data.id !== 0) return apiClient.edit(waypointData, `/${data.id}`)
            return apiClient.post(waypointData)
        },
        onMutate: (newData) => {
            const previusData = queryClient.getQueryData<WaypointDataFromAPI[]>(['waypoints', 'user'])

            queryClient.setQueryData<WaypointDataFromAPI[]>(
                ['waypoints', 'user'], 
                currentData => {
                    const utcNow = getUTCNowString()
                    const newWaypointInCacheFormat = {
                        id: newData.id,
                        code: newData.code,
                        name: newData.name, 
                        lat_degrees: newData.lat_degrees,
                        lat_minutes: newData.lat_minutes,
                        lat_seconds: newData.lat_seconds,
                        lat_direction: newData.lat_direction === "South" ? "S" : "N",
                        lon_degrees: newData.lon_degrees,
                        lon_minutes: newData.lon_minutes,
                        lon_seconds: newData.lon_seconds,
                        lon_direction: newData.lon_direction === "East" ? "E" : "W",
                        magnetic_variation: newData.magnetic_variation,
                        created_at_utc: utcNow,
                        last_updated_utc: utcNow,
                    } as WaypointDataFromAPI
                    if(newData.id !== 0){
                        return currentData?.map(item => {
                            if (item.id === newData.id)
                                return newWaypointInCacheFormat
                            return item
                        })
                    }
                    return [ newWaypointInCacheFormat, ...(currentData || []) ]
                }
            )

            return { previusData }
        },
        onSuccess: (savedData, newData) => {
            toast.success(newData.id !== 0 
                ? `"${savedData.name}" waypoint has been updated.` 
                : `"${savedData.name}" has been added to your Waypoints.` , {
                position: "top-center",
                autoClose: 10000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });

            queryClient.setQueryData<WaypointDataFromAPI[]>(
                ['waypoints', 'user'], 
                (passengers) => ( passengers?.map(item => {
                    if (
                        (newData.id !== 0 && item.id === savedData.id) 
                        || ((newData.id === 0 && item.id === 0))
                    ) {
                        return savedData
                    }
                    return item
                }))
            )
        },
        onError: (error, _, context) => {
            if(error.response) {
                if (typeof error.response.data.detail === "string")
                    toast.error(error.response.data.detail, {
                        position: "top-center",
                        autoClose: 10000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    });
            } else toast.error("Something went wrong, please try again later.", {
                    position: "top-center",
                    autoClose: 10000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            
            if (!context?.previusData) return
            queryClient.setQueryData<WaypointDataFromAPI[]>(
                ['waypoints', 'user'], 
                context.previusData
            )
        }
    })
}

export default useEditWaypoint