import { atom } from "recoil";

export const categoriesAtom = atom({
  key: "categories", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});

export const storiesAtom = atom({
  key: "stories", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});

export const jwtATom = atom({
  key: "JWT", // unique ID (with respect to other atoms/selectors)
  default: undefined, // default value (aka initial value)
});

export const userInfoAtom = atom({
  key: "userInfo", // unique ID (with respect to other atoms/selectors)
  default: undefined, // default value (aka initial value)
});