import { signal, useSignal } from "@preact/signals-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  callAPIFEGetToken,
  callApiFEGet,
  callApiFEPost,
  getChapterDetail,
} from "../apis/service";
import {
  AddView,
  GetChapterDetail,
  GetStories,
  GetStoryDetail,
} from "../apis/apis";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRecoilState } from "recoil";
import { jwtATom } from "../states/atom";

export const ChapterDetail = () => {
  const [chapter, setChap] = useState();
  const [novel, setNol] = useState();
  const [JWT, setJWT] = useRecoilState(jwtATom);
  const params = useParams();
  useEffect(() => {
    callApiFEGet(GetStoryDetail, params.nid).then((res) => {
      setNol(res);
      callApiFEPost(AddView, res?.id);
    });
    getChapterDetail(params.id, JWT).then((res) => setChap(res));
  }, []);

  const changeChapter = async (id) => {
    getChapterDetail(id, JWT).then((res) => {
      setChap(res);
      callApiFEPost(AddView, novel?.id);
    });
  };
  return (
    <>
      <div className="bg-neutral-100 px-40 py-20 text-xl font-serif min-h-screen">
        <div className="text-center text-2xl font-thin text-lime-600 uppercase">
          {novel?.title}
        </div>
        <div className="text-center text-xl mt-2 font-thin text-neutral-600">
          Chương {chapter?.order}: {chapter?.name}
        </div>
        <div className="flex justify-center items-center mt-2">
          {/* {c.order == 1 ? (
            <div className="px-5 py-3  bg-lime-400 text-white mr-2 text-xl">
              Chương Kế
            </div>
          ) : (
            <div className="px-5 py-3  bg-lime-500 text-white mr-2 text-xl">
              Chương Kế
            </div>
          )} */}
          <select
            onChange={(event) => {
              changeChapter(event.target.value);
            }}
            value={chapter?.id}
            className="bg-lime-600 py-3 px-5 overflow-hidden text-white"
          >
            {novel?.chapers?.map((c) => {
              return (
                <option key={c.id} value={c.id}>
                  Chương {c.order}: {c.name}
                </option>
              );
            })}
          </select>
          {/* <div className="px-5 py-3  bg-lime-500 text-white ml-2 text-xl">
            Chương Sau
          </div> */}
        </div>
        <div
          className="mt-40"
          dangerouslySetInnerHTML={{ __html: chapter?.content }}
        />
        {/* <p className="mt-40">{chapter?.content}</p> */}
      </div>
    </>
  );
};
