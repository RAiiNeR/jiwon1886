
//import MemoForm from 'memo/MemoForm';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from './Header';
import Footer from './Footer';
import GalleryForm from './gallery/GalleryForm';
import GalleryList from './gallery/GalleryList';
import GalleryDetail from './gallery/GalleryDetail';
import LoginForm from './login/LoginForm';
import ReduxDemo1 from './reduxdemo/ReduxDemo1';
import ReduxDemo2 from './reduxdemo2/ReduxDemo2';
import JwtEncodingAtobDemo1 from './comp/JwtEncodingAtobDemo1';
function App() {
  return (
    <Router>
      <Header/>
      <Routes>
      {/* <Route path="/back/memoForm" element={<MemoForm/>}  /> */}
      <Route path="/back/galleryForm" element={<GalleryForm/>}  />
      <Route path="/back/gallery" element={<GalleryList/>}  />
      <Route path="/back/gallery/:id" element={<GalleryDetail/>} />
      {/* fake 실습을 위한 로그인 폼 */}
      <Route path='/back/login' element={<LoginForm/>}/>
      {/* 리덕스 테스트 */}
      <Route path='/back/reduxdemo' element={<ReduxDemo1/>}/>
      <Route path='/back/reduxdemo2' element={<ReduxDemo2/>}/>

      <Route path='/back/jwtDemo' element={<JwtEncodingAtobDemo1/>}/>
      </Routes>
      <Footer/>
    </Router>
  );
}
export default App;