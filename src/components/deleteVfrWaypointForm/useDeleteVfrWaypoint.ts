import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { APIClientError } from '../../services/apiClient';
import apiClient, {
  VfrWaypointDataFromAPI,
} from '../../services/vfrWaypointClient';
import errorToast from '../../utils/errorToast';

interface DeleteWaypointData {
  name: string;
  id: number;
}

interface DeleteWaypointContext {
  previusData?: VfrWaypointDataFromAPI[];
}

const useDeleteVfrWaypoint = () => {
  const queryClient = useQueryClient();
  return useMutation<
    string,
    APIClientError,
    DeleteWaypointData,
    DeleteWaypointContext
  >({
    mutationFn: (data: DeleteWaypointData) =>
      apiClient.delete(`admin-waypoints/registered/${data.id}`),
    onMutate: (data) => {
      const previusData = queryClient.getQueryData<VfrWaypointDataFromAPI[]>([
        'waypoints',
        'vfr',
      ]);
      queryClient.setQueryData<VfrWaypointDataFromAPI[]>(
        ['waypoints', 'vfr'],
        (currentData) =>
          currentData ? currentData.filter((item) => item.id !== data.id) : [],
      );
      return { previusData };
    },
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: ['waypoints', 'vfr'] });
      toast.success(
        `"${data.name}" has been deleted from the official VFR waypoints' list.`,
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
      queryClient.setQueryData<VfrWaypointDataFromAPI[]>(
        ['waypoints', 'vfr'],
        context.previusData,
      );
    },
  });
};

export default useDeleteVfrWaypoint;
