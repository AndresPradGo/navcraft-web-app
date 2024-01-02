import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { APIClientError } from '../../services/apiClient';
import apiClient, {FlightDataFromApi, AddFlightData} from '../../services/flightsClient'
import errorToast from '../../utils/errorToast';
import getUTCNowString from '../../utils/getUTCNowString';

interface FlightContext {
    previousData?: FlightDataFromApi[]
}

const useAddFlight = () => {
  const queryClient = useQueryClient()
  return useMutation<FlightDataFromApi, APIClientError, AddFlightData, FlightContext>({
    mutationFn: data => (apiClient.post(data)),
    onMutate: newData => {
        const previousData = queryClient.getQueryData<FlightDataFromApi[]>(['flights', 'all']) 
        const newFlight = {
            id: 0,
            departure_time: newData.departure_time,
            aircraft_id: newData.aircraft_id,
            departure_aerodrome_id: newData.departure_aerodrome_id,
            arrival_aerodrome_id: newData.arrival_aerodrome_id,
            bhp_percent: 0,
            added_enroute_time_hours: 0,
            reserve_fuel_hours: 0.5,
            contingency_fuel_hours: 0.5,
            departure_aerodrome_is_private: false,
            arrival_aerodrome_is_private: false,
            briefing_radius_nm: 5, 
            diversion_radius_nm: 10, 
            all_weather_is_official: false, 
            weather_hours_from_etd: Date.now() / (1000 * 60 * 60),
            departure_taf_aerodromes: [], 
            departure_metar_aerodromes: [], 
            arrival_taf_aerodromes: [], 
            arrival_metar_aerodromes: [], 
            diversion_options: [],
            legs: []
        }
        queryClient.setQueryData<FlightDataFromApi[]>(['flights', 'all'], currentData => {
            const flightToAdd = {
                ...newFlight,
                departure_weather: {
                    temperature_c: 15,
                    altimeter_inhg: 29.92,
                    wind_magnitude_knot: 0,
                    wind_direction: null,
                    temperature_last_updated: getUTCNowString(),
                    wind_last_updated: getUTCNowString(),
                    altimeter_last_updated: getUTCNowString(),
                },
                arrival_weather: {
                    temperature_c: 15,
                    altimeter_inhg: 29.92,
                    wind_magnitude_knot: 0,
                    wind_direction: null,
                    temperature_last_updated: getUTCNowString(),
                    wind_last_updated: getUTCNowString(),
                    altimeter_last_updated: getUTCNowString(),
                }
            }
            return (currentData ? [
                ...currentData,
                flightToAdd
            ]: [flightToAdd])
        })
        return {previousData}
    },
    onSuccess: (savedData) => {
        toast.success("New Flight has been added successfully.", {
            position: "top-center",
            autoClose: 10000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
        queryClient.setQueryData<FlightDataFromApi[]>(['flights', 'all'], currentData => {
            return (currentData ? currentData.map(flight => {
                if(flight.id === 0) return (savedData)
                else return flight
            }) : [savedData])
        })
    },
    onError: (error, _, context) => {
        errorToast(error)
        if (context?.previousData) {
            queryClient.setQueryData<FlightDataFromApi[]>(
                ['flights', 'all'], 
                context.previousData
            )
        }
    }
  })
}

export default useAddFlight