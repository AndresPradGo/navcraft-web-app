import { useQueryClient } from '@tanstack/react-query';

import { PassengerData } from './usePassengersData';

const useGetPassenger = (id?: number): PassengerData | undefined => {
  const queryClient = useQueryClient();
  
  if (!id) return undefined;

  const passengerList = queryClient.getQueryData<PassengerData[]>([
    'passengers',
  ]);
  return passengerList?.find((item) => item.id === id);
};

export default useGetPassenger;
