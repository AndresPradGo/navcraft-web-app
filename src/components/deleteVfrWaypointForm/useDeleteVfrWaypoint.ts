import { useMutation, useQueryClient} from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { APIClientError } from '../../services/apiClient';
import apiClient, {VfrWaypointDataFromAPI} from '../../services/vfrWaypointClient'


interface DeleteWaypointData {
    name: string;
    id: number;
}

interface DeleteWaypointContext {
    previusData?: VfrWaypointDataFromAPI[]
}

const useDeleteVfrWaypoint = () => {
    const queryClient = useQueryClient()
    return useMutation<string, APIClientError, DeleteWaypointData, DeleteWaypointContext>({
        mutationFn: (data: DeleteWaypointData) => apiClient.delete(`admin-waypoints/registered/${data.id}`),
        onMutate: (data) => {
            const previusData = queryClient.getQueryData<VfrWaypointDataFromAPI[]>(['waypoints', 'vfr'])
            queryClient.setQueryData<VfrWaypointDataFromAPI[]>(
                ['waypoints', 'vfr'], 
                currentData => (
                    currentData ? currentData.filter(item => item.id !== data.id) : []
                )
            )
            return { previusData }
        },
        onSuccess: (_, data) => {
            queryClient.invalidateQueries({queryKey: ['waypoints', 'vfr']})
            toast.info(`"${data.name}" has been deleted from the official VFR waypoints' list.`, {
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
            queryClient.setQueryData<VfrWaypointDataFromAPI[]>(
                ['waypoints', 'vfr'], 
                context.previusData
            )
        }
    })
}

export default useDeleteVfrWaypoint