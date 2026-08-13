import { createContext, useContext, useEffect, useState } from "react";
import {useNavigate} from "react-router-dom"
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";


export const AppContext = createContext(null);

export const AppContextProvider = ({children}) =>{

    const navigate = useNavigate();
    const [user, setUser] = useState(null)
    const [isSeller, setIsSeller] = useState(null)
     const [showUserLogin, setShowUserLogin] = useState(false)
     const[products , setProducts] = useState([])
      const[cartItems , setCartItems] = useState({})
      const[searchQuery , setSearchQuery] = useState("")

      const [darkMode, setDarkMode] = useState(
  localStorage.getItem("theme") === "dark"
);
 

       // Fetch all product data
     const fetchProducts = async () => {
      setProducts(dummyProducts);
     };

     //   //add product data
       const addToCart = (itemId) => {
       let cartData =  structuredClone(cartItems);
       if (cartData[itemId]) {
        cartData[itemId] += 1;
       } else{
        cartData[itemId] =1;
       }
       setCartItems(cartData);
       toast.success("added to cart")
     };

     //update cart item quantity
     const updateCartItem = (itemId, quantity) =>{
        let cartData = structuredClone(cartItems);
         cartData[itemId] = quantity;
         setCartItems(cartData);
         toast.success("cart updated")
     };

      // total cart items
  const cartCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
      totalCount += cartItems[item];
    }
    return totalCount;
  };

    // totalcart amount
  const totalCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      if (cartItems[items] > 0) {
        totalAmount += cartItems[items] * itemInfo.offerPrice;
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

    // remove product from cart
  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
      toast.success(`remove from cart`);
      setCartItems(cartData);
    }
  };

     useEffect(()=>{
        fetchProducts();
     },[]);

     useEffect(() => {
  if (darkMode) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}, [darkMode]);


     const toggleTheme = () => {
  const newTheme = !darkMode;
  setDarkMode(newTheme);

  if (newTheme) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
};

    const value = {navigate, user, setUser ,setIsSeller, isSeller , showUserLogin, setShowUserLogin , products, addToCart, updateCartItem, cartCount , totalCartAmount ,
       removeFromCart, cartItems , searchQuery , setSearchQuery,  darkMode,
  toggleTheme,
    }
    
    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}

export const useAppContext = () =>{
    return useContext(AppContext)
}