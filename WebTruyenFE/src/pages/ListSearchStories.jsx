import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStories } from "../apis/service";
import { StoryFilterContainer } from "../components/storyFilterContainer";

export const ListSearchStories = () => {
  const [stories, setStories] = useState([]);
  
  const params = useParams();
  const search = params.search;
  useEffect(() => {
    getStories({ searchValue: search }).then((res) => setStories(res));
  }, [search]);
  return (
    <>
      <div className="max-w-screen-xl m-auto  mt-6">
        <div>
          <h2 className="text-3xl underline underline-offset-8 mb-10 font-medium">
            Truyện liên quan đến {search}
          </h2>
        </div>
        <div className="px-20 w-full mt-4 gap-y-3">
          {stories.map((element) => <StoryFilterContainer story={element}/>)}
        </div>
      </div>
    </>
  );
};
