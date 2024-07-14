import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export const Dropdown = ({ content, list }) => {
  return (
    <div className="dropdown w-full">
      <button className="dropbtn">
        {content}
        <i className="fa fa-caret-down"></i>
      </button>
      <div className="dropdown-content text-black bg-neutral-200">
        {list.map((l, index) => {
          return (
            <div
              key={index}
              className="hover:bg-blue-700  hover:text-white font-normal text-base p-3"
            >
              <Link to={l?.link}>{l.content}</Link>
            </div>
          );
        })}
        _
      </div>
    </div>
  );
};

//Prop type validation
Dropdown.propTypes = {
  content: PropTypes.string,
  list: PropTypes.array,
};
