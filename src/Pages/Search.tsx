import { useLocation } from 'react-router-dom';

const Search = () => {
  const location = useLocation();
  console.log(location);
  const keyword = new URLSearchParams(location.search).get('keyword');
  return <div></div>;
};

export default Search;
