import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { APIClientError } from '../../../services/apiClient';
import errorToast from '../../../utils/errorToast';
import apiClient, {PersonOnBoardDataFromAPI, EditPersonOnBoardData} from '../services/personOnBoardClient';

const useAddPerson = (flightId: number) => {
    const queryClient = useQueryClient();
    return useMutation<PersonOnBoardDataFromAPI, APIClientError, EditPersonOnBoardData>({
        mutationFn: data => {
            if(data.id === 0) return apiClient.post(data, `/${flightId}`)
            return apiClient.edit(data, `/${data.id}`)
        },
        onSuccess: (savedData, newData) => {
            toast.success("Passenger/crew-member has been added successfully", {
                position: "top-center",
                autoClose: 10000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            queryClient.setQueryData<PersonOnBoardDataFromAPI[]>(['personsOnBoard', flightId], currentData => {
                if(newData.id === 0) {
                    return (currentData ? [...currentData, savedData] : [savedData])
                }
                return (currentData ? currentData.map(item => item.id === savedData.id ? savedData: item) : [savedData])
            })
            queryClient.invalidateQueries({queryKey: ["navLog",flightId,]})
            queryClient.invalidateQueries({queryKey: ["weightBalanceReport",flightId,]})
            queryClient.invalidateQueries({queryKey: ["fuelCalculations",flightId,]})
            queryClient.invalidateQueries({queryKey: ["takeoffLandingDistances",flightId,]})
            queryClient.invalidateQueries({queryKey: ["weatherBriefing",flightId,]})
        },
        onError: (error) => {errorToast(error)}
    })
}

export default useAddPerson