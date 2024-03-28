import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { APIClientError } from '../../../services/apiClient';
import errorToast from '../../../utils/errorToast';
import apiClient, {
  PersonOnBoardDataFromAPI,
} from '../services/personOnBoardClient';

const useRemovePerson = (flightId: number) => {
  const queryClient = useQueryClient();
  return useMutation<string, APIClientError, number>({
    mutationFn: (id) => {
      return apiClient.delete(`/${id}`);
    },
    onSuccess: async (_, id) => {
      toast.success('Passenger/crew-member has been removed successfully', {
        position: 'top-center',
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      queryClient.setQueryData<PersonOnBoardDataFromAPI[]>(
        ['personsOnBoard', flightId],
        (currentData) => {
          return currentData
            ? currentData.filter((item) => item.id !== id)
            : [];
        },
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
    },
    onError: (error) => {
      errorToast(error);
    },
  });
};

export default useRemovePerson;
