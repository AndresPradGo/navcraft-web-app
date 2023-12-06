import { useMutation, useQueryClient} from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { APIClientError } from '../../services/apiClient';
import apiClient, {WaypointDataFromAPI} from '../../services/userWaypointClient'
import errorToast from '../../utils/errorToast';


interface DeleteWaypointData {
    name: string;
    id: number;
}

interface DeleteWaypointContext {
    previusData?: WaypointDataFromAPI[]
}

const useDeleteUserWaypoint = () => {
    const queryClient = useQueryClient()
    return useMutation<string, APIClientError, DeleteWaypointData, DeleteWaypointContext>({
        mutationFn: (data: DeleteWaypointData) => apiClient.delete(`/${data.id}`),
        onMutate: (data) => {
            const previusData = queryClient.getQueryData<WaypointDataFromAPI[]>(['waypoints', 'user'])
            queryClient.setQueryData<WaypointDataFromAPI[]>(
                ['waypoints', 'user'], 
                currentData => (
                    currentData ? currentData.filter(item => item.id !== data.id) : []
                )
            )
            return { previusData }
        },
        onSuccess: (_, data) => {
            queryClient.invalidateQueries({queryKey: ['waypoints', 'user']})
            toast.success(`"${data.name}" has been deleted from your waypoints' list.`, {
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
            errorToast(error);
            if (!context) return
            queryClient.setQueryData<WaypointDataFromAPI[]>(
                ['waypoints', 'user'], 
                context.previusData
            )
        }
    })
}

export default useDeleteUserWaypoint