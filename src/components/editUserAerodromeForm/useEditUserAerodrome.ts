import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { APIClientError } from '../../services/apiClient';
import {AerodromeDataFromForm} from './EditUserAerodromeForm';
import apiClient, {EditAerodromeData, AerodromeDataFromAPI} from '../../services/userAerodromeClient';
import getUTCNowString from '../../utils/getUTCNowString'
import errorToast from '../../utils/errorToast';

interface AerodromeContext {
    previusData?: AerodromeDataFromAPI
    previusDataArray?: AerodromeDataFromAPI[]
}

const useEditUserAerodrome = (key: "user" | "all") => {
    const queryClient = useQueryClient()
    return useMutation<AerodromeDataFromAPI, APIClientError, AerodromeDataFromForm, AerodromeContext>({
        mutationFn: (data) => {
            const aerodromeData = {
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
                elevation_ft: data.elevation_ft,
                status: data.status
            } as EditAerodromeData
            if (data.id !== 0) return apiClient.edit(aerodromeData, `/private-aerodrome/${data.id}`)
            return apiClient.post(aerodromeData, "/private-aerodrome")
        },
        onMutate: (newData) => {
            const aerodromeId = newData.id
            const previusData = newData.id 
                ? queryClient.getQueryData<AerodromeDataFromAPI>(['aerodrome', aerodromeId]) 
                : undefined
            const previusDataArray = newData.id 
                ? undefined
                : queryClient.getQueryData<AerodromeDataFromAPI[]>(['aerodromes', key])
         
            const utcNow = getUTCNowString()
            const newAerodromeInCacheFormat = {
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
                elevation_ft: newData.elevation_ft,
                hidden: false,
                status: "Private",
                registered: false,
            } as AerodromeDataFromAPI

            if (aerodromeId !== 0) {
                queryClient.setQueryData<AerodromeDataFromAPI>(
                    ['aerodrome', aerodromeId],
                    currentData => {
                        newAerodromeInCacheFormat.created_at_utc = currentData?.created_at_utc || utcNow
                        newAerodromeInCacheFormat.runways = currentData?.runways || []
                        return newAerodromeInCacheFormat
                    }
                )
            } else {
                queryClient.setQueryData<AerodromeDataFromAPI[]>(
                    ['aerodromes', key], 
                    currentData => {
                        newAerodromeInCacheFormat.created_at_utc = utcNow
                        newAerodromeInCacheFormat.runways = []
                        return [ newAerodromeInCacheFormat, ...(currentData || []) ]
                    }
                )
            }

            return { previusData, previusDataArray  }
        },
        onSuccess: (savedData, newData) => {
            toast.success(newData.id !== 0 
                ? `"${savedData.name}" aerodrome has been updated.` 
                : `"${savedData.name}" has been added to your Private Aerodromes.` , {
                position: "top-center",
                autoClose: 10000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });

            if (newData.id !== 0) {
                queryClient.setQueryData<AerodromeDataFromAPI>(
                    ['aerodrome', savedData.id], 
                    (aerodrome) => ({
                                ...savedData,
                                hidden: !!aerodrome?.hidden,
                                runways: aerodrome?.runways || []
                            })
                )
            } else {
                queryClient.setQueryData<AerodromeDataFromAPI[]>(
                    ['aerodromes', key], 
                    (aerodromes) => ( aerodromes?.map(item => {
                        if (item.id === savedData.id || newData.id === item.id) {
                            return {
                                ...savedData,
                                hidden: item.hidden,
                                runways: item.runways
                            }
                        }
                        return item
                    }))
                )
            }

        },
        onError: (error, newData, context) => {
            errorToast(error)
            if (newData.id !== 0 && context?.previusData) {
                queryClient.setQueryData<AerodromeDataFromAPI>(
                    ['aerodrome', newData.id], 
                    context.previusData
                )
            } else if (context?.previusDataArray) {
                queryClient.setQueryData<AerodromeDataFromAPI[]>(
                    ['aerodromes', key], 
                    context.previusDataArray
                )
            }
        }
    })
}

export default useEditUserAerodrome