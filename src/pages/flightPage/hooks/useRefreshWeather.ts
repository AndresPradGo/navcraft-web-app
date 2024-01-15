import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import APIClient from '../../../services/weatherApiClient';
import { APIClientError } from '../../../services/apiClient';
import {FlightDataFromApi} from '../../../services/flightClient'
import errorToast from '../../../utils/errorToast';




interface AerodromeWetherProductRequest {
    aerodromeCode: string;
    nauticalMilesFromTarget: number;
}

interface PostRfreshWeather {
    takeoffWeather?: {
        dateTime: string;
        taf: AerodromeWetherProductRequest[];
        metar: AerodromeWetherProductRequest[];
    };
    enrouteWeather?: {
        dateTime: string;
        altitude: number;
        upperwind: AerodromeWetherProductRequest[];
        metar: AerodromeWetherProductRequest[];
    }[];
    landingWeather?: {
        dateTime: string;
        taf: AerodromeWetherProductRequest[];
        metar: AerodromeWetherProductRequest[];
    };
}

interface WeatherReportReturnData {
    wind_magnitude_knot: number;
    temperature_c: number;
    altimeter_inhg: number;
    wind_direction?: number;
};

interface RefreshWeatherDataFromAPI {
    takeoffWeather?: WeatherReportReturnData
    enrouteWeather?: WeatherReportReturnData
    landingWeather?: WeatherReportReturnData
    allWeatherIsOfficial: boolean
    weatherHoursFromETD: number
}

interface FlightContext {
    previousData?: FlightDataFromApi
}

const apiClient = new APIClient<PostRfreshWeather, unknown>("/reports")

const useRefreshWeather = (flightId: number) => {
    const queryClient = useQueryClient();
    return useMutation<unknown, APIClientError, PostRfreshWeather, FlightContext>({
        mutationFn: data => (apiClient.post(data, `/${flightId}`)),
        onSuccess: (savedData) => {
            console.log(savedData)
            console.log(savedData)
            toast.success("Weather Data has been refresh successfully.", {
                position: "top-center",
                autoClose: 10000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            queryClient.setQueryData<FlightDataFromApi>(['flight', flightId], (currentData) => {
                if (currentData) {
                    return {
                        ...currentData
                    }
                }
                return undefined
            })
            queryClient.invalidateQueries({queryKey: ["navLog",flightId,]})
            queryClient.invalidateQueries({queryKey: ["weightBalanceReport",flightId,]})
            queryClient.invalidateQueries({queryKey: ["fuelCalculations",flightId,]})
            queryClient.invalidateQueries({queryKey: ["takeoffLandingDistances",flightId,]})
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

export default useRefreshWeather