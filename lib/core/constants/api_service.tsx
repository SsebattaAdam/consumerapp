

import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { APP_BASE_URL } from './app_constants';

// Create Axios instance
const apiService: AxiosInstance = axios.create({
  baseURL: APP_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',

  },
});

//  Request Interceptor
apiService.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    
    const token = ''; 
    if (token) {
     
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log('🛰️ [Request]', config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  (error: AxiosError) => {
    console.error('[Request Error]', error);
    return Promise.reject(error);
  },
  {
    synchronous: true,
    runWhen: () => true,
  }
);

//  Response Interceptor
apiService.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(' [Response]', response.status, response.config.url);
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      console.error(' [Response Error]', error.response.status, error.response.data);
    } else {
      console.error(' [Network Error]', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiService;
