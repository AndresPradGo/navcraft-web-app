import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import apiClient, 
{
    PerformanceModelDataFromAPI, 
    CompletePerformanceModelDataFromAPI,
    EditPerformanceModelData
} from '../../services/aircraftModelClient'
import { APIClientError } from '../../services/apiClient';
import errorToast from '../../utils/errorToast';
import getUTCNowString from '../../utils/getUTCNowString';



interface AircraftContext {
    previusData?: PerformanceModelDataFromAPI[]
}

const useAddAircraftModel = () => {
    const queryClient = useQueryClient()
    return useMutation<PerformanceModelDataFromAPI, APIClientError, EditPerformanceModelData, AircraftContext>({
        mutationFn: (data) => apiClient.postAndPreProcess<CompletePerformanceModelDataFromAPI>(
            data,
            (dataFromApi) => ({
                id: dataFromApi.id,
                is_complete: dataFromApi.is_complete,
                fuel_type_id: dataFromApi.fuel_type_id,
                performance_profile_name: dataFromApi.performance_profile_name,
                created_at_utc: dataFromApi.created_at_utc,
                last_updated_utc: dataFromApi.last_updated_utc
            })
            ),
        onMutate: newData => {
            const previusData = queryClient.getQueryData<PerformanceModelDataFromAPI[]>(['aircraftModel', 'list']) 
            queryClient.setQueryData<PerformanceModelDataFromAPI[]>(['aircraftModel', 'list'], currentData => {
                return (
                    currentData 
                        ? [
                            {
                                ...newData, 
                                created_at_utc: getUTCNowString(), 
                                last_updated_utc: getUTCNowString()
                            }, 
                            ...currentData
                        ] 
                        : [
                            {
                                ...newData, 
                                created_at_utc: getUTCNowString(), 
                                last_updated_utc: getUTCNowString()
                            }
                        ]
                )
            })
            return {previusData}
        },
        onSuccess: (savedData) => {
            toast.success(`New Model has been added. ID: ${savedData.id}.`, {
                position: "top-center",
                autoClose: 10000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });

            queryClient.setQueryData<PerformanceModelDataFromAPI[]>(['aircraftModel', 'list'], currentData => {
                return (
                    currentData?.map(item => {
                        if(item.id === 0) {
                            return savedData
                        }
                        return item
                    }) || [savedData]
                )
            })
        },
        onError: (error, _, context) => {
            errorToast(error)
            if (context?.previusData) {
                queryClient.setQueryData<PerformanceModelDataFromAPI[]>(
                    ['aircraftModel', 'list'], 
                    context.previusData
                )
            }
        }
    })
}

export default useAddAircraftModel