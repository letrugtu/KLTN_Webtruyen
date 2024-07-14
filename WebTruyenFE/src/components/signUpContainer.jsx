import { signal, useSignal } from "@preact/signals-react";
import { register } from "../apis/service";
import { toast } from "react-toastify";
import { useState } from "react";
import { checkPasswordLength, validateEmail } from "../helpers/helper";
import { useNavigate } from "react-router-dom";

export const SignUpContainer = () => {
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [rpassword, setRPass] = useState("");
  const navigate = useNavigate();

  const Register = async () => {
    if (!validateEmail(email)) {
      toast.warning("Email sai cú pháp");
      return;
    }

    if (!checkPasswordLength(password)) {
      toast.warning("Mật khẩu phải lớn hơn hoặc bằng 6 kí tự");
      return;
    }

    if (password != rpassword) {
      toast.warning("Mật khẩu không giống nhau");
      return;
    }
    const res = await register({
      email: email,
      password: password,
    });
    if (res?.type != "error") {
      navigate("/login");
    }
  };
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
        <div className="mb-3">
          <div className="mb-3 text-xl font-semibold">Re-Password</div>
          <input
            type="password"
            value={rpassword.value}
            onChange={(event) => {
              setRPass(event.target.value);
            }}
            className="w-full rounded-xl px-5 py-2 border border-black"
            placeholder="Password"
          />
        </div>
        <div className="my-10"></div>
        <button
          onClick={Register}
          className="bg-blue-500 rounded-md justify-center p-3 font-medium text-white items-center inline-flex border-2 hover:-translate-x-2 hover:text-black hover:bg-white transition ease-in-out w-full mb-2"
        >
          Đăng Kí
        </button>
      </div>
    </>
  );
};
