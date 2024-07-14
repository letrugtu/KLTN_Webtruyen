import { Link, useNavigate } from "react-router-dom";
import minilogo from "../assets/minilogowhite.png";
import { DropdownNav } from "./dropdownNav";
import { useRecoilState } from "recoil";
import { categoriesAtom, jwtATom, userInfoAtom } from "../states/atom";
import { useCookies } from "react-cookie";
import { emptyAvatar } from "../data/data";

export const Navbar = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["JWT"]);
  const [JWT, setJWT] = useRecoilState(jwtATom);
  const [categories, setCate] = useRecoilState(categoriesAtom);
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);
  let mapCate = [];

  if (categories?.length > 0) {
    mapCate = categories.map((cate) => {
      return { content: cate.name, link: `/storiesofcate/${cate.id}` };
    });
  }

  const navigate = useNavigate();

  const logOut = () => {
    removeCookie("JWT");
    setJWT(undefined);
    setUserInfo(undefined);
    navigate("/")
  };
  return (
    <div className=" bg-blue-950 text-white">
      <div className="flex justify-between py-2 items-center lg:max-w-screen-xl m-auto">
        <Link to={"/"}>
          <img src={minilogo} className="w-12" />
        </Link>
        <div>
          <DropdownNav
            content={"Danh sách"}
            list={[
              { content: "Truyện mới cập nhập", link: "" },
              { content: "Truyện Hot", link: "" },
            ]}
          />
          <DropdownNav content={"Thể loại"} list={mapCate} />
          <DropdownNav
            content={"Tủ sách"}
            list={[
              { content: "Truyện đã đọc", link: "" },
              { content: "Truyện đã thích", link: "" },
            ]}
          />
          {userInfo?.roleId==1 ? (
            <div className="dropdown bg-neu">
              <button
                onClick={() => navigate("/user/createnovel")}
                className="dropbtn"
              >
                Đăng truyện
              </button>
            </div>
          ) : userInfo?.roleId==2 ? (
            <div className="dropdown bg-neu">
              <button
                onClick={() => navigate("/admin")}
                className="dropbtn"
              >
                Admin
              </button>
            </div>
          ):(
            ""
          )}
        </div>

        <div className="flex">
          <div className="flex bg-white text-black mr-10">
            <input
              onKeyDown={(event) => {
                if (event.key == "Enter" && event.target.value.trim() != "") {
                  navigate(`/search/${event.target.value}`);
                }
              }}
              className="px-3 py-1"
              placeholder="Search"
            />
          </div>
          <div className="flex items-center">
            {userInfo ? (
              <>
                <Link to={`/${userInfo?.role?.id==1?"user":"admin"}/profile`} className="flex items-center">
                  <img src={emptyAvatar} className="rounded-full h-10 w-10" />{" "}
                  <div className="mx-2">{userInfo?.username}</div>
                </Link>
                <button
                  onClick={logOut}
                  className="mr-3 rounded-xl py-2 px-5 bg-blue-800 hover:bg-blue-500"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                {" "}
                <button
                  onClick={() => navigate("/signUp")}
                  className="mr-3 rounded-xl py-2 px-5 bg-blue-800 hover:bg-blue-500"
                >
                  Đăng kí
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="rounded-xl py-2 px-5 bg-blue-800 hover:bg-blue-500"
                >
                  Đăng nhập
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
