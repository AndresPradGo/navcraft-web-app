import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { APIClientError } from '../../../services/apiClient';
import { CompartmentDataFromForm } from '../components/EditBaggageCompartmentForm';
import apiClient, {AircraftArrangementDataFromAPI} from '../../../services/aircraftArrangementClient'
import errorToast from '../../../utils/errorToast';


interface AircraftArrangementContext {
    previousData?: AircraftArrangementDataFromAPI 
}

const useEditBaggageCompartment = (profileId: number) => {
    const queryClient = useQueryClient()
    return useMutation<CompartmentDataFromForm, APIClientError, CompartmentDataFromForm, AircraftArrangementContext>({
        mutationFn: (data) => {
            if (data.id === 0) 
                return apiClient.postAndGetOther<CompartmentDataFromForm>(
                    data as CompartmentDataFromForm, 
                    `/baggage-compartment/${profileId}`
                )
            else 
                return apiClient.editAndGetOther<CompartmentDataFromForm>(
                    data as CompartmentDataFromForm, 
                    `/baggage-compartment/${data.id}`
                )
        },
        onMutate: newData => {
            const previousData = queryClient.getQueryData<AircraftArrangementDataFromAPI>(['AircraftArrangementData', profileId])
            queryClient.setQueryData<AircraftArrangementDataFromAPI>(
                ['AircraftArrangementData', profileId], 
                currentData => {
                    if(newData.id === 0) {
                        return currentData ? {...currentData, baggage_compartments: [newData, ...currentData.baggage_compartments]} : {
                            baggage_compartments: [newData],
                            seat_rows: [],
                            fuel_tanks: []
                        }
                    } else {
                        return currentData ? {...currentData, baggage_compartments: currentData.baggage_compartments.map(item => (
                            item.id === newData.id ? newData : item
                        ))} : {
                            baggage_compartments: [newData],
                            seat_rows: [],
                            fuel_tanks: []
                        }
                    }
                }
            )
            return { previousData }
        },
        onSuccess: (savedData, newData) => {
            toast.success(`${savedData.name} has been ${
                newData.id === 0 ? "added to the baggage compartment list." : "edited successfully."
            }`, {
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
                    return currentData ? {...currentData, baggage_compartments: currentData.baggage_compartments.map(item => (
                        item.id === newData.id ? savedData : item
                    ))} : {
                        baggage_compartments: [savedData],
                        seat_rows: [],
                        fuel_tanks: []
                    }
                }
            )
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

export default useEditBaggageCompartment