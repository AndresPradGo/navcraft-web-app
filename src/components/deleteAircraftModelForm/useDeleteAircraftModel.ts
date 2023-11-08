import { useMutation, useQueryClient} from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { APIClientError } from '../../services/apiClient';
import apiClient, {PerformanceModelDataFromAPI} from '../../services/aircraftModelClient'
import errorToast from '../../utils/errorToest';


interface DeleteModelContext {
    previousData?: PerformanceModelDataFromAPI[]
}


const useDeleteAircraftModel = (onDelete: () => void) => {
    const queryClient = useQueryClient()
    return useMutation<string, APIClientError, number, DeleteModelContext>({
        mutationFn: modelId => apiClient.delete(`/${modelId}`),
        onMutate: modelId => {
            const previousData = queryClient.getQueryData<PerformanceModelDataFromAPI[]>(['aircraftModel', 'list'])
            queryClient.setQueryData<PerformanceModelDataFromAPI[]>(
                ['aircraftModel', 'list'], 
                currentData => (
                    currentData ? currentData.filter(item => item.id !== modelId) : []
                )
            )
            return { previousData }
        },
        onSuccess: (_, modelId) => {
            queryClient.invalidateQueries({queryKey: ['aircraftModel', 'list']})
            toast.info(`Aircraft Model with ID ${modelId} has been deleted.`, {
                position: "top-center",
                autoClose: 10000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            onDelete()
        },
        onError: (error, _, context) => {
            errorToast(error)
            if (!context) return
            queryClient.setQueryData<PerformanceModelDataFromAPI[]>(
                ['aircraftModel', 'list'], 
                context.previousData
            )
        }
    })
}

export default useDeleteAircraftModel