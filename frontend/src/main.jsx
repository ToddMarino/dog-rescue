import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Layout from './Layout.jsx';
import App from './App.jsx';
import Dogs from './pages/Dogs.jsx';
import Adopt from './pages/Adopt.jsx';
import Foster from './pages/Foster.jsx';
import Volunteer from './pages/Volunteer.jsx';
import Events from './pages/Events.jsx';
import SignUp from './pages/SignUp.jsx';
import SignIn from './pages/SignIn.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<App />} />
          <Route path='/dogs' element={<Dogs />} />
          {/* <Route path='/dogs/:id' element={<Dog />} /> */}
          <Route path='/adopt' element={<Adopt />} />
          <Route path='/foster' element={<Foster />} />
          <Route path='/volunteer' element={<Volunteer />} />
          <Route path='/events' element={<Events />} />
          <Route path='/auth/signup' element={<SignUp />} />
          <Route path='/auth/signin' element={<SignIn />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
