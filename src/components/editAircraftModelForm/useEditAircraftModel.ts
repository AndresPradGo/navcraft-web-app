import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { APIClientError } from '../../services/apiClient';
import apiClient, { 
    EditPerformanceModelData, 
    PerformanceModelDataFromAPI,
    CompletePerformanceModelDataFromAPI
} from '../../services/aircraftModelClient';
import errorToast from '../../utils/errorToast';
import getUTCNowString from '../../utils/getUTCNowString';


interface ModelContext {
    previusData?: PerformanceModelDataFromAPI
}

const useEditPerformanceProfile = (modelId: number) => {
    const queryClient = useQueryClient()
    return useMutation<PerformanceModelDataFromAPI, APIClientError, EditPerformanceModelData, ModelContext>({
        mutationFn: data => {
            return (apiClient.editAndPreProcess<CompletePerformanceModelDataFromAPI>(
                data,
                (dataFromApi) => ({
                    id: dataFromApi.id,
                    is_complete: dataFromApi.is_complete,
                    fuel_type_id: dataFromApi.fuel_type_id,
                    performance_profile_name: dataFromApi.performance_profile_name,
                    created_at_utc: dataFromApi.created_at_utc,
                    last_updated_utc: dataFromApi.last_updated_utc
                }),
                `/${data.id}`
            ))
        },
        onMutate: newData => {
            const previusData = queryClient.getQueryData<PerformanceModelDataFromAPI>(
                ['aircraftModel', modelId]
            ) 
            queryClient.setQueryData<PerformanceModelDataFromAPI>(
                ['aircraftModel', modelId], 
                currentData => {
                return (currentData ? {
                    ...currentData,
                    is_complete: newData.is_complete,
                    fuel_type_id: newData.fuel_type_id,
                    performance_profile_name: newData.performance_profile_name,
                    last_updated_utc: getUTCNowString()
                }: undefined)
            })
            return {previusData}
        },
        onSuccess: (savedData) => {
            toast.success(`Model "${savedData.performance_profile_name}", has been updated successfully.`, {
                position: "top-center",
                autoClose: 10000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            queryClient.setQueryData<PerformanceModelDataFromAPI>(
                ['aircraftModel', 
                modelId], () => savedData
            )
        },
        onError: (error, _, context) => {
            errorToast(error)
            if (context?.previusData) {
                queryClient.setQueryData<PerformanceModelDataFromAPI>(
                    ['aircraftModel', modelId], 
                    context.previusData
                )
            }
        }
    })
}

export default useEditPerformanceProfile