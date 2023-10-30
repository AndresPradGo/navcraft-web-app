import { useMutation, useQueryClient} from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { APIClientError } from '../../services/apiClient';
import apiClient, {OfficialAerodromeDataFromAPI} from '../../services/officialAerodromeClient'


interface DeleteAerodromeData {
    name: string;
    id: number;
}

interface DeleteAerodromeContext {
    previusData?: OfficialAerodromeDataFromAPI[]
}

const useDeleteOfficialAerodrome = (onDelete: () => void) => {
    const queryClient = useQueryClient()
    return useMutation<string, APIClientError, DeleteAerodromeData, DeleteAerodromeContext>({
        mutationFn: (data: DeleteAerodromeData) => apiClient.delete(`admin-waypoints/registered/${data.id}`),
        onMutate: (data) => {
            const previusData = queryClient.getQueryData<OfficialAerodromeDataFromAPI[]>(['aerodromes', 'all'])
            queryClient.setQueryData<OfficialAerodromeDataFromAPI[]>(
                ['aerodromes', 'all'], 
                currentData => (
                    currentData ? currentData.filter(item => item.id !== data.id) : []
                )
            )
            return { previusData }
        },
        onSuccess: (_, data) => {
            queryClient.invalidateQueries({queryKey: ['aerodromes', 'all']})
            toast.info(`"${data.name}" has been deleted from the official aerodromes' list.`, {
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
            queryClient.setQueryData<OfficialAerodromeDataFromAPI[]>(
                ['aerodromes', 'all'], 
                context.previusData
            )
        }
    })
}

export default useDeleteOfficialAerodrome