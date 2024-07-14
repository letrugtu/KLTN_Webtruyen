import ReactModal from "react-modal";
import { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRecoilState } from "recoil";
import { categoriesAtom, jwtATom, userInfoAtom } from "../states/atom";
import { getURL, uploadImage } from "../firebase";
import { toast } from "react-toastify";
import {
  callAPIFEDelToken,
  callAPIFEPostToken,
  callApiFEGet,
  callApiFEPost,
} from "../apis/service";
import {
  AddChapter,
  AddStory,
  DeleteChapter,
  EditChapter,
  EditStory,
  GetStoryDetail,
} from "../apis/apis";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { RTEditor } from "../components/richTextEditor";

export const EditNovel = () => {
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);
  const [editNovel, setNovel] = useState();
  const [chapterModal, setChapterModal] = useState(false);
  const [udchapterModal, setudChapterModal] = useState(false);
  const [categories, setCate] = useRecoilState(categoriesAtom);
  const [editChapter, setEditChapter] = useState();
  const [addChapter, setAddChapter] = useState();
  const [JWT, setJWT] = useRecoilState(jwtATom);
  const navigate = useNavigate();

  const [chapters, setChap] = useState([]);

  const params = useParams();
  const setUp = async () => {
    callApiFEGet(GetStoryDetail, params.id).then((res) => {
      setNovel(res);
      const chapter = res?.chapers?.map((c) => {
        return {
          id: c.id,
          content: c.content,
          name: c.name,
          storyID: c.storyID,
          order: c.order,
          status: c.status
        };
      });
      setChap(chapter);
      setAddChapter({
        storyID: res?.id,
        title: "",
        order: 1,
        name: "",
        status: true,
      });
    });
  };
  useEffect(() => {
    setUp();
  }, []);

  const UpdateTruyen = async () => {
    const image = document.getElementById("image").files[0];
    if (editNovel.title == undefined || editNovel.title.trim() == "") {
      toast.warning("Tên Truyện Trống");
      return;
    }

    if (editNovel.author == undefined || editNovel.author.trim() == "") {
      toast.warning("Tác Giả Trống");
      return;
    }

    if (
      editNovel.description == undefined ||
      editNovel.description.trim() == ""
    ) {
      toast.warning("Mô Tả Trống");
      return;
    }

    if (image) {
      await uploadImage(image);
      editNovel.image = await getURL(image.name);
    }

    const res = await callAPIFEPostToken(JWT, EditStory, {
      id: editNovel?.id,
      title: editNovel?.title,
      description: editNovel?.description,
      categoryId: editNovel?.categoryId,
      image: editNovel?.image,
      author: editNovel?.author,
    });
    if (res?.type != "error") {
      toast.success("Cập Nhập Truyện Thành Công");
    }
  };

  const UploadChapter = async () => {
    callAPIFEPostToken(JWT, AddChapter, addChapter).then((res) => {
      if (res.type != "error") {
        toast.success("Đăng Chương Thành Công");
        setUp();
      }
    });
  };

  const UpdateChapter = async () => {
    callAPIFEPostToken(JWT, EditChapter, editChapter).then((res) => {
      if (res.type != "error") {
        toast.success("Cập Nhập Chương Thành Công");
        setUp();
      }
    });
  };

  const DelChapter = async (id) => {
    callAPIFEDelToken(JWT, DeleteChapter, id).then((res) => {
      if (res.type != "error") {
        toast.success("Xóa Chương Thành Công");
        setUp();
      }
    });
  };
  return (
    <>
      <div className="py-20 px-20 text-xl">
        <div className="my-5">
          <div className="mb-5">Tên Truyện</div>
          <input
            className="rounded-lg p-3 border-2 w-1/3"
            value={editNovel?.title}
            onChange={(event) =>
              setNovel({ ...editNovel, title: event.target.value })
            }
          />
        </div>
        <div className="my-5">
          <div className="mb-5">Ảnh Truyện</div>
          <input
            type="file"
            className="rounded-lg p-3 border-2 w-1/3"
            id="image"
          />
          <img src={editNovel?.image} />
        </div>
        <div className="my-5">
          <div className="mb-5">Thể Loại</div>
          <select
            value={editNovel?.categoryId}
            onChange={(event) =>
              setNovel({ ...editNovel, categoryId: event.target.value })
            }
            className="rounded-lg p-3 border-2 w-1/4"
          >
            {categories.map((c) => (
              <option value={c.id}>{c?.name}</option>
            ))}
          </select>
        </div>
        <div className="my-5">
          <div className="mb-5">Tác Giả</div>
          <input
            value={editNovel?.author}
            onChange={(event) =>
              setNovel({ ...editNovel, author: event.target.value })
            }
            className="rounded-lg p-3 border-2 w-1/3"
          />
        </div>
        <div>
          <div>Mô tả</div>
          <textarea
            className="rounded-lg p-3 border-2 w-full"
            value={editNovel?.description}
            onChange={(event) =>
              setNovel({ ...editNovel, description: event.target.value })
            }
          ></textarea>
        </div>
        <hr className="my-5" />
        <div className="underline underline-offset-8 flex items-center mb-10">
          CHƯƠNG
          <span
            onClick={() => {
              setChapterModal(true);
            }}
          >
            <Icon icon="icons8:plus" className="ml-1 text-2xl" />
          </span>
        </div>

        <div className="flex mb-5">
          <div className="w-1/4 cursor-pointer pr-5">
            {chapters?.slice(0, 50)?.map((c) => {
              return (
                <div
                  key={c.id}
                  className="flex justify-between pr-32 items-center text-medium hover:underline"
                >
                  <span
                    onClick={() => {
                      setEditChapter(c);
                      setudChapterModal(true);
                    }}
                  >
                    * Chương {c.order}: {c.name}
                  </span>
                  <Icon
                    onClick={() => DelChapter(c.id)}
                    icon="mdi:trash"
                    className="text-xl"
                  />
                </div>
              );
            })}
          </div>
          <div className="w-1/4"></div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={UpdateTruyen}
            className="py-2 px-5 bg-blue-900 text-white hover:bg-blue-700 text-base"
          >
            Cập Nhập
          </button>
        </div>
      </div>

      <ReactModal
        isOpen={chapterModal}
        className="w-1/2 m-auto px-10 py-5 bg-neutral-800 text-white text-xl overflow-y-scroll max-h-screen"
        contentLabel="Thêm Chương Mới"
      >
        <div>
          <div
            className="flex justify-end"
            onClick={() => setChapterModal(false)}
          >
            <Icon icon="ion:log-out" className="text-3xl" />
          </div>
          <div className="my-5">
            <div className="mb-5">Tên Chương</div>
            <input
              value={addChapter?.name}
              onChange={(event) =>
                setAddChapter({ ...addChapter, name: event.target.value })
              }
              className="rounded-lg p-3 border-2 w-1/3 text-black"
            />
          </div>
          <div className="my-5">
            <div className="mb-5">Số Thứ Tự Chương</div>
            <input
              type="number"
              value={addChapter?.order}
              onChange={(event) =>
                setAddChapter({ ...addChapter, order: event.target.value })
              }
              className="rounded-lg p-3 border-2 w-1/3 text-black"
            />
          </div>

          <div className={`my-5 ${userInfo?.roleId != 2 ? "hidden" : ""}`}>
            <div className="mb-5">Phí</div>
            <select className="text-black"
              onChange={(event) => {
                setAddChapter({ ...addChapter, status: event.target.value });
              }}
              value={addChapter?.status}
            >
              <option value={true}>Miễn Phí</option>
              <option value={false}>Mất Phí</option>
            </select>
          </div>

          <div className="my-5">
            <div id="coc" className="mb-5">
              Nội Dung
            </div>
            <RTEditor
              content={addChapter?.content}
              onChange={(event) =>
                setAddChapter({
                  ...addChapter,
                  content: event.target.getContent(),
                })
              }
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={UploadChapter}
              className="py-2 px-5 bg-blue-800 mt-3 text-white"
            >
              Đăng
            </button>
          </div>
        </div>
      </ReactModal>

      <ReactModal
        isOpen={udchapterModal}
        className="w-1/2 m-auto px-10 py-5 bg-neutral-800 text-white text-xl overflow-y-scroll max-h-screen"
        contentLabel="Cập Nhập Chương"
      >
        <div>
          <div
            className="flex justify-end"
            onClick={() => setudChapterModal(false)}
          >
            <Icon icon="ion:log-out" className="text-3xl" />
          </div>
          <div className="my-5">
            <div className="mb-5">Tên Chương</div>
            <input
              value={editChapter?.name}
              onChange={(event) =>
                setEditChapter({ ...editChapter, name: event.target.value })
              }
              className="rounded-lg p-3 border-2 w-1/3 text-black"
            />
          </div>
          <div className="my-5">
            <div className="mb-5">Số Thứ Tự Chương</div>
            <input
              type="number"
              value={editChapter?.order}
              onChange={(event) =>
                setEditChapter({ ...editChapter, order: event.target.value })
              }
              className="rounded-lg p-3 border-2 w-1/3 text-black"
            />
          </div>
          <div className={`my-5 ${userInfo?.roleId != 2 ? "hidden" : ""}`}>
            <div className="mb-5">Phí</div>
            <select
            className="text-black"
              onChange={(event) => {
                setAddChapter({ ...editChapter, status: event.target.value });
              }}
              value={editChapter?.status}
            >
              <option value={true}>Miễn Phí</option>
              <option value={false}>Mất Phí</option>
            </select>
          </div>
          <div className="my-5">
            <div id="coc" className="mb-5">
              Nội Dung
            </div>
            <RTEditor
              content={editChapter?.content}
              onChange={(event) =>
                setAddChapter({
                  ...editChapter,
                  content: event.target.getContent(),
                })
              }
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={UpdateChapter}
              className="py-2 px-5 bg-blue-800 mt-3 text-white"
            >
              Cập Nhập
            </button>
          </div>
        </div>
      </ReactModal>
    </>
  );
};
