import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { APIClientError } from '../../../services/apiClient';
import apiClient, {
  TakeoffLandingDataFromAPI,
} from '../../../services/takeoffLandingPerformanceDataClient';
import errorToast from '../../../utils/errorToast';

interface TakeoffLandingContext {
  previousData?: TakeoffLandingDataFromAPI;
}

const useDeleteSurfaceAdjustmentValue = (
  profileId: number,
  isTakeoff: boolean,
) => {
  const queryClient = useQueryClient();
  return useMutation<string, APIClientError, number, TakeoffLandingContext>({
    mutationFn: (surfaceId) => {
      const previousData = queryClient.getQueryData<TakeoffLandingDataFromAPI>([
        `${isTakeoff ? 'takeoff' : 'landing'}Performance`,
        profileId,
      ]);
      const newData = (
        previousData
          ? {
              ...previousData,
              percent_increase_runway_surfaces:
                previousData.percent_increase_runway_surfaces.filter(
                  (item) => item.surface_id !== surfaceId,
                ),
            }
          : {
              performance_data: [],
              percent_decrease_knot_headwind: 0,
              percent_increase_knot_tailwind: 0,
              percent_increase_runway_surfaces: [],
            }
      ) as TakeoffLandingDataFromAPI;

      return apiClient.editAndGetOther<string>(
        newData,
        `/takeoff-landing-adjustments/${profileId}?is_takeoff=${isTakeoff}`,
      );
    },
    onMutate: (surfaceId) => {
      const previousData = queryClient.getQueryData<TakeoffLandingDataFromAPI>([
        `${isTakeoff ? 'takeoff' : 'landing'}Performance`,
        profileId,
      ]);
      queryClient.setQueryData<TakeoffLandingDataFromAPI>(
        [`${isTakeoff ? 'takeoff' : 'landing'}Performance`, profileId],
        (currentData) => {
          return currentData
            ? {
                ...currentData,
                percent_increase_runway_surfaces:
                  currentData.percent_increase_runway_surfaces.filter(
                    (item) => item.surface_id !== surfaceId,
                  ),
              }
            : undefined;
        },
      );
      return { previousData };
    },
    onSuccess: async () => {
      toast.success(
        `${isTakeoff ? 'Takeoff' : 'Landing'} performance adjustment value has been deleted successfully.`,
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
      await queryClient.invalidateQueries<TakeoffLandingDataFromAPI>([
        `${isTakeoff ? 'takeoff' : 'landing'}Performance`,
        profileId,
      ]);
    },
    onError: (error, _, context) => {
      errorToast(error);
      if (context?.previousData) {
        queryClient.setQueryData<TakeoffLandingDataFromAPI>(
          [`${isTakeoff ? 'takeoff' : 'landing'}Performance`, profileId],
          context.previousData,
        );
      }
    },
  });
};

export default useDeleteSurfaceAdjustmentValue;
