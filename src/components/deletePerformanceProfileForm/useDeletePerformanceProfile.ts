import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { APIClientError } from '../../services/apiClient';
import apiClient, { AircraftDataFromAPI } from '../../services/aircraftClient';
import errorToast from '../../utils/errorToast';

interface DeleteProfileContext {
  previousData?: AircraftDataFromAPI;
}

const useDeletePerformanceProfile = (
  aircraftId: number,
  onDelete: () => void,
  redirecting: boolean,
) => {
  const queryClient = useQueryClient();
  return useMutation<string, APIClientError, number, DeleteProfileContext>({
    mutationFn: (profileId) =>
      apiClient.delete(`/performance-profile/${profileId}`),
    onMutate: (profileId) => {
      const previousData = queryClient.getQueryData<AircraftDataFromAPI>([
        'aircraft',
        aircraftId,
      ]);
      if (!redirecting) {
        queryClient.setQueryData<AircraftDataFromAPI>(
          ['aircraft', aircraftId],
          (currentData) =>
            currentData
              ? {
                  ...currentData,
                  profiles: currentData.profiles.filter(
                    (item) => item.id !== profileId,
                  ),
                }
              : undefined,
        );
      }
      return { previousData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aircraft', aircraftId] }).then(() => {
        toast.success('The performance Profile has been deleted successfully.', {
          position: 'top-center',
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      }).catch(() => {
        toast.info('The performance Profile has been deleted successfully. If the changes are not being displayed correctly, please refresh the website.', {
          position: 'top-center',
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      });
      onDelete();
    },
    onError: (error, _, context) => {
      errorToast(error);
      if (!context) return;
      queryClient.setQueryData<AircraftDataFromAPI>(
        ['aircraft', aircraftId],
        context.previousData,
      );
    },
  });
};

export default useDeletePerformanceProfile;
