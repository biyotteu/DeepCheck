import { atom, selector } from "recoil";
import {
  getAccessToken,
  getRefreshToken,
  removeTokenAll,
  setTokenCookie,
} from "../utils/jwt";
import http from "../utils/http";
import jwt_decode from "jwt-decode";

/* const SIGNOUT_USER_STATE = null;
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
        const { email }:{email:string} = jwt_decode(accessToken);
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

export default userAtom; */

type Token = {
  accessToken: string;
  refreshToken: string;
};

const tokenEffect =
  () =>
  ({ onSet, setSelf }: any) => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();
    if (!accessToken || !refreshToken) {
      removeTokenAll();
      setSelf(null);
    } else {
      setSelf({
        accessToken,
        refreshToken,
      });
    }
    onSet((newToken: Token) => {
      if (newToken) {
        setTokenCookie("ACCESS_TOKEN", newToken.accessToken);
        setTokenCookie("REFRESH_TOKEN", newToken.refreshToken);
      } else {
        removeTokenAll();
      }
    });
  };

const tokenAtom = atom<Token | null>({
  key: `user/${new Date().getUTCMilliseconds() * Math.random()}`,
  effects: [tokenEffect()],
  default: null,
});

export const tokenSelector = selector({
  key: "tokenSelector",
  get: ({ get }) => get(tokenAtom),
  set: ({ set }, newToken) => {
    set(tokenAtom, newToken);
    if (newToken == null) {
      removeTokenAll();
    } else {
    }
  },
});

export const userSelector = selector({
  key: "userInfoSelector",
  get: ({ get }) => {
    const accessToken = get(tokenAtom)?.accessToken;
    if (accessToken) {
      const { username, permission }: { username: string; permission: string } =
        jwt_decode(accessToken);
      return {
        email: username,
        permission,
      };
    } else {
      return null;
    }
  },
});

export const isAuthorizedSelector = selector({
  key: "isAuthorizedSelector",
  get: ({ get }) => {
    if (get(tokenAtom)) return true;
    else return false;
  },
});
