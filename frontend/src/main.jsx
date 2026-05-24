import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Layout from './Layout.jsx';
import {AuthProvider} from './context/AuthContext.jsx';
import App from './App.jsx';
import Dogs from './pages/Dogs.jsx';
import Adopt from './pages/Adopt.jsx';
import Foster from './pages/Foster.jsx';
import Volunteer from './pages/Volunteer.jsx';
import Events from './pages/Events.jsx';
import SignUp from './pages/SignUp.jsx';
import SignIn from './pages/SignIn.jsx';
import CreateDog from './pages/CreateDog.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path='/' element={<App />} />
            <Route path='/dogs' element={<Dogs />} />
            {/* <Route path='/dogs/:id' element={<Dog />} /> */}
            <Route path='/adopt' element={<Adopt />} />
            <Route path='/foster' element={<Foster />} />
            <Route path='/volunteer' element={<Volunteer />} />
            <Route path='/events' element={<Events />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='/signin' element={<SignIn />} />
            {/* Protected Routes Below */}
            <Route path='/admin/createdog' element={<CreateDog />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
