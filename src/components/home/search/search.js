import React, { useState } from 'react';

const Search = (props) => {
  const [textSearch, setTextSearch] = useState('');

  const onChange = ({ target }) => {
    const { handleChange } = props;
    handleChange(target.value);
    setTextSearch(target.value);
  };

  return (
    <div className="search">
      <div className={'form-group'}>
        <input
          name="name"
          id="name"
          type="text"
          placeholder={props.placeholder}
          className={'form-control'}
          value={textSearch}
          onChange={(event) => onChange(event)}
        />
        <button type="button" className="btn-search">
          &nbsp;
        </button>
      </div>
    </div>
  );
};

export default Search;
