import { useMutation, useQueryClient} from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { APIClientError } from '../../services/apiClient';
import apiClient, {AerodromeDataFromAPI} from '../../services/userAerodromeClient'
import errorToast from '../../utils/errorToast';


interface DeleteAerodromeData {
    name: string;
    id: number;
}

interface DeleteAerodromeContext {
    previusData?: AerodromeDataFromAPI[]
}

const useDeleteUserAerodrome = (onDelete: () => void, key: "user" | "all") => {
    const queryClient = useQueryClient()
    return useMutation<string, APIClientError, DeleteAerodromeData, DeleteAerodromeContext>({
        mutationFn: (data: DeleteAerodromeData) => apiClient.delete(`/user/${data.id}`),
        onMutate: (data) => {
            const previusData = queryClient.getQueryData<AerodromeDataFromAPI[]>(['aerodromes', key])
            queryClient.setQueryData<AerodromeDataFromAPI[]>(
                ['aerodromes', key], 
                currentData => (
                    currentData ? currentData.filter(item => item.id !== data.id) : []
                )
            )
            return { previusData }
        },
        onSuccess: (_, data) => {
            queryClient.invalidateQueries({queryKey: ['aerodromes', key]})
            toast.success(`"${data.name}" has been deleted from your private aerodromes' list.`, {
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
            queryClient.setQueryData<AerodromeDataFromAPI[]>(
                ['aerodromes', key], 
                context.previusData
            )
        }
    })
}

export default useDeleteUserAerodrome