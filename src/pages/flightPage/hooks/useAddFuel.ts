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
    onSuccess: async (savedData) => {
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
    onError: (error) => {
      errorToast(error);
    },
  });
};

export default useAddFuel;
