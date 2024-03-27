import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { APIClientError } from '../../../services/apiClient';
import errorToast from '../../../utils/errorToast';
import apiClient from '../services/legsClient';
import { FlightDataFromApi } from '../../../services/flightClient';
import { EditFlightLegDataFromForm } from '../components/EditLegForm';

interface EditLegData extends EditFlightLegDataFromForm {
  route: string;
  temperature_last_updated: string;
  wind_last_updated: string;
  altimeter_last_updated: string;
}

interface FlightContext {
  previousData?: FlightDataFromApi;
}

const useUpdateFlightLeg = (flightId: number) => {
  const queryClient = useQueryClient();
  return useMutation<
    FlightDataFromApi,
    APIClientError,
    EditLegData,
    FlightContext
  >({
    mutationFn: (data) => apiClient.editOther<EditLegData>(data, `/${data.id}`),
    onSuccess: (savedData, newData) => {
      toast.success(`Leg ${newData.route} has been updated successfully.`, {
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
      queryClient.invalidateQueries({ queryKey: ['navLog', flightId] });
      queryClient.invalidateQueries({
        queryKey: ['weightBalanceReport', flightId],
      });
      queryClient.invalidateQueries({
        queryKey: ['fuelCalculations', flightId],
      });
      queryClient.invalidateQueries({
        queryKey: ['takeoffLandingDistances', flightId],
      });
      queryClient.invalidateQueries({
        queryKey: ['weatherBriefing', flightId],
      });
    },
    onError: (error) => {
      errorToast(error);
    },
  });
};

export default useUpdateFlightLeg;
