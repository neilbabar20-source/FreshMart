import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import { useContext } from 'react'
import { AppContext } from './context/AppContext'
import MyOrders from './pages/MyOrders'
import Auth from './models/Auth'
import ProductCategory from './pages/ProductCategory'
import Footer from './components/Footer'

const App = () => {
   const {isSeller , showUserLogin } = useContext(AppContext);
  const isSellerPath = useLocation().pathname.includes("seller");
  return (

    <div className='text-default min-h-screen '>

    {isSellerPath ? null : <Navbar/>}

   {showUserLogin ? <Auth/> : null}

    <div  className='px-6 md:px-16 lg:px-24 xl:px-15 '>
      <Routes>

        <Route path="/" element={<Home/>}/>
        <Route path="/products" element={<Products/>}/>
        <Route path="/product/:category/:id" element={<ProductDetails/>}/>
        <Route path="/products/:category" element={<ProductCategory/>}/>
        <Route path="/cart" element={<Cart/>}/>  
        <Route path="/my-orders" element={<MyOrders/>}/>

      </Routes>
    </div>
      {isSeller ? null: <Footer/>}
    </div>
  )
}

export default App
