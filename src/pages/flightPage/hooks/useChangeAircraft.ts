import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { APIClientError } from '../../../services/apiClient';
import apiClient, { FlightDataFromApi } from '../../../services/flightClient';
import errorToast from '../../../utils/errorToast';

interface ChangeAircraftDataType {
  aircraftId: number;
  aircraft: string;
}

interface FlightContext {
  previousData?: FlightDataFromApi;
}

const useChangeAircraft = (flightId: number) => {
  const queryClient = useQueryClient();
  return useMutation<
    FlightDataFromApi,
    APIClientError,
    ChangeAircraftDataType,
    FlightContext
  >({
    mutationFn: (data) =>
      apiClient.editOther<null>(
        null,
        `/change-aircraft/${flightId}/${data.aircraftId}`,
      ),
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
                aircraft_id: newData.aircraftId,
              }
            : undefined;
        },
      );
      return { previousData };
    },
    onSuccess: async (savedData, newData) => {
      toast.success(`Aircarft has been Changed to "${newData.aircraft}"`, {
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

export default useChangeAircraft;
