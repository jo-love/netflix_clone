import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import Home from './Pages/Home';
import Search from './Pages/Search';
import Tv from './Pages/Tv';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/tv" element={<Tv />} />
        <Route path="/search" element={<Search />} />
        <Route path="/" element={<Home />}>
          <Route path="movies/:movieId" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
