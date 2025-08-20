import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import LandingPage from './pages/LandingPage';
import Authentication from './pages/Authentication';

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element = {<LandingPage />} />
          <Route path='/auth' element = {<Authentication />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
