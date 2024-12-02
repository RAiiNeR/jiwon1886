import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Home';
import GalleryList from './gallery/GalleryList';
import GalleryForm from './gallery/GalleryForm';
import Header from './Header';
import Footer from './Footer';
import UpboardForm from './upboard/UpboardForm';
import UpboardList from './upboard/UpboardList';
import UpboardDetail from './upboard/UpboardDetail';
import Member from './member/Member';
import Chat from './chat/Chat';
import DummyList from './dummy/DummyList';

function App() {
  return (
    <>
      <BrowserRouter>
      <Header/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          {/* Gallery */}
          <Route path='/gallery' element={<GalleryList/>}/>
          <Route path='/gallery/new' element={<GalleryForm/>}/>
          {/* Upboard */}
          <Route path='/upboard/new' element={<UpboardForm/>}/>
          <Route path='/upboard' element={<UpboardList/>}/>
          <Route path='/upboard/:num' element={<UpboardDetail/>}/>
          {/* 회원가입 */}
          <Route path='/signup' element={<Member/>}/>
          {/* 채팅 */}
          <Route path='/chat' element={<Chat/>}/>


          <Route path='/dummy' element={<DummyList/>}/>
        </Routes>
      <Footer/>
      </BrowserRouter>
    </>
  );
}

export default App;
