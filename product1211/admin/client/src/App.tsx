import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import EquipmentList from './equipment/EquipmentList';
import EquipmentForm from './equipment/EquipmentForm';
import EquipmentDetail from './equipment/EquipmentDetail';
import EquipmentUpdate from './equipment/EquipmentUpdate';


function App() {
  return (
  <BrowserRouter>
  <Routes>
  <Route path="/equipment" element={<EquipmentList />} />
  <Route path="/equipment/new" element={<EquipmentForm />} />
  <Route path="/equipment/:num" element={<EquipmentDetail />} />
  <Route path="/equipment/update/:num" element={<EquipmentUpdate />} />
  </Routes>
  </BrowserRouter>
  );
}

export default App;
