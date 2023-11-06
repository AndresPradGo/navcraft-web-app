import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import apiClient, {AircraftDataFromAPI} from '../../services/aircraftClient'
import { APIClientError } from '../../services/apiClient';
import { AircraftDataFromForm } from './EditAircraftForm';
import errorToast from '../../utils/errorToest';


interface AircraftContext {
    previusData?: AircraftDataFromAPI[]
}

const useAddAircraft = () => {
    const queryClient = useQueryClient()
    return useMutation<AircraftDataFromForm, APIClientError, AircraftDataFromForm, AircraftContext>({
        mutationFn: (data) => apiClient.post(data),
        onMutate: newData => {
            const previusData = queryClient.getQueryData<AircraftDataFromAPI[]>(['aircraft', 'list']) 
            queryClient.setQueryData<AircraftDataFromAPI[]>(['aircraft', 'list'], currentData => {
                return (
                    currentData 
                        ? [{ ...newData, profiles: []}, ...currentData] 
                        : [{ ...newData, profiles: []}]
                )
            })
            return {previusData}
        },
        onSuccess: (savedData) => {
            toast.success(`"${savedData.registration}" has been added to your aircraft fleet.`, {
                position: "top-center",
                autoClose: 10000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });

            queryClient.setQueryData<AircraftDataFromAPI[]>(['aircraft', 'list'], currentData => {
                return (
                    currentData?.map(item => {
                        if(item.id === 0) {
                            return ({
                                ...savedData,
                                profiles: []
                            })
                        }
                        return item
                    }) || [{...savedData, profiles:[]}]
                )
            })
        },
        onError: (error, _, context) => {
            errorToast(error)
            if (context?.previusData) {
                queryClient.setQueryData<AircraftDataFromAPI[]>(
                    ['aircraft', 'list'], 
                    context.previusData
                )
            }
        }
    })
}

export default useAddAircraft