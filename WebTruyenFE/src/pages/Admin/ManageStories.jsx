import { useRecoilState } from "recoil";
import { StickyHeadTable, StoriesCol } from "../../components/table";
import { jwtATom, storiesAtom } from "../../states/atom";
import { useEffect, useState } from "react";
import { callAPIFEDelToken, getStories } from "../../apis/service";
import { DeleteStory } from "../../apis/apis";

export const ManageStories = () => {
  const [stories, setStories] = useState([]);
  const [JWT, setJWT] = useRecoilState(jwtATom)
  const [search, setSearch] = useState("")

  useEffect(() => {
    getStories({}).then((res) => {
      const trimStories = res.map((s) => {
        return {
          id: s.id,
          title: s.title,
          author: s.author,
          description: s.description,
          chapers: s.chapers.length,
          category: s.category.name,
        };
      });

      setStories(trimStories);
    });
  }, []);

  const onSearch = (event) => {
    setSearch(event.target.value)
    const search = event.target.value
    console.log(search)
    getStories({searchValue: search}).then((res) => {
        const trimStories = res.map((s) => {
          return {
            id: s.id,
            title: s.title,
            author: s.author,
            description: s.description,
            chapers: s.chapers.length,
            category: s.category.name,
          };
        });
  
        setStories(trimStories);
      });
  }

  const deleteFunc = (id) => {
    callAPIFEDelToken(JWT, DeleteStory, id).then(() => {
        getStories({searchValue: search}).then((res) => {
            const trimStories = res.map((s) => {
              return {
                id: s.id,
                title: s.title,
                author: s.author,
                description: s.description,
                chapers: s.chapers.length,
                category: s.category.name,
              };
            });
      
            setStories(trimStories);
          });
    })
  }

  return (
    <>
      <div className="px-40 py-20">
        <StickyHeadTable columns={StoriesCol} rows={stories} onSearch={onSearch} detailUrl={"/noveldetail"} deleteFunc={deleteFunc} />
      </div>
    </>
  );
};
