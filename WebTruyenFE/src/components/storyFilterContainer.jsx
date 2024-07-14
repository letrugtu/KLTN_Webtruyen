import { Icon } from "@iconify/react/dist/iconify.js";
import { useNavigate } from "react-router-dom";

export const StoryFilterContainer = ({ story }) => {
    const navigate = useNavigate()
  return (
    
      <div key={story.id}>
        <hr className="border-neutral-300 my-5" />
        <div className="w-full flex items-center">
          <div
            onClick={() => navigate(`/noveldetail/${story.id}`)}
            className="w-1/6 flex justify-between"
          >
            <img src={story?.image} className="h-60 object-fill" />
          </div>
          <div className="w-2/4 px-5">
            <div
              className="flex font-bold items-center text-neutral-600 text-2xl hover:underline mb-2"
              onClick={() => navigate(`/noveldetail/${story.id}`)}
            >
              <Icon icon="foundation:page-multiple" className="mr-2" />{" "}
              {story?.title}
            </div>
            <div className="text-thin italic flex items-center">
              <Icon icon="material-symbols:edit" className="mr-2" />{" "}
              {story?.author}
            </div>
          </div>
          <div className="w-1/4 text-right font-normal text-lg text-blue-700">
            {story?.chapers?.length ?? 0} Chương
          </div>
        </div>
      </div>
    
  );
};
