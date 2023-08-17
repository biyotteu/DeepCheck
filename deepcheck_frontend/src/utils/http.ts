import axios from "axios";
import { getAccessToken, getRefreshToken, setTokenCookie } from "./jwt";

const http = axios.create({ baseURL: "https://deepcheck.site/api/" });

http.interceptors.request.use(
  async (config) => {
    const accessToekn = getAccessToken();

    if (accessToekn) {
      config.headers.Authorization = `Bearer ${accessToekn}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

http.interceptors.response.use(
  async (response) => {
    // console.log(response);
    return response;
  },
  async (error) => {
    const { config, response } = error;
    // console.log(response);
    // if (status === 401) {
    if (response && response.data && response.data.code === 401) {
      const originalRequest = config;
      const refreshToken = getRefreshToken();
      // token refresh 요청
      const { data } = await http.post(
        "/api/token/update", // token refresh api
        {
          refreshToken,
        }
      );
      // 새로운 토큰 저장
      const { access_token: newAccessToken, refresh_token: newRefreshToken } =
        data;

      setTokenCookie("ACCESS_TOKEN", newAccessToken);
      setTokenCookie("REFRESH_TOKEN", newRefreshToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      // 401로 요청 실패했던 요청 새로운 accessToken으로 재요청
      return http(originalRequest);
    }
    // }
    Promise.reject(error);
  }
);

export default http;
