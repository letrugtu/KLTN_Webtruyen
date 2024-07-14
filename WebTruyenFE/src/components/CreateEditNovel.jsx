import ReactModal from "react-modal";
import { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { RTEditor } from "./richTextEditor";
import { useRecoilState } from "recoil";
import { categoriesAtom, jwtATom } from "../states/atom";
import { getURL, uploadImage } from "../firebase";
import { toast } from "react-toastify";
import { callAPIFEPostToken, callApiFEPost } from "../apis/service";
import { AddChapter, AddStory } from "../apis/apis";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const CreateEditNovel = ({ novel = undefined }) => {
  const [editNovel, setNovel] = useState(novel);
  const [chapterModal, setChapterModal] = useState(false);
  const [udchapterModal, setudChapterModal] = useState(false);
  const [categories, setCate] = useRecoilState(categoriesAtom);
  const [editChapter, setEditChapter] = useState();
  const [addChapter, setAddChapter] = useState({storyID: novel?.id});
  const [JWT, setJWT] = useRecoilState(jwtATom);
  const navigate = useNavigate();

  const [chapters, setChap] = useState([]);

  
  useEffect(() => {
    if (novel) {
      const chapter = editNovel?.chapers?.map((c) => {
        return {
          content: c.content,
          name: c.name,
          storyID: c.storyID,
          order: c.order,
        };
      });
      setChap(chapter);
    }
  }, []);

  const UploadTruyen = async () => {
    const image = document.getElementById("image").files[0];
    if (editNovel.title == undefined || editNovel.title.trim() == "") {
      toast.warning("Tên Truyện Trống");
      return;
    }

    if (image == undefined) {
      toast.warning("Ảnh Truyện Trống");
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
    await uploadImage(image);
    const imgURL = await getURL(image.name);
    const res = await callAPIFEPostToken(JWT, AddStory, {
      title: editNovel?.title,
      description: editNovel?.description,
      categoryId: editNovel?.categoryId,
      image: imgURL,
    });
    if (res?.type != "error") {
      toast.success("Đăng Truyện Thành Công");
      navigate(`/editNovel/${res.id}`);
    }
  };

  const UploadChapter = async () => {
    setChap([...chapters, addChapter]);
    callAPIFEPostToken(JWT, AddChapter, addChapter);
    setAddChapter({storyID: novel.id})
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
          {novel?<img src={novel?.image} />:""}
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
        <div className="underline underline-offset-8 flex items-center">
          CHƯƠNG <span>{chapterModal.v}</span>{" "}
          <span
            onClick={() => {
              setChapterModal(true);
            }}
          >
            {novel ? <Icon icon="icons8:plus" className="ml-1 text-2xl" /> : ""}
          </span>
        </div>

        <div className="flex mb-5">
          {novel ? (
            <div className="w-1/2 cursor-pointer pr-5">
              {chapters?.slice(0, 50)?.map((c) => {
                return (
                  <div
                    key={c.id}
                    onClick={() => {setEditChapter(c); setudChapterModal(true)}}
                    className="text-medium hover:underline"
                  >
                    * Chương {c.order}: {c.name}
                  </div>
                );
              })}
            </div>
          ) : (
            ""
          )}
          <div className="w-1/2"></div>
        </div>

        <div onClick={UploadTruyen} className="flex justify-end">
          <button className="py-2 px-5 bg-blue-900 text-white hover:bg-blue-700 text-base">
            {novel ? "Cập Nhập" : "Đăng"}
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
              onChange={(event) => setAddChapter({...addChapter, name: event.target.value})}
              className="rounded-lg p-3 border-2 w-1/3 text-black"
            />
          </div>
          <div className="my-5">
            <div className="mb-5">Số Thứ Tự Chương</div>
            <input
              type="number"
              value={addChapter?.order}
              onChange={(event) => setAddChapter({...addChapter, order: event.target.value})}
              className="rounded-lg p-3 border-2 w-1/3 text-black"
            />
          </div>
          <div className="my-5">
            <div id="coc" className="mb-5">
              Nội Dung
            </div>
            <RTEditor content={addChapter?.content} onChange={(value) => setAddChapter({...addChapter, content:value})}/>
          </div>
          <div className="flex justify-end">
            <button onClick={UploadChapter} className="py-2 px-5 bg-blue-800 mt-3 text-white">
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
              onChange={(event) => setEditChapter({...editChapter, name: event.target.value})}
              className="rounded-lg p-3 border-2 w-1/3 text-black"
            />
          </div>
          <div className="my-5">
            <div className="mb-5">Số Thứ Tự Chương</div>
            <input
              type="number"
              value={editChapter?.order}
              onChange={(event) => setEditChapter({...editChapter, order: event.target.value})}
              className="rounded-lg p-3 border-2 w-1/3 text-black"
            />
          </div>
          <div className="my-5">
            <div id="coc" className="mb-5">
              Nội Dung
            </div>
            <RTEditor content={editChapter?.content} onChange={(value) => setAddChapter({...editChapter, content:value})}/>
          </div>
          <div className="flex justify-end">
            <button onClick={UploadChapter} className="py-2 px-5 bg-blue-800 mt-3 text-white">
              Cập Nhập
            </button>
          </div>
        </div>
      </ReactModal>
    </>
  );
};
