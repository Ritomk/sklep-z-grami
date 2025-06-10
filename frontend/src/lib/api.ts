import axios from "axios";
import type {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";


const API_URL = "http://localhost:8000/api/";

export interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api: AxiosInstance = axios.create({ baseURL: API_URL });

function hardLogout(): void {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("nickname");
  window.location.href = "/logged-out";
}


api.interceptors.request.use((cfg: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    (cfg.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }
  return cfg;
});


let isRefreshing = false;
let queued: Array<(token: string) => void> = [];

function flushQueue(token: string): void {
  queued.forEach(cb => cb(token));
  queued = [];
}

api.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (err: AxiosError): Promise<AxiosResponse | never> => {
    const { response, config } = err;
    const original = config as RetryableRequestConfig;

    if (!response || response.status !== 401 || original._retry) {
      return Promise.reject(err);
    }
    original._retry = true;

    const refresh = localStorage.getItem("refresh_token");
    if (!refresh) {
      hardLogout();
      return Promise.reject(err);
    }

    if (isRefreshing) {
      return new Promise<AxiosResponse>((resolve, reject) => {
        queued.push(async token => {
          try {
            original.headers = original.headers ?? {};
            (original.headers as Record<string, string>).Authorization = `Bearer ${token}`;
            resolve(await api(original));
          } catch (e) {
            reject(e);
          }
        });
      });
    }

    try {
      isRefreshing = true;
      const { data } = await axios.post<{ access: string }>(
        `${API_URL}token/refresh/`,
        { refresh }
      );

      localStorage.setItem("access_token", data.access);
      flushQueue(data.access);

      original.headers = original.headers ?? {};
      (original.headers as Record<string, string>).Authorization = `Bearer ${data.access}`;
      return api(original);
    } catch (e) {
      hardLogout();
      return Promise.reject(e);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
