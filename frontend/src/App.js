import './App.css';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Favourites from './pages/Favourites';
import { Route, Routes } from 'react-router-dom';

function App() {

  return (
    <div className='flex'>
      <Sidebar  />
      <div className="flex-1 p-4">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/favourites" element={<Favourites />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
