import axios, { AxiosInstance } from "axios";

/**
 * 自定义响应类型 - 拦截器返回的类型
 */
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
  description: string;
}

const isDev = import.meta.env.MODE === "development";

// 使用Omit移除AxiosInstance的原始方法避免类型冲突
// 拦截器已返回 response.data，类型为 ApiResponse
const myAxios = axios.create({
  baseURL: isDev ? "http://localhost:8080/api" : "线上地址",
}) as unknown as {
  get<T = any>(url: string, config?: any): Promise<ApiResponse<T>>;
  post<T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>>;
  put<T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>>;
  delete<T = any>(url: string, config?: any): Promise<ApiResponse<T>>;
} & Omit<AxiosInstance, "get" | "post" | "put" | "delete">;

myAxios.defaults.withCredentials = true;

// Add a request interceptor
myAxios.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

// 响应拦截器
myAxios.interceptors.response.use(
  function (response) {
    if (response?.data?.code === 40100 || response?.data?.code === 40101) {
      const redirectUrl = window.location.href;
      window.location.href = `/user/login?redirect=${redirectUrl}`;
    }
    return response.data;
  },
  function (error) {
    return Promise.reject(error);
  },
);

export default myAxios;