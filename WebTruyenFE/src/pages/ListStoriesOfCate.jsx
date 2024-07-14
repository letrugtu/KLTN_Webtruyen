import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { categoriesAtom } from "../states/atom";
import { getStories } from "../apis/service";
import { StoryFilterContainer } from "../components/storyFilterContainer";

export const ListStoriesOfCate = () => {
  const [stories, setStories] = useState([]);
  const [categories, setCate] = useRecoilState(categoriesAtom);
  
  const params = useParams();
  const cateId = params.id;
  const category = categories?.find((c) => c.id == cateId);
  useEffect(() => {
    getStories({ categoryID: cateId }).then((res) => setStories(res));
  }, []);
  return (
    <>
      <div className="max-w-screen-xl m-auto  mt-6">
        <div>
          <h2 className="text-3xl underline underline-offset-8 mb-10 font-medium">
            Truyện {category?.name}
          </h2>
        </div>
        <div className="px-20 w-full mt-4 gap-y-3">
          {stories.map((element) => <StoryFilterContainer story={element}/>)}
        </div>
      </div>
    </>
  );
};
