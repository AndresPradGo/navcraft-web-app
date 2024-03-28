import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { APIClientError } from '../../../services/apiClient';
import errorToast from '../../../utils/errorToast';
import apiClient from '../services/legsClient';
import { FlightDataFromApi } from '../../../services/flightClient';

interface DeleteLegData {
  identifier: string;
  id: number;
}

interface FlightContext {
  previousData?: FlightDataFromApi;
}

const useDeleteLeg = (flightId: number, isLeg?: boolean) => {
  const queryClient = useQueryClient();
  return useMutation<
    FlightDataFromApi,
    APIClientError,
    DeleteLegData,
    FlightContext
  >({
    mutationFn: (data) => apiClient.deleteWithReturn(`/${data.id}`),
    onMutate: (data) => {
      const previousData = queryClient.getQueryData<FlightDataFromApi>([
        'flight',
        flightId,
      ]);
      queryClient.setQueryData<FlightDataFromApi>(
        ['flight', flightId],
        (currentData) =>
          currentData
            ? {
                ...currentData,
                legs: currentData.legs.filter((item) => item.id !== data.id),
              }
            : undefined,
      );
      return { previousData };
    },
    onSuccess: async (savedData, newData) => {
      toast.success(
        !isLeg
          ? `${newData.identifier} waypoint has been successfully removed from your flight plan.`
          : `The leg ${newData.identifier}, has been successfully removed from your flight plan.`,
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

export default useDeleteLeg;
