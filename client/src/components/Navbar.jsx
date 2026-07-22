import { useState } from "react"
import { assets } from "../assets/assets"
import { Link } from "react-router-dom"
import { AppContext, useAppContext } from "../context/AppContext"
import { useContext } from "react"
import { FaBasketShopping } from "react-icons/fa6";



const Navbar = () => {
    const [open, setOpen] = useState(false)
    const { user, setUser, navigate, setShowUserLogin } = useContext(AppContext);
    return (
        <nav className="  sticky
    top-0
    z-50
    flex
    items-center
    justify-between
    px-6
    md:px-16
    lg:px-24
    xl:px-32
    py-5
    bg-white/90
    backdrop-blur-md
    border-b
    border-gray-200
    shadow-sm
    transition-all
    duration-300bg-white/90">

         <Link to="/"  className="flex items-center gap-2 group">
         {/* <img className="h-9" src={assets.logo} alt="logo"></img> */}
           <FaBasketShopping
        className="
        text-emerald-600
        text-3xl
        transition-transform
        duration-300
        group-hover:rotate-12
        "
    />
              <h2 className="text-3xl font-extrabold tracking-tight text-emerald-600 transition-all duration-300 group-hover:scale-105"> FreshCart</h2>
         </Link>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-8">
                <Link to= {"/"}  className="relative
text-[17px]
font-semibold
text-gray-800
transition-all
duration-300
hover:text-emerald-600
hover:-translate-y-0.5
after:absolute
after:left-0
after:-bottom-1
after:w-0
after:h-0.5
after:bg-emerald-600
after:transition-all
after:duration-300
hover:after:w-full">Home</Link>
                <Link to={"/products"}  className="
   relative
text-[17px]
font-semibold
text-gray-800
transition-all
duration-300
hover:text-emerald-600
hover:-translate-y-0.5
after:absolute
after:left-0
after:-bottom-1
after:w-0
after:h-0.5
after:bg-emerald-600
after:transition-all
after:duration-300
hover:after:w-full
  ">All Products</Link>

                <div className="hidden lg:flex items-center gap-3
bg-gray-50
border border-gray-200
rounded-full
px-4
py-2
w-80
transition-all
duration-300
hover:border-emerald-300
focus-within:border-emerald-500
focus-within:ring-2
focus-within:ring-emerald-100">
                    <input className="w-full
bg-transparent
outline-none
text-gray-700
placeholder:text-gray-400" type="text" placeholder="Search fresh groceries.." />
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.836 10.615 15 14.695" stroke="#7A7B7D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        <path clipRule="evenodd" d="M9.141 11.738c2.729-1.136 4.001-4.224 2.841-6.898S7.67.921 4.942 2.057C2.211 3.193.94 6.281 2.1 8.955s4.312 3.92 7.041 2.783" stroke="#7A7B7D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>

                <div onClick={()=>{
                    navigate("/cart")
                }} className="relative
cursor-pointer
group
transition-transform
duration-300
hover:scale-110">
                    <img src={assets.cart_icon} alt="" className="w-7 h-7 transition-transform duration-300 group-hover:scale-110"/>
                    <button className="absolute -top-2 -right-3 text-[11px] text-white bg-emerald-600 w-5
h-5
font-semibold rounded-full">
                        3
                        </button>
                </div>

                   {user ? (
                    <>
                    <div className="relative group">
                    <img src={assets.profile_icon} alt="" className="w-10"/>
                    <ul className="hidden group-hover:block absolute top-10 right-0 bg-white shadow-md rounded-b-md border border-gray-200 py-2.5 w-25 px-3 z-40 text-sm">
                        <li onClick={()=>{
                            navigate("/my-orders")
                        }} className="p-1.5 cursor-pointer">My order</li>
                        <li onClick={()=>{
                            setUser(null)
                        }} className="p-1.5 cursor-pointer">Logout</li>
                    </ul>
                   </div>
                    </>
                   ) : ( 
                     <button onClick={() =>{
                        setShowUserLogin(true)
                     }} className="cursor-pointer
px-7
py-2.5
bg-emerald-600
hover:bg-emerald-700
text-white
font-semibold
rounded-full
shadow-md
hover:shadow-lg
hover:scale-105
transition-all
duration-300">
                 Login →
                </button>
            )}
          </div>

            <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label="Menu" className="sm:hidden">
                {/* Menu Icon SVG */}
                <svg width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="21" height="1.5" rx=".75" fill="#426287" />
                    <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#426287" />
                    <rect x="6" y="13" width="15" height="1.5" rx=".75" fill="#426287" />
                </svg>
            </button>

            {/* Mobile Menu */}
            <div className={`${open ? 'flex' : 'hidden'} absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden`}>
                 <Link to= {"/"}>Home</Link>
                 <Link to={"/products"}>All Products</Link>
                        {user ? (
                    <>
                    <div className="relative group">
                    <img src={assets.profile_icon} alt="" className="w-10"/>
                    <ul className="hidden group-hover:block absolute top-10 right-0 bg-white shadow-md rounded-b-md border border-gray-200 py-2.5 w-25 px-3 z-40 text-sm">
                        <li onClick={()=>{
                            navigate("/my-orders")
                        }} className="p-1.5 cursor-pointer">My order</li>
                        <li onClick={()=>{
                            setUser(null)
                        }} className="p-1.5 cursor-pointer">Logout</li>
                    </ul>
                   </div>
                    </>
                   ) : ( 
                     <button className="cursor-pointer px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full">
                    Login
                </button>
            )}
            </div>

        </nav>
    )
}

export default Navbar