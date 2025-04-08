import React from 'react';
import Product from './product/Product';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ApplicationForm from './product/ApplicationForm';

function App() {
  return (
    <>
      {/* <Product/> */}
      <BrowserRouter>
        <Routes>
          <Route path='/rent' element={<Product/>}/>
          <Route path='/renting' element={<ApplicationForm/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
