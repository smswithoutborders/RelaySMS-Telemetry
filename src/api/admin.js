import axios from 'axios';

// ==============================|| ADMIN API CLIENT ||============================== //

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_APP_ADMIN_API || '/v1/',
  withCredentials: true,
  // FastAPI reads repeated keys for list params, e.g. group_by=status&group_by=platform_name.
  paramsSerializer: { indexes: null }
});

let unauthorizedHandler = null;

// Called when any request comes back 401, e.g. the session expired.
export function onUnauthorized(handler) {
  unauthorizedHandler = handler;
  return () => {
    if (unauthorizedHandler === handler) unauthorizedHandler = null;
  };
}

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) unauthorizedHandler?.();
    return Promise.reject(error);
  }
);

export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (!error?.response) return 'Unable to reach the server. Please check your connection.';
  if (error.response.status === 429) return 'Too many attempts. Please wait a moment and try again.';
  return error.response.data?.error || fallback;
}

export default adminApi;
