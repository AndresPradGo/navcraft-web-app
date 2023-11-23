import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { APIClientError } from '../../../services/apiClient';
import { SeatRowDataFromForm } from '../components/EditSeatRowForm';
import apiClient, {AircraftArrangementDataFromAPI} from '../../../services/aircraftArrangementClient'
import errorToast from '../../../utils/errorToast';


interface AircraftArrangementContext {
    previousData?: AircraftArrangementDataFromAPI 
}

const useEditSeatRow = (profileId: number, aircraftId: number) => {
    const queryClient = useQueryClient()
    return useMutation<SeatRowDataFromForm, APIClientError, SeatRowDataFromForm, AircraftArrangementContext>({
        mutationFn: (data) => {
            if (data.id === 0) 
                return apiClient.postAndGetOther<SeatRowDataFromForm>(
                    data as SeatRowDataFromForm, 
                    `/seat-row/${profileId}`
                )
            else 
                return apiClient.editAndGetOther<SeatRowDataFromForm>(
                    data as SeatRowDataFromForm, 
                    `/seat-row/${data.id}`
                )
        },
        onMutate: newData => {
            const previousData = queryClient.getQueryData<AircraftArrangementDataFromAPI>(['AircraftArrangementData', profileId])
            queryClient.setQueryData<AircraftArrangementDataFromAPI>(
                ['AircraftArrangementData', profileId], 
                currentData => {
                    if(newData.id === 0) {
                        return currentData ? {...currentData, seat_rows: [newData, ...currentData.seat_rows]} : {
                            seat_rows: [newData],
                            baggage_compartments: [],
                            fuel_tanks: []
                        }
                    } else {
                        return currentData ? {...currentData, seat_rows: currentData.seat_rows.map(item => (
                            item.id === newData.id ? newData : item
                        ))} : {
                            seat_rows: [newData],
                            baggage_compartments: [],
                            fuel_tanks: []
                        }
                    }
                }
            )
            return { previousData }
        },
        onSuccess: (savedData, newData) => {
            toast.success(`${savedData.name} has been ${newData.id === 0 ? "added" : "edited"} successfully.`, {
                position: "top-center",
                autoClose: 10000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            queryClient.setQueryData<AircraftArrangementDataFromAPI>(
                ['AircraftArrangementData', profileId], 
                currentData => {
                    return currentData ? {...currentData, seat_rows: currentData.seat_rows.map(item => (
                        item.id === newData.id ? savedData : item
                    ))} : {
                        seat_rows: [savedData],
                        baggage_compartments: [],
                        fuel_tanks: []
                    }
                }
            )
            if (newData.id === 0 ) {
                queryClient.invalidateQueries({queryKey: ["aircraft", aircraftId]})
            }
        },
        onError: (error, _, context) => {
            errorToast(error)
            if (context?.previousData) {
                queryClient.setQueryData<AircraftArrangementDataFromAPI>(
                    ['AircraftArrangementData', profileId], 
                    context.previousData
                )
            }
        }
    })
}

export default useEditSeatRow