
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';


import APIClient, { APIClientError } from '../../services/apiClient';
import { RunwayDataFromAPI, AerodromeDataFromAPI } from '../../services/userAerodromeClient';

interface EditRunwayData {
    length_ft: number,
    landing_length_ft?: number,
    intersection_departure_length_ft?: number,
    number: number,
    position?: "R" | "L" | "C",
    surface_id: number,
    aerodrome_id: number
}

interface EditRunwayDataWithIdAndSurface extends EditRunwayData {
    id: number;
    surface: string;
}

interface RunwayData extends RunwayDataFromAPI {
    aerodrome: string;
    aerodrome_id: number;
}

interface AerodromeContext {
    previusData?: AerodromeDataFromAPI
}

export const apiClient = new APIClient<EditRunwayData, RunwayData>("/runways")

const useEditRunway = () => {
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
            const previusData = queryClient.getQueryData<AerodromeDataFromAPI>(['aerodrome', newData.aerodrome_id])

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
            return { previusData }
        },
        onSuccess: (savedData, newData, context) => {
            const runway = `${savedData.number < 10 ? "0" : ""}${savedData.number}${savedData.position || ""}`
            toast.success(newData.id !== 0 
                ? `"Runway ${runway}" as been updated.` 
                : `"Runway ${runway}" has been added to ${context?.previusData?.name || "the Aerodrome"}` , {
                position: "top-center",
                autoClose: 10000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });

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
        },
        onError: (error, newData, context) => {
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
            queryClient.setQueryData<AerodromeDataFromAPI>(
                ['aerodrome', newData.aerodrome_id], 
                context.previusData
            )
        }
    })

}

export default useEditRunway
