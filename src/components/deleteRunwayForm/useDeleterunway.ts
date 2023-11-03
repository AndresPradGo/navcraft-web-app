import { useMutation, useQueryClient} from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { APIClientError } from '../../services/apiClient';
import apiClient, {RunwayData} from '../../services/runwayClient'
import { AerodromeDataFromAPI} from '../../services/userAerodromeClient';
import errorToast from '../../utils/errorToest';


interface DeleteRunwayData {
    name: string;
    id: number;
    aerodrome_id: number;
}

interface AerodromeContext {
    previousAerodromeData?: AerodromeDataFromAPI 
    previousRunwaysData?: RunwayData[],
}

const useDeleterunway = (fromAerodrome: boolean) => {
    const queryClient = useQueryClient()
    return useMutation<string, APIClientError, DeleteRunwayData, AerodromeContext>({
        mutationFn: (data) => apiClient.delete(`/${data.id}`),
        onMutate: (newData) => {
            if (fromAerodrome) {
                const previousAerodromeData = queryClient.getQueryData<AerodromeDataFromAPI>(['aerodrome', newData.aerodrome_id])
                queryClient.setQueryData<AerodromeDataFromAPI>(
                    ['aerodrome', newData.aerodrome_id], 
                    currentData => (
                        currentData ? {...currentData, runways: currentData.runways.filter(item => item.id !== newData.id)} : undefined
                    )
                )
                return { previousAerodromeData }
            }
            const previousRunwaysData = queryClient.getQueryData<RunwayData[]>(['runways'])

            queryClient.setQueryData<RunwayData[]>(
                ['runways'],
                currentData => (
                    currentData?.filter(item => item.id !== newData.id) || []
                )
            )

            return {previousRunwaysData}

        },
        onSuccess: (_, newData) => {
            toast.info(`"Runway ${newData.name}" has been deleted.`, {
                position: "top-center",
                autoClose: 10000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            if (fromAerodrome) queryClient.invalidateQueries({queryKey: ['aerodrome', newData.aerodrome_id]})
            else queryClient.invalidateQueries({queryKey: ['runways']})
        },
        onError: (error, newData, context) => {
           errorToast(error)
            if (context?.previousAerodromeData) {
                queryClient.setQueryData<AerodromeDataFromAPI>(
                    ['aerodrome', newData.aerodrome_id], 
                    context.previousAerodromeData
                )
            } else if (context?.previousRunwaysData) {
                queryClient.setQueryData<RunwayData[]>(
                    ['runways'], 
                    context.previousRunwaysData
                )
            }
        }
    })
}

export default useDeleterunway