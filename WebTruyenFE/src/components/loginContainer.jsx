import { signal, useSignal } from "@preact/signals-react";
import { getUserInfo, login, resetPassword } from "../apis/service";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  checkPasswordLength,
  getEmailPrefix,
  validateEmail,
} from "../helpers/helper";
import { useRecoilState } from "recoil";
import { jwtATom, userInfoAtom } from "../states/atom";
import { toast } from "react-toastify";
import ReactModal from "react-modal";
import { Icon } from "@iconify/react/dist/iconify.js";

export const LoginContainer = () => {
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [cookies, setCookie] = useCookies(["JWT"]);
  const [JWT, setJWT] = useRecoilState(jwtATom);
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);
  const [forgotPassModal, setForgotModal] = useState(false);
  const [forgotPassEmail, setForgotEmail] = useState("");
  const navigate = useNavigate();

  const Login = async () => {
    if (!validateEmail(email)) {
      toast.warning("Email sai cú pháp");
      return;
    }

    if (!checkPasswordLength(password)) {
      toast.warning("Mật khẩu phải lớn hơn hoặc bằng 6 kí tự");
      return;
    }
    const result = await login({
      email: email,
      password: password,
    });
    if (result?.type != "error") {
      getUserInfo(result).then((res) => {
        if (res?.type == "error") {
          setCookie("JWT", undefined);
          setJWT(undefined);
          setUserInfo(undefined);
        } else {
          setCookie("JWT", result);
          setJWT(result);
          setUserInfo({ ...res, username: getEmailPrefix(res.email) });
          toast.info(`Xin chào ${getEmailPrefix(res.email)}`);
          if (res?.role.id == 2) {
            navigate("/admin");
          } else {
            navigate("/");
          }
        }
      });
    }
  };

  const resetP =()=>{
    if(forgotPassEmail?.length<1){
      toast.warning("Email không được để trống")
      return
    }

    if(!validateEmail(forgotPassEmail)){
      toast.warning("Sai định dạng email")
      return
    }

    resetPassword(forgotPassEmail)
    setForgotModal(false)
  }

  return (
    <>
      <div className="rounded-xl px-7 py-10 bg-white border-black border text-black">
        <h3 className="font-bold text-5xl mb-8 text-center">NOVELCOM</h3>

        <div className="mb-3">
          <div className="mb-3 text-xl font-semibold">Email</div>
          <input
            onChange={(event) => {
              setEmail(event.target.value);
            }}
            className="w-full rounded-xl px-5 py-2 border border-black"
            placeholder="Email"
          />
        </div>
        <div className="mb-3">
          <div className="mb-3 text-xl font-semibold">Password</div>
          <input
            onChange={(event) => {
              setPass(event.target.value);
            }}
            className="w-full rounded-xl px-5 py-2 border border-black"
            placeholder="Password"
            type="password"
          />
        </div>
        <div className="text-right">
          <button onClick={() => setForgotModal(true)}>Quên mật khẩu ?</button>
        </div>
        <div className="my-10"></div>
        <button
          onClick={Login}
          className="bg-blue-500 rounded-md justify-center p-3 font-medium text-white items-center inline-flex border-2 hover:-translate-x-2 hover:text-black hover:bg-white transition ease-in-out w-full mb-2"
        >
          Đăng Nhập
        </button>
      </div>

      <ReactModal
        isOpen={forgotPassModal}
        className="w-1/2 m-auto px-10 py-5 mt-20 bg-neutral-100 text-black text-xl border"
        contentLabel="Quên mật khẩu"
      >
        <div>
          <div
            className="flex justify-end"
            onClick={() => setForgotModal(false)}
          >
            <Icon icon="ion:log-out" className="text-3xl" />
          </div>
          <div className="my-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-left">Email</div>
              <input value={forgotPassEmail} onChange={(event) => setForgotEmail(event.target.value)} className="px-5 py-1" />
            </div>
            <div className="flex justify-end">
              <button
                className="py-2 px-5 bg-blue-800 mt-3 text-white"
                onClick={resetP}
              >
                Gửi
              </button>
            </div>
          </div>
        </div>
      </ReactModal>
    </>
  );
};
