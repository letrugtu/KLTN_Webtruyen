import { useRecoilState } from "recoil";
import { jwtATom, userInfoAtom } from "../states/atom";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  callAPIFEPostToken,
  changePassword,
  getUserInfo,
} from "../apis/service";
import { ChangePassword, CreateQR, UpdateUserInfo } from "../apis/apis";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactModal from "react-modal";
import { getEmailPrefix } from "../helpers/helper";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";

export const Profile = () => {
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);
  const [JWT, setJWT] = useRecoilState(jwtATom);
  const [QR, setQR] = useState(undefined);
  const [profileModal, setModal] = useState(false);
  const [changePassModal, setChangePassModal] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["JWT"]);
  const navigate = useNavigate();
  useEffect(() => {
    getUserInfo(JWT).then((res) => {
      if (res?.type == "error") {
        setJWT(undefined);
        setUserInfo(undefined);
        navigate("/login");
      } else {
        setUserInfo({ ...res, username: getEmailPrefix(res.email) });
      }
    });
  }, []);

  const createPayment = async (ammount) => {
    callAPIFEPostToken(JWT, CreateQR, ammount).then((res) => {
      setQR(res.fileContents);
    });
  };

  const updateUserInfo = async () => {
    callAPIFEPostToken(JWT, UpdateUserInfo, {
      phone: userInfo.phone,
      address: userInfo.address,
      password: userInfo.password,
    });
  };

  const chPassword = async () => {
    const oldPassword = document.getElementById("oldpass").value;
    const newPassword = document.getElementById("newpass").value;

    if (oldPassword?.length < 6 || newPassword?.length < 6) {
      toast.warning("Mật khẩu phải đủ 6 kí tự");
      return;
    }

    if (oldPassword == newPassword) {
      toast.warning("Mật khẩu mới phải khác mật khẩu cũ");
      return;
    }

    changePassword(JWT, {
      oldPassword,
      newPassword,
    })
      .then(() => {
        removeCookie("JWT");
        setJWT(undefined);
        setUserInfo(undefined);
        navigate("/");
      })
      .catch(() => {
        toast.warning("Sai mật khẩu");
      });
  };
  return (
    <>
      <div className="px-40 py-10 text-xl">
        <div className="underline text-2xl font-serif underline-offset-8 mb-10">
          THÔNG TIN CÁ NHÂN
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-left">Email</div>
          <div className="text-left">{userInfo?.email}</div>
          <div></div>
          <div className="text-left">Số điện thoại</div>
          <div className="text-left">{userInfo?.phone}</div>
          <Icon onClick={() => setModal(true)} icon="material-symbols:edit" />
          <div className="text-left">Địa chỉ</div>
          <div className="text-left">{userInfo?.address}</div>
          <Icon onClick={() => setModal(true)} icon="material-symbols:edit" />
          <div className="text-left">Số dư</div>
          <div className="text-left">{userInfo?.accountBalance ?? 0} xu</div>
          <Icon onClick={() => setModal(true)} icon="material-symbols:edit" />
          <div className="text-left">Nạp xu vào tài khoản</div>
          <div className="flex font-medium">
            <button
              onClick={() => createPayment(10000)}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 py-3 px-5 text-white rounded-2xl mr-3"
            >
              100 xu
            </button>
            <button
              onClick={() => createPayment(10000)}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 py-3 px-5 text-white rounded-2xl mr-3"
            >
              1000 xu
            </button>
            <button
              onClick={() => createPayment(100000)}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 py-3 px-5 text-white rounded-2xl mr-3"
            >
              10000 xu
            </button>
          </div>
        </div>
        {QR ? <img src={`data:image/jpeg;base64, ${QR}`} /> : ""}

        <button onClick={() => setChangePassModal(true)} className="bg-blue-800 text-white px-5 py-3 mt-5">Đổi mật khẩu</button>
      </div>

      <ReactModal
        isOpen={profileModal}
        className="w-1/2 m-auto px-10 py-5 mt-20 bg-neutral-100 text-black text-xl border"
        contentLabel="Thông tin người dùng"
      >
        <div>
          <div className="flex justify-end" onClick={() => setModal(false)}>
            <Icon icon="ion:log-out" className="text-3xl" />
          </div>
          <div className="my-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-left">Email</div>
              <div className="text-left">{userInfo?.email}</div>
              <div className="text-left">Số điện thoại</div>
              <input
                className="px-5 py-1"
                value={userInfo?.phone}
                onChange={(event) =>
                  setUserInfo({ ...userInfo, phone: event.target.value })
                }
              />
              <div className="text-left">Địa chỉ</div>
              <input
                className="px-5 py-1"
                value={userInfo?.address}
                onChange={(event) =>
                  setUserInfo({ ...userInfo, address: event.target.value })
                }
              />
            </div>
            <div className="flex justify-end">
              <button
                className="py-2 px-5 bg-blue-800 mt-3 text-white"
                onClick={updateUserInfo}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      </ReactModal>

      <ReactModal
        isOpen={changePassModal}
        className="w-1/2 m-auto px-10 py-5 mt-20 bg-neutral-100 text-black text-xl border"
        contentLabel="Đổi mật khẩu"
      >
        <div>
          <div
            className="flex justify-end"
            onClick={() => setChangePassModal(false)}
          >
            <Icon icon="ion:log-out" className="text-3xl" />
          </div>
          <div className="my-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-left">Mật khẩu cũ</div>
              <input id="oldpass" className="px-5 py-1" />
              <div className="text-left">Mật khẩu mới</div>
              <input id="newpass" className="px-5 py-1" />
            </div>
            <div className="flex justify-end">
              <button
                className="py-2 px-5 bg-blue-800 mt-3 text-white"
                onClick={chPassword}
              >
                Thay đổi
              </button>
            </div>
          </div>
        </div>
      </ReactModal>
    </>
  );
};
