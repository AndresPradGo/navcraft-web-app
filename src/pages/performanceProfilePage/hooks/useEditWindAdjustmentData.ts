import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { APIClientError } from '../../../services/apiClient';
import apiClient, {TakeoffLandingDataFromAPI} from '../../../services/takeoffLandingPerformanceDataClient'
import {WindAdjustmentDataFromForm} from '../components/EditWindAdjustmentsForm'
import errorToast from '../../../utils/errorToast';


interface TakeoffLandingContext {
    previousData?: TakeoffLandingDataFromAPI 
}

const useEditWindAdjustmentData = (profileId: number, isTakeoff: boolean) => {
    const queryClient = useQueryClient()
  return useMutation<string, APIClientError, WindAdjustmentDataFromForm, TakeoffLandingContext>({
    mutationFn: data => {
      const previousData = queryClient.getQueryData<TakeoffLandingDataFromAPI>(
        [`${isTakeoff ? 'takeoff' : 'landing'}Performance`, profileId]
      )
      const newData = (previousData ? {
        ...previousData, 
        percent_decrease_knot_headwind: data.percent_decrease_knot_headwind,
        percent_increase_knot_tailwind: data.percent_increase_knot_tailwind
      } : {
        percent_increase_runway_surfaces: [],
        performance_data: [],
        percent_decrease_knot_headwind: data.percent_decrease_knot_headwind,
        percent_increase_knot_tailwind: data.percent_increase_knot_tailwind
      }) as TakeoffLandingDataFromAPI
       
      return (apiClient.editAndGetOther<string>(newData, `/takeoff-landing-adjustments/${profileId}?is_takeoff=${isTakeoff}`))
    },
    onMutate: newData => {
      const previousData = queryClient.getQueryData<TakeoffLandingDataFromAPI>(
        [`${isTakeoff ? 'takeoff' : 'landing'}Performance`, profileId]
      )
      queryClient.setQueryData<TakeoffLandingDataFromAPI>(
        [`${isTakeoff ? 'takeoff' : 'landing'}Performance`, profileId], 
        currentData => {
          return (currentData ? {
              ...currentData,
              percent_decrease_knot_headwind: newData.percent_decrease_knot_headwind,
              percent_increase_knot_tailwind: newData.percent_increase_knot_tailwind
          }: undefined)
      })
      return {previousData}
    },
    onSuccess: (savedData) => {
      toast.success(`${isTakeoff ? 'Takeoff' : 'Landing'} wind adjustment data has been updated successfully.`, {
          position: "top-center",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
      });
      queryClient.invalidateQueries<TakeoffLandingDataFromAPI>(
        [`${isTakeoff ? 'takeoff' : 'landing'}Performance`, profileId], 
      )
    },
    onError: (error, _, context) => {
      errorToast(error)
      if (context?.previousData) {
        queryClient.setQueryData<TakeoffLandingDataFromAPI>(
          [`${isTakeoff ? 'takeoff' : 'landing'}Performance`, profileId], 
            context.previousData
        )
      }
  }
  })
}

export default useEditWindAdjustmentData