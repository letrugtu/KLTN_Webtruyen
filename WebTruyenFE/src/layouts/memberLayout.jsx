import { Outlet, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userInfoAtom } from "../states/atom";
import { useEffect } from "react";

export const MemberLayout = () => {
    const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);
    const navigate = useNavigate();
    useEffect(() => {
        if (userInfo?.role?.id != 1) {
            navigate("/");
          }
    }, [])

    return<>
    <Outlet />
    </>
}