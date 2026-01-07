
import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import LandingPage from './pages/LandingPage';
import Authentication from './pages/Authentication';
import { AuthProvider } from './contexts/AuthContext';
import VideoMeet from './pages/VideoMeet';
import HomeComponent from './pages/Home';
import History from './pages/History';
import GuestJoin from './pages/GuestJoin';

function App() {
  return (
    <div className='App'>
      <BrowserRouter>

        <AuthProvider>
          <Routes>
            <Route path='/' element = {<LandingPage />} />
            <Route path='/auth' element = {<Authentication />} />
            <Route path='/guest-join' element = {<GuestJoin />} />
            <Route path='/home's element={<HomeComponent />} />
            <Route path='/history' element={<History />} />
            <Route path='/:url' element ={<VideoMeet />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
