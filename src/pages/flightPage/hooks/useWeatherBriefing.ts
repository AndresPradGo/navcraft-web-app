import { useQuery } from '@tanstack/react-query';
import type { WeatherBriefingFromAPI } from '../services/briefingClient'

const useWeatherBriefing = (flightId: number) => {
  return useQuery<WeatherBriefingFromAPI | null>({
    queryKey: ['weatherBriefing', flightId],
    queryFn: () => null,
    staleTime: 6 * 1000 * 60 * 60,
    cacheTime: 1 * 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false
  })
}

export default useWeatherBriefing