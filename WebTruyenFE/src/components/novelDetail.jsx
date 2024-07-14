import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { jwtATom, storiesAtom, userInfoAtom } from "../states/atom";
import { emptyAvatar } from "../data/data";
import { CommentContainer } from "./commentContainer";
import { useState } from "react";
import {
  callAPIFEDelToken,
  callAPIFEPostToken,
  callApiFEGet,
  getStories,
  getUserInfo,
  unlockChapter,
} from "../apis/service";
import { CreateReview, DeleteChapter, GetStoryDetail } from "../apis/apis";
import { toast } from "react-toastify";
import { getEmailPrefix } from "../helpers/helper";
import { RatingContainer } from "./ratingContainer";

export const NovelDetail = ({ novel, setNovel }) => {
  const [stories, setStories] = useRecoilState(storiesAtom);
  const [JWT, setJWT] = useRecoilState(jwtATom);
  const [review, setReview] = useState("");
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);
  const navigate = useNavigate();
  const AuthorStories = stories
    .filter((story) => story.author == novel.author)
    .slice(0, 10);

  const uploadReview = async () => {
    callAPIFEPostToken(JWT, CreateReview, {
      content: review,
      storyID: novel.id,
    }).then(() => {
      getUserInfo(JWT).then((res) => {
        if (res?.type == "error") {
          setJWT(undefined);
          setUserInfo(undefined);
          navigate("/login");
        } else {
          setJWT(cookies.JWT);
          setUserInfo({ ...res, username: getEmailPrefix(res.email) });
        }
      });
    });
  };

  const payChapter = async (cid) => {
    if (JWT) {
      unlockChapter([cid], JWT).then(() => {
        getUserInfo(JWT).then((res) => {
          setUserInfo({ ...res, username: getEmailPrefix(res.email) });
        });
      });
    } else {
      toast.info("Đăng nhập để có thể xem chương này");
    }
  };

  const DelChapter = async (id) => {
    callAPIFEDelToken(JWT, DeleteChapter, id).then((res) => {
      if (res.type != "error") {
        toast.success("Xóa Chương Thành Công");
        setNovel()
      }
    });
  };
  return (
    <>
      <div className="px-20 py-5 flex">
        <div className="w-3/4">
          <div className="underline text-2xl font-serif underline-offset-8 mb-10">
            THÔNG TIN TRUYỆN
          </div>
          <div className="mt-5 flex mb-5 ">
            <div className="w-1/4">
              <img src={novel?.image} alt="novelimg" />
              <div className="mt-10">
                <div className="mb-3">
                  <span className="font-bold text-neutral-700">Tác giả: </span>{" "}
                  {novel?.author}{" "}
                </div>
                <div className="mb-3">
                  <span className="font-bold text-neutral-700">Thể loại: </span>{" "}
                  {novel?.category?.name}{" "}
                </div>
                <div className="mb-3">
                  <span className="font-bold text-neutral-700">
                    Số chương:{" "}
                  </span>{" "}
                  {novel?.chapers?.length ?? 0}{" "}
                </div>
                {novel?.createdBy==userInfo?.id?<div className="mb-3">
                  <Link to={`/${userInfo?.role?.id==1?"user":"admin"}/editNovel/${novel?.id}`} className="font-extrabold text-neutral-700">Chỉnh sửa </Link>
                </div>:""}
              </div>
            </div>
            <div className="w-3/4 px-10 ">
              <div className="text-center">{novel?.title ?? ""}</div>
              <hr className="my-5 w-full" />
              
                <RatingContainer rates={novel?.rates} story={novel} setStory={setNovel}/>
              
              <div className="text-lg font-thin">
                <p>{novel?.description} </p>
              </div>
            </div>
          </div>

          <div className="underline text-2xl font-serif underline-offset-8 mb-6">
            DANH SÁCH CHƯƠNG
          </div>
          <div className="flex mb-5">
            <div className="w-1/2 cursor-pointer pr-5">
              {novel?.chapers?.slice(0, 50)?.map((c) => {
                if (userInfo?.roleId == 2) {
                  return (
                    <div
                      key={c.id}
                      className="flex items-center justify-between text-medium hover:underline"
                    >
                      <span
                        onClick={() => navigate(`/chapter/${novel.id}/${c.id}`)}
                      >
                        * Chương {c.order}: {c.name}
                      </span>{" "}
                      <span className="flex items-center">
                        <Icon
                          onClick={() => DelChapter(c.id)}
                          icon="mdi:trash"
                          className="text-xl"
                        />
                      </span>
                    </div>
                  );
                } else if (c.status) {
                  return (
                    <div
                      key={c.id}
                      onClick={() => navigate(`/chapter/${novel.id}/${c.id}`)}
                      className="text-medium hover:underline"
                    >
                      * Chương {c.order}: {c.name}
                    </div>
                  );
                } else if (userInfo?.chapters?.find((ch) => ch.id == c.id)) {
                  return (
                    <div
                      key={c.id}
                      onClick={() => navigate(`/chapter/${novel.id}/${c.id}`)}
                      className="flex items-center justify-between text-medium hover:underline"
                    >
                      <span>
                        * Chương {c.order}: {c.name}
                      </span>{" "}
                      <span className="flex items-center">
                        <Icon icon="mingcute:unlock-fill" />
                        Mở
                      </span>
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={c.id}
                      onClick={() => payChapter(c.id)}
                      className="flex items-center justify-between text-medium hover:underline"
                    >
                      <span>
                        * Chương {c.order}: {c.name}
                      </span>{" "}
                      <span className="flex items-center">
                        <Icon icon="material-symbols:lock" className="mr-2" />{" "}
                        Khóa
                      </span>
                    </div>
                  );
                }
              })}
            </div>
            <div className="w-1/2"></div>
          </div>
        </div>

        <div className="w-1/4  p-5 bg-gray-100">
          <div className="underline text-lg font-serif underline-offset-8 mb-5">
            TRUYỆN CÙNG TÁC GIẢ
          </div>
          <hr className="my-5 w-full border-neutral-400" />
          {AuthorStories.map((s) => (
            <>
              <div className="w-full flex items-center">
                <div
                  onClick={() => navigate(`/noveldetail/${s.id}`)}
                  className="w-1/3 flex justify-between"
                >
                  <img src={s?.image} className="object-fill" />
                </div>
                <div className="w-2/3 px-5">
                  <div
                    className="flex font-bold items-center text-neutral-600 text-2xl hover:underline mb-2"
                    onClick={() => navigate(`/noveldetail/${s.id}`)}
                  >
                    <Icon icon="foundation:page-multiple" className="mr-2" />{" "}
                    {s?.title}
                  </div>
                  <div className="text-thin italic flex items-center">
                    <Icon icon="material-symbols:edit" className="mr-2" />{" "}
                    {s?.author}
                  </div>
                </div>
              </div>
              <hr className="my-5 w-full border-neutral-400" />
            </>
          ))}
        </div>
      </div>

      <div className="px-20">
        <div className="underline text-2xl font-serif underline-offset-8 mb-2">
          BÌNH LUẬN TRUYỆN
        </div>
        <div className="font-semibold mb-10">
          {novel?.reviews?.length ?? 0} bình luận
        </div>
        {JWT ? (
          <>
            <div className="flex mb-10">
              <img className="rounded-full h-12 w-12 mr-3" src={emptyAvatar} />
              <textarea
                className="w-11/12 h-20 p-5"
                onChange={(event) => setReview(event.target.value)}
                value={review}
              ></textarea>
            </div>
            <div className="flex justify-end" onClick={uploadReview}>
              <button className="px-5 py-3 bg-blue-800 text-white">Đăng</button>
            </div>
          </>
        ) : (
          ""
        )}
        <CommentContainer comment={novel?.reviews} setNovel={setNovel}/>
      </div>
    </>
  );
};
