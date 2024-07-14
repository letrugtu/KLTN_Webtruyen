import { useRecoilState } from "recoil";
import logo from "../../assets/novelcomlogo.png";
import { jwtATom, storiesAtom } from "../../states/atom";
import { useEffect, useState } from "react";
import { callAPIFEPostToken } from "../../apis/service";
import { GetAllRate, GetAllReview, GetListAccount } from "../../apis/apis";
import { StatisticalChart } from "../../components/statisticalChart";
export const AdminPage = () => {
  const [stories, setStories] = useRecoilState(storiesAtom);
  const [accounts, setAccount] = useState([]);
  const [rates, setRate] = useState([]);
  const [reviews, setReview] = useState([]);
  const [JWT, setJWT] = useRecoilState(jwtATom);

  useEffect(() => {
    callAPIFEPostToken(JWT, GetListAccount, {}).then((res) => {
      setAccount(res);
    });
    callAPIFEPostToken(JWT, GetAllRate, {}).then((res) => {
      setRate(res);
    });
    callAPIFEPostToken(JWT, GetAllReview, {}).then((res) => {
      setReview(res);
    });
  }, []);
  return (
    <>
      <div>
        {/* <img src={logo} className="min-h-screen absolute -z-10" /> */}
        <div className="opacity-50 bg-slate-100 h-screen rounded-2xl px-10 py-20 mx-20 my-10 text-white">
          <div className="flex flex-wrap mb-10">
            <div className="opacity-100 mb-10 w-1/4 px-10 pr-20 py-5 mx-10 text-xl font-semibold rounded-xl bg-slate-800 h-fit">
              <div className="">Truyện</div>
              <hr className="my-3 border-white" />
              <div className="font-normal">{stories?.length ?? 0}</div>
            </div>
            <div className="opacity-100 w-1/4 px-10 pr-20 py-5 mx-10 text-xl font-semibold rounded-xl bg-slate-800 h-fit">
              <div className="">Tài khoản</div>
              <hr className="my-3 border-white" />
              <div className="font-normal">{accounts?.length ?? 0}</div>
            </div>
            <div className="opacity-100 w-1/4 px-10 pr-20 py-5 mx-10 text-xl font-semibold rounded-xl bg-slate-800 h-fit">
              <div className="">Bình luận</div>
              <hr className="my-3 border-white" />
              <div className="font-normal">{reviews?.length ?? 0}</div>
            </div>
            <div className="opacity-100 w-1/4 px-10 pr-20 py-5 mx-10 text-xl font-semibold rounded-xl bg-slate-800 h-fit">
              <div className="">Đánh giá</div>
              <hr className="my-3 border-white" />
              <div className="font-normal">{rates?.length ?? 0}</div>
            </div>
          </div>

          <StatisticalChart />
        </div>
      </div>
    </>
  );
};
