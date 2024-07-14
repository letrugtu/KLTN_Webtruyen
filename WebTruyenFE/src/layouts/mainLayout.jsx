import { Outlet, useNavigate } from "react-router-dom";
import { Navbar } from "../components/navbar";
import { useRecoilState } from "recoil";
import { useEffect, useReducer } from "react";
import { categoriesAtom, jwtATom, storiesAtom, userInfoAtom } from "../states/atom";
import { getCategory, getStories, getUserInfo } from "../apis/service";
import { useCookies } from "react-cookie";
import { getEmailPrefix } from "../helpers/helper";
import { toast } from "react-toastify";

export const MainLayout = () => {
  const [cookies, setCookie] = useCookies(["JWT"]);
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);
  const [categories, setCate] = useRecoilState(categoriesAtom);
  const [stories, setStories] = useRecoilState(storiesAtom);
  const [JWT, setJWT] = useRecoilState(jwtATom);

  const navigate = useNavigate();
  useEffect(() => {
    getCategory().then((res) => setCate(res));
    getStories({}).then((res) => setStories(res));
    if (cookies.JWT!="undefined"&&cookies.JWT!=undefined) {
      getUserInfo(cookies.JWT).then((res) => {
        if (res?.type == "error") {
          setJWT(undefined);
          setUserInfo(undefined);
          navigate("/login");
        } else {
          setJWT(cookies.JWT);
          setUserInfo({ ...res, username: getEmailPrefix(res.email) });
        }
      });
    }
  }, []);
  return (
    <div className="bg-neutral-200 min-h-screen">
      <Navbar />
      <Outlet />
    </div>
  );
};
