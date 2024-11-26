import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './components/SignUp.jsx';
import Login from './components/Login.jsx';
import Shop from './components/Shop.jsx';
import CreateProduct from './components/CreateProduct.jsx';
import ProtectedRoutes from './components/ProtectedRoutes.jsx';
import Cart from './components/Cart.jsx';
import Profile from './components/Profile.jsx';
import EditProfile from './components/EditProfile.jsx';
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoutes />}>
        <Route path="/shop" element={<Shop />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/owner/createproduct" element={<CreateProduct />} />
        <Route path="/users/edit-profile" element={<EditProfile />} />
        <Route path="/cart" element={<Cart />} />
      </Route>
    </Routes>
  )
}

export default App