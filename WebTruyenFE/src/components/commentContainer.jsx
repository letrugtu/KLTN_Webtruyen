import { toast } from "react-toastify";
import { DeleteReview } from "../apis/apis";
import { callAPIFEDelToken } from "../apis/service";
import { emptyAvatar } from "../data/data";
import { getEmailPrefix } from "../helpers/helper";
import { useRecoilState } from "recoil";
import { jwtATom, userInfoAtom } from "../states/atom";

export const CommentContainer = ({ comment= [], setNovel }) => {
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);
  const [JWT, setJWT] = useRecoilState(jwtATom);

  const deleteRv = async(id) => {
    callAPIFEDelToken(JWT, DeleteReview, id).then(()=>{
      setNovel()
      toast.success("Đã xóa bình luận")
    })
  }
  return (
    <>
      <div>
        {comment.map((c) => (
          <div id={c.id} className="flex mb-3">
            <div className="h-12 w-12 mr-5">
              <img className="rounded-full" src={emptyAvatar} />
            </div>
            <div className="w-11/12">
                <div className="font-semibold text-xl text-blue-900">{getEmailPrefix(c?.user?.email)}</div>
                <div>{c?.content}</div>
                {c?.user?.id == userInfo?.id?<button onClick={() => deleteRv(c?.id)} className="text-red-500">Xóa</button>:""}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
