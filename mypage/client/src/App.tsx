import React from 'react';
import MyPage from './mypage/MyPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import MainTest from './mypage/MainTest';
import MyPageUpdate from './mypage/MyPageUpdate';
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/mypage/:id' element={<MyPage/>}/>
          <Route path='/mypage/update/:id' element={<MyPageUpdate/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
