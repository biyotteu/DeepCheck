import { atom, selector } from "recoil";
import http from "../utils/http";
import { userSelector } from "./token";

const reviewModalAtom = atom({
  key: "reviewModalAtom",
  default: false,
});
export const reviewSelector = selector({
  key: "reviewSelector",
  get: ({ get }: any) => {
    return get(reviewModalAtom);
  },
  set: ({ get, set }, newData) => {
    set(reviewModalAtom, newData);
    // if (newData) {
    //   http.get("/user/surveyStatus/" + get(userSelector)?.email).then((res) => {
    //     if (res.data.detail) {
    //       set(reviewModalAtom, false);
    //     } else {
    //       set(reviewModalAtom, true);
    //     }
    //   });
    // } else {
    //   set(reviewModalAtom, false);
    // }
  },
});
