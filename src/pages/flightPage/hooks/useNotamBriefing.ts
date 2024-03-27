import { useQuery } from '@tanstack/react-query';
import type { NOTAMBriefingData } from '../services/briefingClient';

const useNotamBriefing = (flightId: number) => {
  return useQuery<NOTAMBriefingData>({
    queryKey: ['notamBriefing', flightId],
    queryFn: () => 'null',
    staleTime: 6 * 1000 * 60 * 60,
    cacheTime: 1 * 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};

export default useNotamBriefing;
