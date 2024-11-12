import React from 'react';
import Chart from './chart/Chart';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ChartData from './chart/ChartData2';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Chart/>}/>
          <Route path='/chart/:dname' element={<ChartData/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;