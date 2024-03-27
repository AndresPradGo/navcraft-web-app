import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { APIClientError } from '../../../services/apiClient';
import errorToast from '../../../utils/errorToast';
import apiClient, {
  FuelOnBoardDataFromAPI,
} from '../services/fuelOnBoardClient';
import { FuelDataFromForm } from '../components/AddFuelForm';

const useAddFuel = (flightId: number) => {
  const queryClient = useQueryClient();
  return useMutation<FuelOnBoardDataFromAPI, APIClientError, FuelDataFromForm>({
    mutationFn: (data) => apiClient.edit(data, `/${data.id}`),
    onSuccess: (savedData) => {
      toast.success('Aircraft has been refuelled successfully', {
        position: 'top-center',
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      queryClient.setQueryData<FuelOnBoardDataFromAPI[]>(
        ['fuelOnBoard', flightId],
        (currentData) =>
          currentData
            ? currentData.map((fuel) =>
                fuel.id === savedData.id ? savedData : fuel,
              )
            : [savedData],
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
      queryClient.invalidateQueries({ queryKey: ['notamBriefing', flightId] });
    },
    onError: (error) => {
      errorToast(error);
    },
  });
};

export default useAddFuel;
