import { useMutation, useQueryClient} from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { APIClientError } from '../../services/apiClient';
import apiClient, {AerodromeDataFromAPI} from '../../services/userAerodromeClient'


interface DeleteAerodromeData {
    name: string;
    id: number;
}

interface DeleteAerodromeContext {
    previusData?: AerodromeDataFromAPI[]
}

const useDeleteUserAerodrome = () => {
    const queryClient = useQueryClient()
    return useMutation<string, APIClientError, DeleteAerodromeData, DeleteAerodromeContext>({
        mutationFn: (data: DeleteAerodromeData) => apiClient.delete(`/user/${data.id}`),
        onMutate: (data) => {
            const previusData = queryClient.getQueryData<AerodromeDataFromAPI[]>(['aerodromes', 'user'])
            queryClient.setQueryData<AerodromeDataFromAPI[]>(
                ['aerodromes', 'user'], 
                currentData => (
                    currentData ? currentData.filter(item => item.id !== data.id) : []
                )
            )
            return { previusData }
        },
        onSuccess: (_, data) => {
            queryClient.invalidateQueries({queryKey: ['aerodromes', 'user']})
            toast.info(`"${data.name}" has been deleted from your private aerodromes' list.`, {
                position: "top-center",
                autoClose: 10000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        },
        onError: (error, _, context) => {
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

            if (!context) return
            queryClient.setQueryData<AerodromeDataFromAPI[]>(
                ['aerodromes', 'user'], 
                context.previusData
            )
        }
    })
}

export default useDeleteUserAerodrome