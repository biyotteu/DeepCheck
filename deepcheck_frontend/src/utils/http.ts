import axios from "axios";

const http = axios.create({ baseURL: "https://deepcheck.site/api/" });

// http.interceptors.request.use(
//   async config => {
//     const accessToekn = await getAccessToken();
//     const isAuth = await isAuthenticated();
//     if (isAuth) {
//       config.headers.Authorization = `Bearer ${accessToekn}`;
//     }
//     return config;
//   },
//   error => {
//     Promise.reject(error);
//   },
// );

// http.interceptors.response.use(
//   async response => {
//     // console.log(response);
//     return response;
//   },
//   async error => {
//     const {config, response} = error;
//     // console.log(response);
//     // if (status === 401) {
//     if (response && response.data && response.data.code === 5103) {
//       const originalRequest = config;
//       const refreshToken = await AsyncStorage.getItem('refreshToken');
//       // token refresh 요청
//       const {data} = await http.post(
//         '/users/token/update', // token refresh api
//         {
//           refreshToken,
//         },
//       );
//       // 새로운 토큰 저장
//       const {accessToken: newAccessToken, refreshToken: newRefreshToken} =
//         data.result;

//       setToken(newAccessToken, newRefreshToken);
//       // axios.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
//       // http.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
//       originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//       // 401로 요청 실패했던 요청 새로운 accessToken으로 재요청
//       return http(originalRequest);
//     }
//     // }
//     Promise.reject(error);
//   },
// );

export default http;
