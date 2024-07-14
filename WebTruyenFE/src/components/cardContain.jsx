import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export const CardContain = ({ image, name, id }) => {
  return (
    <Link to={`/${id}`} className="">
      <div
        className={`w-full h-full bg-cover bg-center relative overflow-hidden`}
        
      >
        <img className="w-full" src={image}/>
        <div className="absolute bottom-0 bg-black opacity-40 text-white text-sm  w-full max-h-[30%] flex justify-center items-center ">
          <p className="w-4/5 my-2 h-full line-clamp-2 text-center overflow-hidden">
            {name}
          </p>
        </div>
      </div>
    </Link>
  );
};

//Prop type validation
CardContain.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
};
