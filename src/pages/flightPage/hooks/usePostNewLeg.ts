import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { APIClientError } from '../../../services/apiClient';
import errorToast from '../../../utils/errorToast';
import apiClient, {PostLegFromExistingWaypoint, PostLegFromNewLocation} from '../services/legsClient'
import { FlightDataFromApi } from '../../../services/flightsClient';
import getUTCNowString from '../../../utils/getUTCNowString';

interface FlightContext {
    previousData?: FlightDataFromApi
}

interface NewLegData extends PostLegFromExistingWaypoint, PostLegFromNewLocation {
    type?: "aerodrome" | "waypoint" | "user aerodrome" | "user waypoint";
}

const usePostNewLeg = (flightId: number, isLeg?: boolean) => {
    const queryClient = useQueryClient()
    return useMutation<
        FlightDataFromApi, 
        APIClientError, 
        NewLegData,
        FlightContext
    >({
        mutationFn: (data) => {
            if (data.existing_waypoint_id === 0) {
                return apiClient.postOther<PostLegFromNewLocation>({
                    new_waypoint: {
                        ...data.new_waypoint
                    },
                    sequence: data.sequence
                }, `/${flightId}`)
            } else {
                return apiClient.post({
                    existing_waypoint_id: data.existing_waypoint_id,
                    sequence: data.sequence
                }, `/${flightId}`)
            }
        },
        onMutate: newData => {
            const previousData = queryClient.getQueryData<FlightDataFromApi>(["flight",flightId]) 
            queryClient.setQueryData<FlightDataFromApi>(["flight",flightId], currentData => {
                const newLegs = currentData?.legs || []
                newLegs.splice(newData.sequence - 1, 0, {
                    id: 0,
                    temperature_c: 13,
                    altimeter_inhg: 29.92,
                    wind_direction: 0,
                    wind_magnitude_knot: 0,
                    temperature_last_updated: getUTCNowString(),
                    wind_last_updated: getUTCNowString(),
                    altimeter_last_updated: getUTCNowString(),
                    sequence: newData.sequence,
                    altitude_ft: 2000,
                    waypoint: {
                        id: newData.existing_waypoint_id,
                        ...newData.new_waypoint,
                        magnetic_variation: 0,
                        from_vfr_waypoint: (newData.existing_waypoint_id !== 0) 
                            && (newData.type === "aerodrome" || newData.type === "waypoint"),
                        from_user_waypoint: (newData.existing_waypoint_id !== 0)
                            && (newData.type === "user aerodrome" || newData.type === "user waypoint")
                    }
                })
                return (
                    currentData ? {
                        ...currentData,
                        legs: newLegs
                    } : undefined
                )
            })
            return {previousData}
        },
        onSuccess: (savedData, newData) => {
            toast.success(
                isLeg ? "A new leg has been successfully added to the flight path." 
                : `${newData.new_waypoint.name} has been successfully added to the flight path.`, 
                {
                    position: "top-center",
                    autoClose: 10000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                }
            );
            queryClient.setQueryData<FlightDataFromApi>(["flight",flightId], () => savedData)
            queryClient.invalidateQueries({queryKey: ["navLog",flightId,]})
        },
        onError: (error, _, context) => {
            errorToast(error)
            if (context?.previousData) {
                queryClient.setQueryData<FlightDataFromApi>(
                    ["flight",flightId], 
                    context.previousData
                )
            }
        } 
    })
}

export default usePostNewLeg