import { useMutation, useQueryClient} from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { APIClientError } from '../../services/apiClient';
import apiClient, {PerformanceModelDataFromAPI} from '../../services/aircraftModelClient'
import errorToast from '../../utils/errorToest';


interface DeleteAircraftData {
    id: number;
}

interface DeleteAircraftContext {
    previusData?: PerformanceModelDataFromAPI[]
}


const useDeleteAircraftModel = (onDelete: () => void) => {
    const queryClient = useQueryClient()
    return useMutation<string, APIClientError, DeleteAircraftData, DeleteAircraftContext>({
        mutationFn: data => apiClient.delete(`/${data.id}`),
        onMutate: data => {
            const previusData = queryClient.getQueryData<PerformanceModelDataFromAPI[]>(['aircraftModel', 'list'])
            queryClient.setQueryData<PerformanceModelDataFromAPI[]>(
                ['aircraftModel', 'list'], 
                currentData => (
                    currentData ? currentData.filter(item => item.id !== data.id) : []
                )
            )
            return { previusData }
        },
        onSuccess: (_, data) => {
            queryClient.invalidateQueries({queryKey: ['aircraftModel', 'list']})
            toast.info(`Aircraft Model with ID ${data.id} has been deleted.`, {
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
                context.previusData
            )
        }
    })
}

export default useDeleteAircraftModel