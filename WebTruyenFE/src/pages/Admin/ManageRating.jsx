import { useRecoilState } from "recoil";
import {
    RateCol,
  StickyHeadTable,
} from "../../components/table";
import { jwtATom } from "../../states/atom";
import { useEffect, useState } from "react";
import { callAPIFEDelToken, callAPIFEPostToken } from "../../apis/service";
import { DeleteRating, GetAllRate } from "../../apis/apis";

export const ManageRate = () => {
  const [rates, setRate] = useState([]);
  const [JWT, setJWT] = useRecoilState(jwtATom);
  const [search, setSearch] = useState("");

  const getRating = async() => {
    callAPIFEPostToken(JWT, GetAllRate, { searchValue: search }).then((res) => {
        const rates = res?.map(r => {
            return {
                ...r,
                account: r.account.email,
                story: r.story.title
            }
        })
        setRate(rates)
    });
  }

  useEffect(() => {
    getRating()
  }, []);

  const onSearch = (event) => {
    setSearch(event.target.value);
    const search = event.target.value;
    console.log(search);
    getRating()
  };

  const deleteFunc = (id) => {
    callAPIFEDelToken(JWT, DeleteRating, id).then(()=> {
        getRating()
    })
  }
  return (
    <>
      <div className="px-40 py-20">
        <StickyHeadTable
          columns={RateCol}
          rows={rates}
          onSearch={onSearch}
          deleteContent="Delete"
          deleteFunc={deleteFunc}
        />
      </div>
    </>
  );
};
