import { useRecoilState } from "recoil";
import {
    CateCol,
    RateCol,
  StickyHeadTable,
} from "../../components/table";
import { jwtATom } from "../../states/atom";
import { useEffect, useState } from "react";
import { callAPIFEDelToken, callAPIFEPostToken } from "../../apis/service";
import { DeleteRating, GetAllCate, GetAllRate } from "../../apis/apis";

export const ManageCategories = () => {
  const [categories, setCate] = useState([]);
  const [JWT, setJWT] = useRecoilState(jwtATom);
  const [search, setSearch] = useState("");

  const getCate = async() => {
    callAPIFEPostToken(JWT, GetAllCate, { searchValue: search }).then((res) => {
        setCate(res)
    });
  }
  useEffect(() => {
    getCate()
  }, []);

  const onSearch = (event) => {
    setSearch(event.target.value);
    const search = event.target.value;
    console.log(search);
    getCate()
  };

  const deleteFunc = (id) => {
    callAPIFEDelToken(JWT, DeleteRating, id).then(()=> {
        getCate()
    })
  }
  return (
    <>
      <div className="px-40 py-20">
        <StickyHeadTable
          columns={CateCol}
          rows={categories}
          onSearch={onSearch}
        />
      </div>
    </>
  );
};
