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

const apiClient = new APIClient<number, PerformanceProfileBaseData>("/aircraft/performance-profile/make-preferred")


const useSelectPerformanceProfile = (aircraftId: number) => {
    const queryClient = useQueryClient()
  return useMutation<PerformanceProfileBaseData, APIClientError, number, AircraftContext>({
    mutationFn: id => apiClient.editAndPreProcess<CompletePerformanceProfileDataFromAPI>(
        id, 
        (dataFromApi) => ({
            id: dataFromApi.id,
            is_complete: dataFromApi.is_complete,
            fuel_type_id: dataFromApi.fuel_type_id,
            performance_profile_name: dataFromApi.performance_profile_name,
            is_preferred: dataFromApi.is_preferred,
            created_at_utc: dataFromApi.created_at_utc,
            last_updated_utc: dataFromApi.last_updated_utc
        }),
        `/${id}`
    ),
    onMutate: id => {
        const previusData = queryClient.getQueryData<AircraftDataFromAPI>(['aircraft', aircraftId]) 
        queryClient.setQueryData<AircraftDataFromAPI>(['aircraft', aircraftId], currentData => {
            return (currentData ? {
                ...currentData, 
                profiles: currentData.profiles.map(profile => (profile.id === id ? {
                    ...profile,
                    is_preferred: true,
                    last_updated_utc: getUTCNowString()
                } : profile.is_preferred ? {
                    ...profile,
                    is_preferred: false,
                    last_updated_utc: getUTCNowString()
                }: profile))
            }: undefined)
        })
        return {previusData}
    },
    onSuccess: (savedData) => {
        toast.success(`${savedData.performance_profile_name}, has been selected for flight-planning.`, {
            position: "top-center",
            autoClose: 10000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
        queryClient.invalidateQueries({queryKey: ['aircraft', aircraftId]})
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

export default useSelectPerformanceProfile