import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './components/SignUp.jsx';
import Login from './components/Login.jsx';
import Shop from './components/Shop.jsx';
import CreateProduct from './components/CreateProduct.jsx';
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/owner/createproduct" element={<CreateProduct />} />
    </Routes>
  )
}

export default App