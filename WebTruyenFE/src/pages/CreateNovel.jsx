
import { useState } from "react";
import { useRecoilState } from "recoil";
import { categoriesAtom, jwtATom, userInfoAtom } from "../states/atom";
import { getURL, uploadImage } from "../firebase";
import { toast } from "react-toastify";
import { callAPIFEPostToken, callApiFEPost } from "../apis/service";
import { AddChapter, AddStory } from "../apis/apis";
import { useNavigate } from "react-router-dom";

export const CreateNovel = () => {
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);
  const [editNovel, setNovel] = useState({ categoryId: 1 });

  const [categories, setCate] = useRecoilState(categoriesAtom);

  const [JWT, setJWT] = useRecoilState(jwtATom);
  const navigate = useNavigate();

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
      author: editNovel?.author
    });
    if (res?.type != "error") {
      toast.success("Đăng Truyện Thành Công");
      if(userInfo?.roleId == 2){
        navigate(`/admin/editNovel/${res.id}`);
      }else{
        navigate(`/user/editNovel/${res.id}`);
      }
    }
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

        <div className="flex justify-end">
          <button onClick={UploadTruyen} className="py-2 px-5 bg-blue-900 text-white hover:bg-blue-700 text-base">
            Đăng
          </button>
        </div>
      </div>
    </>
  );
};
