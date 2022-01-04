const API_KEY = 'e3045cbe31921451703c59cc60b902c0';
const BASE_PATH = 'https://api.themoviedb.org/3';

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  original_title: string;
  overview: string;
  title: string;
}
export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export const getMovies = async () => {
  const res = await fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`);
  return await res.json();
};

