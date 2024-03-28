import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { APIClientError } from '../../../services/apiClient';
import errorToast from '../../../utils/errorToast';
import apiClient, {
  PostLegFromExistingWaypoint,
  PostLegFromNewLocation,
} from '../services/legsClient';
import { FlightDataFromApi } from '../../../services/flightClient';

interface NewLegData
  extends PostLegFromExistingWaypoint,
    PostLegFromNewLocation {
  type?: 'aerodrome' | 'waypoint' | 'user aerodrome' | 'user waypoint';
}

const usePostNewLeg = (flightId: number, isLeg?: boolean) => {
  const queryClient = useQueryClient();
  return useMutation<FlightDataFromApi, APIClientError, NewLegData>({
    mutationFn: (data) => {
      if (data.existing_waypoint_id === 0) {
        return apiClient.postOther<PostLegFromNewLocation>(
          {
            new_waypoint: {
              ...data.new_waypoint,
            },
            sequence: data.sequence,
          },
          `/${flightId}`,
        );
      } else {
        return apiClient.post(
          {
            existing_waypoint_id: data.existing_waypoint_id,
            sequence: data.sequence,
          },
          `/${flightId}`,
        );
      }
    },
    onSuccess: async (savedData, newData) => {
      toast.success(
        isLeg
          ? 'A new leg has been successfully added to the flight path.'
          : `${newData.new_waypoint.name} has been successfully added to the flight path.`,
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
    },
    onError: (error) => {
      errorToast(error);
    },
  });
};

export default usePostNewLeg;
