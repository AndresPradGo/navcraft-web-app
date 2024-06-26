import axios, { AxiosResponse } from 'axios';
import useAuth from '../hooks/useAuth';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_NAVCRAFT_API_URL as string,
});

interface APIResponseData {
  detail: string | { [key: string]: unknown }[];
}
interface APIResponse {
  data: APIResponseData;
  status: number;
}

export interface APIClientError extends Error {
  response?: APIResponse;
}

class APIClient<TPost, TGet> {
  endpoint: string;
  private _controller: AbortController;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
    this._controller = new AbortController();
  }

  private _setAuthHeader = () => {
    const user = useAuth();
    axiosInstance.defaults.headers.common['Authorization'] = user
      ? user.authorization
      : '';
  };

  private _getEndpoint = (endpointPostfix?: string): string => {
    return `${this.endpoint}${endpointPostfix ? endpointPostfix : ''}`;
  };

  cancelRequest = () => {
    this._controller.abort();
  };

  getAll = (endpointPostfix?: string): Promise<TGet[]> => {
    this._setAuthHeader();
    return axiosInstance
      .get<TGet[]>(this._getEndpoint(endpointPostfix), {
        signal: this._controller.signal,
      })
      .then((res) => res.data);
  };

  getAndPreProcessAll = <TFromAPI>(
    handlePreProcess: (preData: TFromAPI[]) => TGet[] | [],
    endpointPostfix?: string,
  ): Promise<TGet[] | []> => {
    this._setAuthHeader();
    return axiosInstance
      .get<TFromAPI[]>(this._getEndpoint(endpointPostfix), {
        signal: this._controller.signal,
      })
      .then((res) => handlePreProcess(res.data));
  };

  get = (endpointPostfix?: string): Promise<TGet> => {
    this._setAuthHeader();
    return axiosInstance
      .get<TGet>(this._getEndpoint(endpointPostfix), {
        signal: this._controller.signal,
      })
      .then((res) => res.data);
  };

  getAndPreProcess = <TFromAPI>(
    handlePreProcess: (preData: TFromAPI) => TGet,
    endpointPostfix?: string,
  ): Promise<TGet> => {
    this._setAuthHeader();
    return axiosInstance
      .get<TFromAPI>(this._getEndpoint(endpointPostfix))
      .then((res) => handlePreProcess(res.data));
  };

  getCsvFile = (endpointPostfix?: string): Promise<AxiosResponse<TGet>> => {
    this._setAuthHeader();
    return axiosInstance.get<TGet>(this._getEndpoint(endpointPostfix), {
      signal: this._controller.signal,
    });
  };

  getZipOrImage = (endpointPostfix?: string): Promise<AxiosResponse<Blob>> => {
    this._setAuthHeader();
    return axiosInstance.get<Blob>(this._getEndpoint(endpointPostfix), {
      responseType: 'arraybuffer',
      signal: this._controller.signal,
    });
  };

  post = (data: TPost, endpointPostfix?: string): Promise<TGet> => {
    this._setAuthHeader();
    return axiosInstance
      .post<TGet>(this._getEndpoint(endpointPostfix), data, {
        signal: this._controller.signal,
      })
      .then((res) => res.data);
  };

  postAndPreProcess = <TFromAPI>(
    data: TPost,
    handlePreProcess: (preData: TFromAPI) => TGet,
    endpointPostfix?: string,
  ): Promise<TGet> => {
    this._setAuthHeader();
    return axiosInstance
      .post<TFromAPI>(this._getEndpoint(endpointPostfix), data, {
        signal: this._controller.signal,
      })
      .then((res) => handlePreProcess(res.data));
  };

  postWithoutAuth = (data: TPost, endpointPostfix?: string): Promise<TGet> => {
    return axiosInstance
      .post<TGet>(this._getEndpoint(endpointPostfix), data, {
        signal: this._controller.signal,
      })
      .then((res) => res.data);
  };

  postOther = <TPostOther>(
    data: TPostOther,
    endpointPostfix?: string,
  ): Promise<TGet> => {
    this._setAuthHeader();
    return axiosInstance
      .post<TGet>(this._getEndpoint(endpointPostfix), data, {
        signal: this._controller.signal,
      })
      .then((res) => res.data);
  };

  postAndGetOther = <TGetOther>(
    data: TPost,
    endpointPostfix?: string,
  ): Promise<TGetOther> => {
    this._setAuthHeader();
    return axiosInstance
      .post<TGetOther>(this._getEndpoint(endpointPostfix), data, {
        signal: this._controller.signal,
      })
      .then((res) => res.data);
  };

  edit = (data: TPost, endpointPostfix?: string): Promise<TGet> => {
    this._setAuthHeader();
    return axiosInstance
      .put<TGet>(this._getEndpoint(endpointPostfix), data, {
        signal: this._controller.signal,
      })
      .then((res) => res.data);
  };

  editOther = <TPostOther>(
    data: TPostOther,
    endpointPostfix?: string,
  ): Promise<TGet> => {
    this._setAuthHeader();
    return axiosInstance
      .put<TGet>(this._getEndpoint(endpointPostfix), data, {
        signal: this._controller.signal,
      })
      .then((res) => res.data);
  };

  editAndPreProcess = <TFromAPI>(
    data: TPost,
    handlePreProcess: (preData: TFromAPI) => TGet,
    endpointPostfix?: string,
  ): Promise<TGet> => {
    this._setAuthHeader();
    return axiosInstance
      .put<TFromAPI>(this._getEndpoint(endpointPostfix), data, {
        signal: this._controller.signal,
      })
      .then((res) => handlePreProcess(res.data));
  };

  editAndGetOther = <TGetOther>(
    data: TPost,
    endpointPostfix?: string,
  ): Promise<TGetOther> => {
    this._setAuthHeader();
    return axiosInstance
      .put<TGetOther>(this._getEndpoint(endpointPostfix), data, {
        signal: this._controller.signal,
      })
      .then((res) => res.data);
  };

  editOtherAndPreProcess = <TPostOther, TFromAPI>(
    data: TPostOther,
    handlePreProcess: (preData: TFromAPI) => TGet,
    endpointPostfix?: string,
  ): Promise<TGet> => {
    this._setAuthHeader();
    return axiosInstance
      .put<TFromAPI>(this._getEndpoint(endpointPostfix), data, {
        signal: this._controller.signal,
      })
      .then((res) => handlePreProcess(res.data));
  };

  editOtherAndPreProcessWithHeader = <TPostOther, TFromAPI>(
    data: TPostOther,
    handlePreProcess: (
      preData: TFromAPI,
      toke: string,
      tokenType: string,
    ) => TGet,
    endpointPostfix?: string,
  ): Promise<TGet> => {
    this._setAuthHeader();
    return axiosInstance
      .put<TFromAPI>(this._getEndpoint(endpointPostfix), data, {
        signal: this._controller.signal,
      })
      .then((res) => {
        return handlePreProcess(
          res.data,
          res.headers['x-access-token'] as string,
          res.headers['x-token-type'] as string,
        );
      });
  };

  delete = (endpointPostfix?: string): Promise<string> => {
    this._setAuthHeader();
    return axiosInstance
      .delete(this._getEndpoint(endpointPostfix), {
        signal: this._controller.signal,
      })
      .then(() => 'Deleted successfully.');
  };

  deleteWithReturn = (endpointPostfix?: string): Promise<TGet> => {
    this._setAuthHeader();
    return axiosInstance
      .delete(this._getEndpoint(endpointPostfix), {
        signal: this._controller.signal,
      })
      .then((res) => res.data as TGet);
  };
}

export default APIClient;
