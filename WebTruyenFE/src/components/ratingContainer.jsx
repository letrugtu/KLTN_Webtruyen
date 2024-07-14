import { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { callAPIFEPostToken, callApiFEGet } from "../apis/service";
import { jwtATom } from "../states/atom";
import { useRecoilState } from "recoil";
import { GetStoryDetail, Rating } from "../apis/apis";
import { toast } from "react-toastify";

export const RatingContainer = ({ rates = [], story, setStory }) => {
  const [averageRate, setAverageRate] = useState(0);
  const [JWT, setJWT] = useRecoilState(jwtATom);

  const calAverage = () => {
    if (rates?.length > 0) {
      const sumRate = rates?.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.rate1;
      },0);
      setAverageRate(sumRate / rates?.length);
    } else {
      setAverageRate(0);
    }
  };

  useEffect(() => {
    calAverage();
  }, [rates]);

  const rating = async (rate1) => {
    if (JWT != undefined && JWT != "undefined") {
      callAPIFEPostToken(JWT, Rating, { rate1, storyId: story.id }).then(() => {
        setStory()
      });
      toast.info("Đánh giá của bạn đã được lưu lại");
    } else {
      toast.info("Đăng nhập để đánh giá");
    }
  };

  const starsMap = [
    <Icon icon="material-symbols:star" />,
    <Icon icon="material-symbols:star" />,
    <Icon icon="material-symbols:star" />,
    <Icon icon="material-symbols:star" />,
    <Icon icon="material-symbols:star" />,
  ];
  return (
    <div onMouseLeave={calAverage} className="flex text-lg justify-center mb-5">
      {starsMap.map((element, index) => {
        return (
          <span
            onClick={() => rating(index + 1)}
            onMouseEnter={() => setAverageRate(index + 1)}
            className={index + 1 <= averageRate ? "text-yellow-500" : ""}
          >
            {element}
          </span>
        );
      })}
    </div>
  );
};
