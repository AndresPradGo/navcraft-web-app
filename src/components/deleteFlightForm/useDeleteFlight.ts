import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { APIClientError } from '../../services/apiClient';
import apiClient, {FlightDataFromApi} from '../../services/flightsClient'
import errorToast from '../../utils/errorToast';

interface FlightContext {
    previousData?: FlightDataFromApi[]
}

interface DeleteData {
    id: number
    route: string
}

const useDeleteFlight = (onDelete: () => void) => {
    const queryClient = useQueryClient()
    return useMutation<string, APIClientError, DeleteData, FlightContext>({
        mutationFn: data => apiClient.delete(`/${data.id}`),
        onMutate: newData => {
            const previousData = queryClient.getQueryData<FlightDataFromApi[]>(['flights', 'all'])
            queryClient.setQueryData<FlightDataFromApi[]>(
                ['flights', 'all'], 
                currentData => (
                    currentData ? currentData.filter(flight => flight.id !== newData.id) : []
                )
            )
            return { previousData }
        },
        onSuccess: (_, newData) => {
            toast.success(`The flight ${newData.route} has been deleted successfully.`, {
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
            if (context?.previousData) {
                queryClient.setQueryData<FlightDataFromApi[]>(
                    ['flights', 'all'], 
                    context.previousData
                )
            }
        }
    })
}

export default useDeleteFlight