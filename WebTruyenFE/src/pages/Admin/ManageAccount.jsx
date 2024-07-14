import { useRecoilState } from "recoil";
import {
  AccountsCol,
  StickyHeadTable,
  StoriesCol,
} from "../../components/table";
import { jwtATom, storiesAtom } from "../../states/atom";
import { useEffect, useState } from "react";
import { callAPIFEDelToken, callAPIFEPostToken } from "../../apis/service";
import { DeleteAccount, GetListAccount } from "../../apis/apis";

export const ManageAccounts = () => {
  const [accounts, setAccount] = useState([]);
  const [JWT, setJWT] = useRecoilState(jwtATom);
  const [search, setSearch] = useState("");

  useEffect(() => {
    callAPIFEPostToken(JWT, GetListAccount, {}).then((res) => {
      setAccount(res);
    });
  }, []);

  const onSearch = (event) => {
    setSearch(event.target.value);
    const search = event.target.value;
    console.log(search);
    callAPIFEPostToken(JWT, GetListAccount, { searchValue: search }).then(
      (res) => {
        setAccount(res);
      }
    );
  };

  const deleteFunc = (id) => {
    callAPIFEDelToken(JWT, DeleteAccount, id).then(()=> {
        callAPIFEPostToken(JWT, GetListAccount, { searchValue: search }).then(
            (res) => {
              setAccount(res);
            }
          );
    })
  }
  return (
    <>
      <div className="px-40 py-20">
        <StickyHeadTable
          columns={AccountsCol}
          rows={accounts}
          onSearch={onSearch}
          deleteContent="Disable/Active"
          deleteFunc={deleteFunc}
        />
      </div>
    </>
  );
};
