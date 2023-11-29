import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { APIClientError } from '../../../services/apiClient';
import apiClient, {FlightDataFromApi} from '../../../services/flightsClient'
import errorToast from '../../../utils/errorToast';
import { EditFlightData } from '../components/EditFlightForm';


interface FlightContext {
    previousData?: FlightDataFromApi
}

const useEditFlight = (flightId: number) => {
    const queryClient = useQueryClient();
    return useMutation<FlightDataFromApi, APIClientError, EditFlightData, FlightContext>({
        mutationFn: data => (apiClient.editOther<EditFlightData>(data, `/${flightId}`)),
        onMutate: newData => {
            const previousData = queryClient.getQueryData<FlightDataFromApi>(['flight', flightId]) 
            queryClient.setQueryData<FlightDataFromApi>(['flight', flightId], currentData => {
                return (currentData ? {
                    ...currentData,
                    departure_time: newData.departure_time,
                    bhp_percent: newData.bhp_percent,
                    added_enroute_time_hours: newData.added_enroute_time_hours,
                    reserve_fuel_hours: newData.reserve_fuel_hours,
                    contingency_fuel_hours: newData.contingency_fuel_hours,
                } : undefined)
            })
            return {previousData}
        },
        onSuccess: (savedData) => {
            toast.success("Flight settings have been updated successfully.", {
                position: "top-center",
                autoClose: 10000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            queryClient.setQueryData<FlightDataFromApi>(['flight', flightId], () => (savedData))
        },
        onError: (error, _, context) => {
            errorToast(error)
            if (context?.previousData) {
                queryClient.setQueryData<FlightDataFromApi>(
                    ['flight', flightId], 
                    context.previousData
                )
            }
        }
    })
}

export default useEditFlight