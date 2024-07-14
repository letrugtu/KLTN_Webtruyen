import { useRecoilState } from "recoil";
import { ReviewCol, StickyHeadTable } from "../../components/table";
import { jwtATom } from "../../states/atom";
import { useEffect, useState } from "react";
import { callAPIFEDelToken, callAPIFEPostToken } from "../../apis/service";
import { DeleteChapter, GetAllReview } from "../../apis/apis";

export const ManageReviews = () => {
  const [reviews, setReview] = useState([]);
  const [JWT, setJWT] = useRecoilState(jwtATom);
  const [search, setSearch] = useState("");

  const getReviews = async () => {
    callAPIFEPostToken(JWT, GetAllReview, { searchValue: search }).then(
      (res) => {
        const rvs = res?.map((rv) => {
          return {
            ...rv,
            user: rv?.User?.email,
            story: rv?.story?.title,
          };
        });

        setReview(rvs)
      }
    );
  };

  useEffect(() => {
    getReviews();
  }, []);

  const onSearch = (event) => {
    setSearch(event.target.value);
    const search = event.target.value;
    console.log(search);
    getReviews();
  };

  const deleteFunc = (id) => {
    callAPIFEDelToken(JWT, DeleteChapter, id).then(() => {
      getReviews();
    });
  };
  return (
    <>
      <div className="px-40 py-20">
        <StickyHeadTable
          columns={ReviewCol}
          rows={reviews}
          onSearch={onSearch}
          deleteContent="Delete"
          deleteFunc={deleteFunc}
        />
      </div>
    </>
  );
};
