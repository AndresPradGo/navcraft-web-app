import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import APIClient, { APIClientError } from '../../../services/apiClient';
import { 
    PerformanceProfileBaseData, 
    AircraftDataFromAPI, 
    CompletePerformanceProfileDataFromAPI 
} from '../../../services/aircraftClient';
import errorToast from '../../../utils/errorToast';
import getUTCNowString from '../../../utils/getUTCNowString';


interface AircraftContext {
    previusData?: AircraftDataFromAPI
}

interface AddProfileData {
    performance_profile_name: string;
    fuel_type_id: number;
}

interface AddProfileDataWithId {
    id: number;
    performance_profile_name: string;
    fuel_type_id: number;
}

const apiClient = new APIClient<AddProfileData, PerformanceProfileBaseData>("/aircraft/performance-profile")


const useEditPerformanceProfile = (aircraftId: number) => {
    const queryClient = useQueryClient()
    return useMutation<PerformanceProfileBaseData, APIClientError, AddProfileDataWithId, AircraftContext>({
        mutationFn: data => {
            return (apiClient.editAndPreProcess<CompletePerformanceProfileDataFromAPI>(
                {
                    performance_profile_name: data.performance_profile_name,
                    fuel_type_id: data.fuel_type_id,
                },
                (dataFromApi) => ({
                    id: dataFromApi.id,
                    is_complete: dataFromApi.is_complete,
                    fuel_type_id: dataFromApi.fuel_type_id,
                    performance_profile_name: dataFromApi.performance_profile_name,
                    is_preferred: dataFromApi.is_preferred,
                    created_at_utc: dataFromApi.created_at_utc,
                    last_updated_utc: dataFromApi.last_updated_utc
                }),
                `/${data.id}`
            ))
        },
        onMutate: newData => {
            const previusData = queryClient.getQueryData<AircraftDataFromAPI>(['aircraft', aircraftId]) 
            queryClient.setQueryData<AircraftDataFromAPI>(['aircraft', aircraftId], currentData => {
                return (currentData ? {
                    ...currentData, 
                    profiles: currentData.profiles.map(profile => (profile.id === newData.id ? {
                        id: newData.id,
                        is_preferred: profile.is_preferred,
                        is_complete: profile.is_complete,
                        fuel_type_id: newData.fuel_type_id,
                        performance_profile_name: newData.performance_profile_name,
                        created_at_utc: profile.created_at_utc,
                        last_updated_utc: getUTCNowString()
                    } : profile))
                }: undefined)
            })
            return {previusData}
        },
        onSuccess: (savedData) => {
            toast.success(`${savedData.performance_profile_name} has been updated successfully.`, {
                position: "top-center",
                autoClose: 10000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            queryClient.setQueryData<AircraftDataFromAPI>(['aircraft', aircraftId], currentData => {
                return (currentData ? {
                    ...currentData, 
                    profiles: currentData.profiles.map(item => {
                        if(item.id === savedData.id) {
                            return savedData
                        }
                        return item
                    })
                }: undefined)
            })
        },
        onError: (error, _, context) => {
            errorToast(error)
            if (context?.previusData) {
                queryClient.setQueryData<AircraftDataFromAPI>(
                    ['aircraft', aircraftId], 
                    context.previusData
                )
            }
        }
    })
}

export default useEditPerformanceProfile