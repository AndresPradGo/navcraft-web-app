import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { APIClientError } from '../../../services/apiClient';
import apiClient, { FlightDataFromApi } from '../../../services/flightClient';
import errorToast from '../../../utils/errorToast';
import { EditFlightData } from '../components/EditFlightForm';

interface FlightContext {
  previousData?: FlightDataFromApi;
}

const useEditFlight = (flightId: number) => {
  const queryClient = useQueryClient();
  return useMutation<
    FlightDataFromApi,
    APIClientError,
    EditFlightData,
    FlightContext
  >({
    mutationFn: (data) => apiClient.edit(data, `/${flightId}`),
    onMutate: (newData) => {
      const previousData = queryClient.getQueryData<FlightDataFromApi>([
        'flight',
        flightId,
      ]);
      queryClient.setQueryData<FlightDataFromApi>(
        ['flight', flightId],
        (currentData) => {
          return currentData
            ? {
                ...currentData,
                departure_time: newData.departure_time,
                bhp_percent: newData.bhp_percent,
                added_enroute_time_hours: newData.added_enroute_time_hours,
                reserve_fuel_hours: newData.reserve_fuel_hours,
                contingency_fuel_hours: newData.contingency_fuel_hours,
              }
            : undefined;
        },
      );
      return { previousData };
    },
    onSuccess: async (savedData) => {
      toast.success('Flight settings have been updated successfully.', {
        position: 'top-center',
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
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

export default useEditFlight;
