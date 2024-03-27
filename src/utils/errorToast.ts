import { APIClientError } from '../services/apiClient';
import { toast } from 'react-toastify';

const errorToast = (error: APIClientError) => {
  if (error.response) {
    if (typeof error.response.data.detail === 'string') {
      toast.error(error.response.data.detail, {
        position: 'top-center',
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    } else if (typeof error.response.data === 'string') {
      toast.error(error.response.data, {
        position: 'top-center',
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    } else {
      toast.error(
        "There's some invalid data in your request, please make sure all data is consistent with the expected data-format.",
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
    }
  } else
    toast.error('Something went wrong, please try again later.', {
      position: 'top-center',
      autoClose: 10000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });
};

export default errorToast;
