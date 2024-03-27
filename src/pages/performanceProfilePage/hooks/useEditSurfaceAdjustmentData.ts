import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { APIClientError } from '../../../services/apiClient';
import apiClient, {
  TakeoffLandingDataFromAPI,
  EditRunwayAdjustmentData,
} from '../../../services/takeoffLandingPerformanceDataClient';
import errorToast from '../../../utils/errorToast';

interface TakeoffLandingContext {
  previousData?: TakeoffLandingDataFromAPI;
}

const useEditWindAdjustmentData = (profileId: number, isTakeoff: boolean) => {
  const queryClient = useQueryClient();
  return useMutation<
    string,
    APIClientError,
    EditRunwayAdjustmentData,
    TakeoffLandingContext
  >({
    mutationFn: (data) => {
      const previousData = queryClient.getQueryData<TakeoffLandingDataFromAPI>([
        `${isTakeoff ? 'takeoff' : 'landing'}Performance`,
        profileId,
      ]);
      const newData = (
        previousData
          ? {
              ...previousData,
              percent_increase_runway_surfaces:
                previousData.percent_increase_runway_surfaces.find(
                  (item) => item.surface_id === data.surface_id,
                )
                  ? previousData.percent_increase_runway_surfaces.map(
                      (item) => {
                        if (item.surface_id === data.surface_id) return data;
                        else return item;
                      },
                    )
                  : [...previousData.percent_increase_runway_surfaces, data],
            }
          : {
              performance_data: [],
              percent_decrease_knot_headwind: 0,
              percent_increase_knot_tailwind: 0,
              percent_increase_runway_surfaces: [data],
            }
      ) as TakeoffLandingDataFromAPI;

      return apiClient.editAndGetOther<string>(
        newData,
        `/takeoff-landing-adjustments/${profileId}?is_takeoff=${isTakeoff}`,
      );
    },
    onMutate: (newData) => {
      const previousData = queryClient.getQueryData<TakeoffLandingDataFromAPI>([
        `${isTakeoff ? 'takeoff' : 'landing'}Performance`,
        profileId,
      ]);
      queryClient.setQueryData<TakeoffLandingDataFromAPI>(
        [`${isTakeoff ? 'takeoff' : 'landing'}Performance`, profileId],
        (currentData) => {
          const surfaceExists =
            currentData?.percent_increase_runway_surfaces.find(
              (item) => item.surface_id === newData.surface_id,
            );
          return currentData
            ? {
                ...currentData,
                percent_increase_runway_surfaces: surfaceExists
                  ? currentData.percent_increase_runway_surfaces.map((item) => {
                      if (item.surface_id === newData.surface_id)
                        return newData;
                      else return item;
                    })
                  : [...currentData.percent_increase_runway_surfaces, newData],
              }
            : undefined;
        },
      );
      return { previousData };
    },
    onSuccess: () => {
      toast.success(
        `${isTakeoff ? 'Takeoff' : 'Landing'} performance adjustment value has been added successfully.`,
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
      queryClient.invalidateQueries<TakeoffLandingDataFromAPI>([
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

export default useEditWindAdjustmentData;
