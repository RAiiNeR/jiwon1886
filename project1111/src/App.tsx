import React from 'react';
import Chart from './chart/Chart';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ChartData from './chart/ChartData';
import ChartAdmin from './chart/ChartAdmin';
import ChartMain from './chart/ChartMain';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<ChartMain/>}/>
          <Route path='/chart' element={<Chart/>}/>
          <Route path='/chartAdmin' element={<ChartAdmin/>}/>
          <Route path='/chartAdmin/:dname' element={<ChartData/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;