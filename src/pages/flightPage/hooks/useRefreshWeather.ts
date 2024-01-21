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
    enrouteWeather?: WeatherReportReturnData[]
    landingWeather?: WeatherReportReturnData
    allWeatherIsOfficial: boolean
    weatherHoursFromETD: number
}

interface FlightContext {
    previousData?: FlightDataFromApi
}

const apiClient = new APIClient<PostRfreshWeather, RefreshWeatherDataFromAPI>("/reports")

const useRefreshWeather = (flightId: number) => {
    const queryClient = useQueryClient();
    return useMutation<RefreshWeatherDataFromAPI, APIClientError, PostRfreshWeather, FlightContext>({
        mutationFn: data => (apiClient.post(data, `/${flightId}`)),
        onSuccess: (savedData) => {
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
                        ...currentData,
                        departure_weather: savedData.takeoffWeather ? {
                            ...currentData.departure_weather,
                            temperature_c: savedData.takeoffWeather.temperature_c,
                            altimeter_inhg: savedData.takeoffWeather.altimeter_inhg,
                            wind_direction: savedData.takeoffWeather.wind_direction 
                                ? savedData.takeoffWeather.wind_direction 
                                : null,
                            wind_magnitude_knot: savedData.takeoffWeather.wind_magnitude_knot
                        } : {...currentData.departure_weather},
                        legs: currentData.legs.map((leg, idx) => {
                            return savedData.enrouteWeather ? {
                                ...leg,
                                temperature_c: savedData.enrouteWeather[idx].temperature_c,
                                altimeter_inhg: savedData.enrouteWeather[idx].altimeter_inhg,
                                wind_direction: savedData.enrouteWeather[idx].wind_direction === undefined
                                    ? savedData.enrouteWeather[idx].wind_direction as number
                                    : null,
                            wind_magnitude_knot: savedData.enrouteWeather[idx].wind_magnitude_knot
                            } : {...leg}
                        }),
                        arrival_weather: savedData.landingWeather ? {
                            ...currentData.arrival_weather,
                            temperature_c: savedData.landingWeather.temperature_c,
                            altimeter_inhg: savedData.landingWeather.altimeter_inhg,
                            wind_direction: savedData.landingWeather.wind_direction 
                                ? savedData.landingWeather.wind_direction 
                                : null,
                            wind_magnitude_knot: savedData.landingWeather.wind_magnitude_knot
                        } : {...currentData.arrival_weather},
                        all_weather_is_official: savedData.allWeatherIsOfficial,
                        weather_hours_from_etd: savedData.weatherHoursFromETD
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