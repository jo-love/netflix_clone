import {
  motion,
  AnimatePresence,
  useViewportScroll,
  MotionValue,
} from 'framer-motion';
import { useEffect, useState } from 'react';
// AnimationPresence: 컴포넌트가 렌더되거나 없어질 때 효과를 줄 수 있다.
import { useQuery } from 'react-query';
import { useMatch, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getMovies, IGetMoviesResult, IMovie } from '../api';
import { Loader } from '../Components/Loader';
import { makeImgPath } from '../utils';

const Container = styled.div`
  background-color: black;
`;

const Banner = styled.div<{ bg_photo: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bg_photo});
  background-size: cover;

  h2 {
    font-size: 68px;
    margin-bottom: 20px;
  }
  p {
    font-size: 30px;
    width: 50%;
  }
`;
const Slider = styled.section`
  position: relative;
  top: -100px;
`;

const Row = styled(motion.article)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;
const Movie = styled(motion.article)<{ bg_photo: string }>`
  background-image: url(${(props) => props.bg_photo});
  background-size: cover;
  background-position: center center;
  height: 200px;
  color: white;
  font-size: 50px;

  &:first-child {
    transform-origin: center left;
  }

  &:last-child {
    transform-origin: center right;
  }
`;
const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;
const BigSize = styled(motion.div)<{ scrolly: MotionValue<number> }>`
  position: absolute;
  width: 40vw;
  height: 80vh;
  top: ${(props) => props.scrolly.get() + 100}px;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.lighter};

  h3 {
    color: ${(props) => props.theme.white.lighter};
    padding: 20px;
    font-size: 46px;
    position: relative;
    top: -80px;
  }
  p {
    padding: 20px;
    position: relative;
    top: -80px;
    color: ${(props) => props.theme.white.lighter};
  }
`;
const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;
const rowVariants = {
  initial: {
    x: window.innerWidth + 10,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.innerWidth - 10,
  },
};
const movieVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    y: -50,
    scale: 1.3,
    transition: {
      delay: 0.5,
      duration: 0.3,
    },
  },
};
const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: 'tween',
    },
  },
};

const Home = () => {
  const offset = 6;
  const navigate = useNavigate();
  const movieMatch = useMatch('/movies/:movieId');
  const { scrollY } = useViewportScroll();
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ['movies', 'nowPlaying'],
    getMovies,
  );
  const [index, setIndex] = useState(0);
  // 연속으로 빨리 클릭하면 슬라이더 사이에 간격이 심하게 생김 => exit하기 전에 한 번 더 클릭했기 때문에 다음 row로 사라지려고 해서 생긴 현상
  const [leaving, setLeaving] = useState(false);
  // const [movieInfo, setMovieInfo] = useState<IMovie>();
  const slideIdx = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);

  const onMovieClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };
  const onOverlayClick = () => {
    navigate('/');
  };
  const clickedMovie = data?.results.find(
    (movie) => movieMatch?.params.movieId === String(movie.id),
  );
  return (
    <Container>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Banner
            onClick={slideIdx}
            bg_photo={makeImgPath(data?.results[0].backdrop_path || '')}
          >
            <h2>{data?.results[0].title}</h2>
            <p>{data?.results[0].overview}</p>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="initial"
                animate="visible"
                exit="exit"
                transition={{ type: 'tween', duration: 1 }}
                key={index}
              >
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Movie
                      layoutId={movie.id + ''}
                      onClick={() => onMovieClicked(movie.id)}
                      variants={movieVariants}
                      whileHover="hover"
                      initial="normal"
                      key={movie.id}
                      bg_photo={makeImgPath(movie.backdrop_path, 'w500')}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Movie>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {movieMatch ? (
              <>
                <Overlay
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={onOverlayClick}
                />
                <BigSize
                  scrolly={scrollY}
                  layoutId={movieMatch?.params.movieId}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImgPath(
                            clickedMovie.backdrop_path,
                            'w500',
                          )})`,
                        }}
                      />
                      <h3>{clickedMovie.title}</h3>
                      <p>{clickedMovie.overview}</p>
                    </>
                  )}
                </BigSize>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Container>
  );
};

export default Home;
