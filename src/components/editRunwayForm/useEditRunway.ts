
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { APIClientError } from '../../services/apiClient';
import { AerodromeDataFromAPI } from '../../services/userAerodromeClient';
import apiClient, {EditRunwayData, RunwayData} from '../../services/runwayClient'
import errorToast from '../../utils/errorToest';


interface EditRunwayDataWithIdAndSurface extends EditRunwayData {
    id: number;
    surface: string;
}

interface AerodromeContext {
    previousAerodromeData?: AerodromeDataFromAPI 
    previousRunwaysData?: RunwayData[],
}


const useEditRunway = (fromAerodrome: boolean) => {
    const queryClient = useQueryClient()
    return useMutation<RunwayData, APIClientError, EditRunwayDataWithIdAndSurface, AerodromeContext>({
        mutationFn: (data) => {
            const runwayData = {
                length_ft: data.length_ft,
                landing_length_ft: data.landing_length_ft,
                intersection_departure_length_ft: data.intersection_departure_length_ft,
                number: data.number,
                position: data.position,
                surface_id: data.surface_id,
                aerodrome_id: data.aerodrome_id
            } as EditRunwayData

            if(data.id) return apiClient.edit(runwayData, `/${data.id}`)
            return apiClient.post(runwayData)
        },
        onMutate: (newData) => {
            if (fromAerodrome) {
                const previousAerodromeData = queryClient.getQueryData<AerodromeDataFromAPI>(['aerodrome', newData.aerodrome_id])
    
                queryClient.setQueryData<AerodromeDataFromAPI>(
                    ['aerodrome', newData.aerodrome_id], 
                    currentData => {
                        const runways = currentData?.runways || []
    
                        if (newData.id !== 0) {
                            return  currentData ? {...currentData, runways: runways.map(item => {
                                if(item.id === newData.id) {
                                    return {
                                        id: newData.id,
                                        number: newData.number,
                                        position: newData.position,
                                        length_ft: newData.length_ft,
                                        landing_length_ft: newData.landing_length_ft,
                                        intersection_departure_length_ft: newData.intersection_departure_length_ft,
                                        surface: newData.surface,
                                        surface_id: newData.surface_id
                                    }
                                }
                                return item
                            })}: undefined
                        }
                        return currentData ? {...currentData, runways: [...currentData.runways, {
                            id: newData.id,
                            number: newData.number,
                            position: newData.position,
                            length_ft: newData.length_ft,
                            landing_length_ft: newData.landing_length_ft,
                            intersection_departure_length_ft: newData.intersection_departure_length_ft,
                            surface: newData.surface,
                            surface_id: newData.surface_id
                        }]} : undefined
    
                    }
                )
                return { previousAerodromeData }
            }
            const previousRunwaysData = queryClient.getQueryData<RunwayData[]>(['runways'])
            const aerodrome = previousRunwaysData?.find(item => item.aerodrome_id === newData.aerodrome_id)?.aerodrome || ""
            queryClient.setQueryData<RunwayData[]>(
                ['runways'],
                currentData => {
                    if (newData.id !== 0) {
                       return currentData?.map(item => {
                        if(item.id === newData.id) {
                            return ({
                                aerodrome: aerodrome,
                                aerodrome_id: newData.aerodrome_id,
                                id: newData.id,
                                number: newData.number,
                                position: newData.position,
                                length_ft: newData.length_ft,
                                landing_length_ft: newData.landing_length_ft,
                                intersection_departure_length_ft: newData.intersection_departure_length_ft,
                                surface: newData.surface,
                                surface_id: newData.surface_id
                            })
                        }
                        return item
                       })
                    }
                    const newRunway = {
                        aerodrome: aerodrome,
                        aerodrome_id: newData.aerodrome_id,
                        id: newData.id,
                        number: newData.number,
                        position: newData.position,
                        length_ft: newData.length_ft,
                        landing_length_ft: newData.landing_length_ft,
                        intersection_departure_length_ft: newData.intersection_departure_length_ft,
                        surface: newData.surface,
                        surface_id: newData.surface_id
                    }
                    return (currentData ? [...currentData, newRunway] : [newRunway])
                }
            )
                
            return { previousRunwaysData }

        },
        onSuccess: (savedData, newData, _) => {
            const runway = `${savedData.number < 10 ? "0" : ""}${savedData.number}${savedData.position || ""}`
            toast.success(newData.id !== 0 
                ? `"Runway ${runway}" as been updated.` 
                : `"Runway ${runway}" has been added to ${savedData.aerodrome || "the Aerodrome"}` , {
                position: "top-center",
                autoClose: 10000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });

            if (fromAerodrome) {
                queryClient.setQueryData<AerodromeDataFromAPI>(
                    ['aerodrome', newData.aerodrome_id], 
                    (aerodrome) => (aerodrome? {...aerodrome, runways: aerodrome.runways?.map(item => {
                        if (item.id === savedData.id || newData.id === item.id) {
                            return {
                                id: savedData.id,
                                number: savedData.number,
                                position: savedData.position,
                                length_ft: savedData.length_ft,
                                landing_length_ft: savedData.landing_length_ft,
                                intersection_departure_length_ft: savedData.intersection_departure_length_ft,
                                surface: savedData.surface,
                                surface_id: savedData.surface_id
                            }
                        }
                        return item
                    })}: undefined)
                )
            } else {
                queryClient.setQueryData<RunwayData[]>(
                    ['runways'],
                    currentData => (currentData?.map(item => {
                        if (item.id === savedData.id || newData.id === item.id) {
                            return {
                                id: savedData.id,
                                number: savedData.number,
                                position: savedData.position,
                                length_ft: savedData.length_ft,
                                landing_length_ft: savedData.landing_length_ft,
                                intersection_departure_length_ft: savedData.intersection_departure_length_ft,
                                surface: savedData.surface,
                                surface_id: savedData.surface_id,
                                aerodrome: savedData.aerodrome,
                                aerodrome_id: savedData.aerodrome_id,
                            }
                        }
                        return item
                    }) || [])
                )

            }
        },
        onError: (error, newData, context) => {
            errorToast(error)
            if (context?.previousAerodromeData) {
                queryClient.setQueryData<AerodromeDataFromAPI>(
                    ['aerodrome', newData.aerodrome_id], 
                    context.previousAerodromeData
                )
            } else if (context?.previousRunwaysData) {
                queryClient.setQueryData<RunwayData[]>(
                    ['runways'], 
                    context.previousRunwaysData
                )
            }
        }
    })

}

export default useEditRunway
