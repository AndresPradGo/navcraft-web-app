import { useMutation, useQueryClient} from '@tanstack/react-query';

import apiClient from '../services/briefingClient'
import { APIClientError } from '../../../services/apiClient';
import type { NOTAMBriefingData, NOTAMBriefingFromAPI, BriefingRequest } from '../services/briefingClient'


const useNotamBriefingRequest = (flightId: number) => {
    const queryClient = useQueryClient();
    return useMutation<NOTAMBriefingData, APIClientError, BriefingRequest>({
        mutationFn: data => (
            apiClient.post(data, `/notam/${flightId}`) as Promise<NOTAMBriefingFromAPI>
        ),
        onMutate: () => {
            queryClient.setQueryData<NOTAMBriefingData>(
                ['notamBriefing', flightId], 
                () => "mutating" as "mutating"
            )
        },
        onSuccess: (briefingData) => {
            queryClient.setQueryData<NOTAMBriefingData>(
                ['notamBriefing', flightId], 
                () => briefingData
            )
        },
        onError: () => {
            queryClient.setQueryData<NOTAMBriefingData>(
                ['notamBriefing', flightId], 
                () => "error" as "error"
            )
        }
    })
}

export default useNotamBriefingRequest