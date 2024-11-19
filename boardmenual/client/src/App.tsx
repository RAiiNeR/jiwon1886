import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BoardList from './board/BoardList';
import BoardForm from './board/BoardForm';
import BoardDetail from './board/BoardDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<BoardList />} />
        <Route path='/boardForm' element={<BoardForm />} />
        {/* :num => const {num} = useParam() */}
        <Route path='/:num' element={<BoardDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
