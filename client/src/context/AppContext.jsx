import { createContext, useContext, useEffect, useState } from "react";
import {useNavigate} from "react-router-dom"
import { dummyProducts } from "../assets/assets";
export const AppContext = createContext(null);

export const AppContextProvider = ({children}) =>{

    const navigate = useNavigate();
    const [user, setUser] = useState(null)
    const [isSeller, setIsSeller] = useState(null)
     const [showUserLogin, setShowUserLogin] = useState(false)
   
     const[products , setProducts] = useState([])
       // Fetch all product data
     const fetchProducts = async () => {
      setProducts(dummyProducts);
     };
     useEffect(()=>{
        fetchProducts();
     },[]);



    const value = {navigate, user, setUser ,setIsSeller, isSeller , showUserLogin, setShowUserLogin , products}
    
    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}

export const useAppContext = () =>{
    return useContext(AppContext)
}