import { atom } from "recoil";
import { getAccessToken, getRefreshToken, removeTokenAll } from "../utils/jwt";
import http from "../utils/http";

const SIGNOUT_USER_STATE = {
  email: "",
};
const cookieEffect =
  (accessTokenKey: "ACCESS_TOKEN", refreshTokenKey: "REFRESH_TOKEN") =>
  ({ setSelf, onSet }: any) => {
    onSet(async () => {
      try {
        const accessToken = getAccessToken();
        const refreshToken = getRefreshToken();

        if (!accessToken || !refreshToken) {
          removeTokenAll();
          return SIGNOUT_USER_STATE;
        }
        const { email } = jwt_decode(accessToken);
        return {
          email,
        };
        // const { data } = await http.post("/api/user/userinfo", {
        //   accessToken: accessToken,
        // });

        // const { userId, email, nickname, profileImage } = data;
        // return { userId, email, nickname, profileImage, isLoggedIn: true };
      } catch (error: unknown) {
        removeTokenAll();
        console.error(error);
        return SIGNOUT_USER_STATE;
      }
    });
  };

const userAtom = atom({
  key: `user/${new Date().getUTCMilliseconds() * Math.random()}`,
  effects: [cookieEffect("ACCESS_TOKEN", "REFRESH_TOKEN")],
  default: SIGNOUT_USER_STATE,
});

export default userAtom;
function jwt_decode(accessToken: any): { email: any } {
  throw new Error("Function not implemented.");
}
