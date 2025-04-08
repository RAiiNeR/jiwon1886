import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BoardList from './board/BoardList';
import BoardForm from './board/BoardForm';
import BoardDetail from './board/BoardDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<BoardList/>}/>
        <Route path='/boardForm' element={<BoardForm/>}/>
        <Route path='/:num' element={<BoardDetail/>}/>
        {/* 여기에 있는 :num은 const { num } = useParam()이다 */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
