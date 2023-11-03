import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { APIClientError } from '../../services/apiClient';
import {WaypointDataFromForm} from './EditVfrWaypointForm';
import apiClient, {EditVfrWaypointData, VfrWaypointDataFromAPI} from '../../services/vfrWaypointClient';
import getUTCNowString from '../../utils/getUTCNowString'
import errorToast from '../../utils/errorToest';


interface WaypointContext {
    previusData?: VfrWaypointDataFromAPI[]
}

const useEditVfrWaypoint = () => {
    const queryClient = useQueryClient()
    return useMutation<VfrWaypointDataFromAPI, APIClientError, WaypointDataFromForm, WaypointContext>({
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
                hidden: data.hide
            } as EditVfrWaypointData
            if (data.id !== 0) return apiClient.edit(waypointData, `admin-waypoints/vfr/${data.id}`)
            return apiClient.post(waypointData, 'admin-waypoints/vfr')
        },
        onMutate: (newData) => {
            const previusData = queryClient.getQueryData<VfrWaypointDataFromAPI[]>(['waypoints', 'vfr'])
            queryClient.setQueryData<VfrWaypointDataFromAPI[]>(
                ['waypoints', 'vfr'], 
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
                        last_updated_utc: utcNow,
                        hidden: newData.hide
                    } as VfrWaypointDataFromAPI
                    if(newData.id !== 0){
                        const currentWaypoint = currentData?.find(item => item.id == newData.id)
                        newWaypointInCacheFormat.created_at_utc = currentWaypoint?.created_at_utc || utcNow
                        return currentData?.map(item => {
                            if (item.id === newData.id)
                                return newWaypointInCacheFormat
                            return item
                        })
                    }
                    newWaypointInCacheFormat.created_at_utc = utcNow;
                    return [ newWaypointInCacheFormat, ...(currentData || []) ];
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

            queryClient.setQueryData<VfrWaypointDataFromAPI[]>(
                ['waypoints', 'vfr'], 
                (waypoints) => ( waypoints?.map(item => {
                    if (item.id === savedData.id || newData.id === item.id)
                        return savedData
                    return item
                }))
            )
        },
        onError: (error, _, context) => {
            errorToast(error)
            if (!context?.previusData) return
            queryClient.setQueryData<VfrWaypointDataFromAPI[]>(
                ['waypoints', 'vfr'], 
                context.previusData
            )
        }
    })
}

export default useEditVfrWaypoint