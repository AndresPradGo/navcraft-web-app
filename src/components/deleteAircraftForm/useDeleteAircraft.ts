import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { APIClientError } from '../../services/apiClient';
import apiClient, { AircraftDataFromAPI } from '../../services/aircraftClient';
import errorToast from '../../utils/errorToast';

interface DeleteAircraftData {
  registration: string;
  id: number;
}

interface DeleteAircraftContext {
  previusData?: AircraftDataFromAPI[];
}

const useDeleteAircraft = (onDelete: () => void) => {
  const queryClient = useQueryClient();
  return useMutation<
    string,
    APIClientError,
    DeleteAircraftData,
    DeleteAircraftContext
  >({
    mutationFn: (data) => apiClient.delete(`/${data.id}`),
    onMutate: (data) => {
      const previusData = queryClient.getQueryData<AircraftDataFromAPI[]>([
        'aircraft',
        'list',
      ]);
      queryClient.setQueryData<AircraftDataFromAPI[]>(
        ['aircraft', 'list'],
        (currentData) =>
          currentData ? currentData.filter((item) => item.id !== data.id) : [],
      );
      return { previusData };
    },
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: ['aircraft', 'list'] }).then(() => {
        toast.success(
          `"${data.registration}" has been deleted from your fleet.`,
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
      }).catch(() => {
        toast.info(
          `"${data.registration}" has been deleted from your fleet, but we weren't able to refresh the displayed data. To see the changes, please refresh the website.`,
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
      });
      onDelete();
    },
    onError: (error, _, context) => {
      errorToast(error);
      if (!context) return;
      queryClient.setQueryData<AircraftDataFromAPI[]>(
        ['aircraft', 'list'],
        context.previusData,
      );
    },
  });
};

export default useDeleteAircraft;
