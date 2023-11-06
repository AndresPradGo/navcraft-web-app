import axios, {AxiosResponse} from 'axios'
import useAuth from '../hooks/useAuth';

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000'
})

interface APIResponseData {
    detail: string | {[key: string]: any}[]
}
interface APIResponse {
    data: APIResponseData,
    status: number
}
export interface APIClientError extends Error {
    response?: APIResponse
}

class APIClient<TPost, TGet> {
    endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = endpoint;
    }

    _setAuthHeader = () => {
        const user = useAuth()
        axiosInstance.defaults.headers.common['Authorization'] = user? user.authorization : ""
    }

    _getEndpoint = (endpointPostfix?: string): string => {
        return `${this.endpoint}${endpointPostfix ? endpointPostfix : ""}`
    }

    getAll = (endpointPostfix?: string): Promise<TGet[]> => {
        this._setAuthHeader()
        return axiosInstance.get<TGet[]>(this._getEndpoint(endpointPostfix)).then(res => res.data)
    }

    getAndPreProcessAll = <TFromAPI>(
        handlePreProcess: (preData: TFromAPI[]) => TGet[] | [], 
        endpointPostfix?: string
    ): Promise<TGet[] | []> => {
        this._setAuthHeader()
        return axiosInstance.get<TFromAPI[]>(this._getEndpoint(endpointPostfix)).then(res => handlePreProcess(res.data))
    }

    get = (endpointPostfix?: string): Promise<TGet> => {
        this._setAuthHeader()
        return axiosInstance.get<TGet>(this._getEndpoint(endpointPostfix)).then(res => res.data)
    }

    getAndPreProcess = <TFromAPI>(
        handlePreProcess: (preData: TFromAPI) => TGet, 
        endpointPostfix?: string
    ): Promise<TGet> => {
        this._setAuthHeader()
        return axiosInstance.get<TFromAPI>(this._getEndpoint(endpointPostfix)).then(res => handlePreProcess(res.data))
    }

    getCsvFile = (endpointPostfix?: string): Promise<AxiosResponse<TGet>> => {
        this._setAuthHeader()
        return axiosInstance.get<TGet>(this._getEndpoint(endpointPostfix))
    }

    getZip = (endpointPostfix?: string): Promise<AxiosResponse<Blob>> => {
        this._setAuthHeader()
        return axiosInstance.get<Blob>(this._getEndpoint(endpointPostfix), {
            responseType: 'arraybuffer'
          })
    }

    post = (data: TPost, endpointPostfix?: string): Promise<TGet> => {
        this._setAuthHeader()
        return axiosInstance.post<TGet>(this._getEndpoint(endpointPostfix), data).then(res => res.data)
    }

    postAndPreProcess = <TFromAPI>(
        data: TPost,
        handlePreProcess: (preData: TFromAPI) => TGet, 
        endpointPostfix?: string
    ): Promise<TGet> => {
        this._setAuthHeader()
        return axiosInstance.post<TFromAPI>(this._getEndpoint(endpointPostfix), data).then(res => handlePreProcess(res.data))
    }

    postWithoutAuth = (data: TPost, endpointPostfix?: string): Promise<TGet> => {
        return axiosInstance.post<TGet>(this._getEndpoint(endpointPostfix), data).then(res => res.data)
    }

    postOther = <TPostOther>(data: TPostOther, endpointPostfix?: string): Promise<TGet> => {
        this._setAuthHeader()
        return axiosInstance.post<TGet>(this._getEndpoint(endpointPostfix), data).then(res => res.data)
    }

    edit = (data: TPost, endpointPostfix?: string): Promise<TGet> => {
        this._setAuthHeader()
        return axiosInstance.put<TGet>(this._getEndpoint(endpointPostfix), data).then(res => res.data)
    }

    editOther = <TPostOther>(data: TPostOther, endpointPostfix?: string): Promise<TGet> => {
        this._setAuthHeader()
        return axiosInstance.put<TGet>(this._getEndpoint(endpointPostfix), data).then(res => res.data)
    }

    editOtherAndPreProcess = <TPostOther, TFromAPI>(
        data: TPostOther, 
        handlePreProcess: (preData: TFromAPI) => TGet,  
        endpointPostfix?: string
    ): Promise<TGet> => {
        this._setAuthHeader()
        return axiosInstance.put<TFromAPI>(this._getEndpoint(endpointPostfix), data).then(res => handlePreProcess(res.data))
    }

    editOtherAndPreProcessWithHeader = <TPostOther, TFromAPI>(
        data: TPostOther, 
        handlePreProcess: (preData: TFromAPI, toke: string, tokenType: string) => TGet,  
        endpointPostfix?: string
    ): Promise<TGet> => {
        this._setAuthHeader()
        return axiosInstance.put<TFromAPI>(this._getEndpoint(endpointPostfix), data).then(res => {
            return handlePreProcess(res.data, res.headers["x-access-token"], res.headers["x-token-type"])
        }
        )
    }

    delete = (endpointPostfix?: string): Promise<string> => {
        this._setAuthHeader()
        return axiosInstance.delete(this._getEndpoint(endpointPostfix)).then(() => "Deleted successfully.")
    }
}

export default APIClient