import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import APIClient, { APIClientError } from '../../../services/apiClient';
import { PassengerData as PassengerDataInCache } from '../../../hooks/usePassengersData';
import errorToast from '../../../utils/errorToast';

interface DeletePassegerData {
  name: string;
  id: number;
}

interface DeletePassengerContext {
  previusData?: PassengerDataInCache[];
}

const apiClient = new APIClient('users/passenger-profile');

const useDeletePassenger = () => {
  const queryClient = useQueryClient();
  return useMutation<
    string,
    APIClientError,
    DeletePassegerData,
    DeletePassengerContext
  >({
    mutationFn: (passenger: DeletePassegerData) =>
      apiClient.delete(`/${passenger.id}`),
    onMutate: (passengerData) => {
      const previusData = queryClient.getQueryData<PassengerDataInCache[]>([
        'passengers',
      ]);
      queryClient.setQueryData<PassengerDataInCache[]>(
        ['passengers'],
        (currentData) =>
          currentData
            ? currentData.filter((item) => item.id !== passengerData.id)
            : [],
      );
      return { previusData };
    },
    onSuccess: (_, passenger) => {
      queryClient.invalidateQueries({ queryKey: ['Passengers'] });
      toast.success(
        `"${passenger.name}" has been deleted from your passengers' list.`,
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
    },
    onError: (error, _, context) => {
      errorToast(error);
      if (!context) return;
      queryClient.setQueryData<PassengerDataInCache[]>(
        ['passengers'],
        context.previusData,
      );
    },
  });
};

export default useDeletePassenger;
