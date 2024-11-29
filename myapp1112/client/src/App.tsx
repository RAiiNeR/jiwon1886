import Footer from 'Footer';
import GalleryForm from 'gallery/GalleryForm';
import GalleryList from 'gallery/GalleryList';
import Header from 'Header';
import MemoForm from 'memo/MemoForm';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Header/>
      <Routes>
        <Route path='/back/memo/new' element={<MemoForm/>}/>
        <Route path='/back/gallery/new' element={<GalleryForm/>}/>
        <Route path='/back/gallery' element={<GalleryList/>}/>
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
