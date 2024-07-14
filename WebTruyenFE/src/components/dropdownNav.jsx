import PropTypes from 'prop-types';
export const DropdownNav = ({content, list}) => {
  return (
    <div className="dropdown bg-neu">
      <button className="dropbtn">
        {content}
        <i className="fa fa-caret-down"></i>
      </button>
      <div className="dropdown-content text-black">
      {list.map((l,index) => <div key={index} className="hover:bg-blue-700 hover:text-white bg-neutral-100 font-normal text-base p-3"><a href={l?.link}>{l.content}</a></div>)}
      </div>
    </div>
  );
};


DropdownNav.propTypes = {
  content: PropTypes.string.isRequired,
  list: PropTypes.array.isRequired // Add PropTypes validation for the 'list' prop
};
