import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { APIClientError } from '../../../services/apiClient';
import apiClient, {
  FlightDataFromApi,
  DepartureArrivalWeather,
} from '../../../services/flightClient';
import errorToast from '../../../utils/errorToast';

interface EditDepartureArrivalData extends DepartureArrivalWeather {
  aerodrome_id: number;
}

interface FlightContext {
  previousData?: FlightDataFromApi;
}

const useEditDepartureArrival = (flightId: number, isDeparture: boolean) => {
  const queryClient = useQueryClient();
  return useMutation<
    FlightDataFromApi,
    APIClientError,
    EditDepartureArrivalData,
    FlightContext
  >({
    mutationFn: (data) =>
      apiClient.editOther<EditDepartureArrivalData>(
        data,
        `/departure-arrival/${flightId}?is_departure=${isDeparture}`,
      ),
    onMutate: (newData) => {
      const previousData = queryClient.getQueryData<FlightDataFromApi>([
        'flight',
        flightId,
      ]);
      queryClient.setQueryData<FlightDataFromApi>(
        ['flight', flightId],
        (currentData) => {
          if (isDeparture) {
            return currentData
              ? {
                  ...currentData,
                  departure_aerodrome_id: newData.aerodrome_id,
                  departure_weather: {
                    temperature_c: newData.temperature_c,
                    altimeter_inhg: newData.altimeter_inhg,
                    wind_direction: newData.wind_direction,
                    wind_magnitude_knot: newData.wind_magnitude_knot,
                    temperature_last_updated: newData.temperature_last_updated,
                    wind_last_updated: newData.wind_last_updated,
                    altimeter_last_updated: newData.altimeter_last_updated,
                  },
                }
              : undefined;
          } else {
            return currentData
              ? {
                  ...currentData,
                  arrival_aerodrome_id: newData.aerodrome_id,
                  arrival_weather: {
                    temperature_c: newData.temperature_c,
                    altimeter_inhg: newData.altimeter_inhg,
                    wind_direction: newData.wind_direction,
                    wind_magnitude_knot: newData.wind_magnitude_knot,
                    temperature_last_updated: newData.temperature_last_updated,
                    wind_last_updated: newData.wind_last_updated,
                    altimeter_last_updated: newData.altimeter_last_updated,
                  },
                }
              : undefined;
          }
        },
      );
      return { previousData };
    },
    onSuccess: async (savedData) => {
      toast.success(
        `${isDeparture ? 'Departure' : 'Arrival'} data has been updated successfully.`,
        {
          position: 'top-center',
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        },
      );
      queryClient.setQueryData<FlightDataFromApi>(
        ['flight', flightId],
        () => savedData,
      );
      await queryClient.invalidateQueries({ queryKey: ['navLog', flightId] });
      await queryClient.invalidateQueries({
        queryKey: ['weightBalanceReport', flightId],
      });
      await queryClient.invalidateQueries({
        queryKey: ['fuelCalculations', flightId],
      });
      await queryClient.invalidateQueries({
        queryKey: ['takeoffLandingDistances', flightId],
      });
      await queryClient.invalidateQueries({
        queryKey: ['weatherBriefing', flightId],
      });
      await queryClient.invalidateQueries({ queryKey: ['notamBriefing', flightId] });
    },
    onError: (error, _, context) => {
      errorToast(error);
      if (context?.previousData) {
        queryClient.setQueryData<FlightDataFromApi>(
          ['flight', flightId],
          context.previousData,
        );
      }
    },
  });
};

export default useEditDepartureArrival;
