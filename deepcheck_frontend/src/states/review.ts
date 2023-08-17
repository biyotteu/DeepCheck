import { atom, selector } from "recoil";
import http from "../utils/http";

const reviewModalAtom = atom({
  key: "reviewModalAtom",
  default: false,
});
export const reviewSelector = selector({
  key: "reviewSelector",
  get: ({ get }: any) => {
    return get(reviewModalAtom);
  },
  set: ({ set }, newData) => {
    if (newData) {
      http.get("/user/review/").then((res) => {
        if (res.data.detail) {
          set(reviewModalAtom, false);
        } else {
          set(reviewModalAtom, true);
        }
      });
    } else {
      set(reviewModalAtom, false);
    }
  },
});
