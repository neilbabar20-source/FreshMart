import React, { useContext } from 'react'
import { categories } from '../assets/assets';
import { AppContext, useAppContext } from '../context/AppContext';

const Category = () => {
   const { navigate } = useContext(AppContext);   //YE FUNCTION PAGE CHANGE KARNE KELIYE USE HOTA HE
  return (
    <div className="mt-16">
       <p className="text-2xl md:text-3xl font-medium">Categories</p>

       <div className=" my-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4 items-center justify-center">
        {categories.map((category, index) => (   // CATEGORY.MAP KA KAM HE KI ARRAY KE HAR OBJECT KO LAKER USKE LIYE EK REACT LEMENT <DIV> BANANA AUR BROSER ME RENDER KARNA ,IT KEEPS RENDERING UNTIL ALL CATEGORYS ARE DISPLAYED
                                                  //ISLIYE BROWSER ME SARI CATEGORIES AUTOMATICALY DHIK JATI HE
          <div
            key={index}                        // REACT KO HAR ITEM KI UNIQUE IDENTITY CHAIYE HOTI ISLYE YE KEY BAN JATI HAI
            className={`group cursor-pointer py-5 px-3 rounded-lg gap-2 flex flex-col items-center justify-center`}
            style={{ backgroundColor: category.bgColor }}
            onClick={() => {
              navigate(`/products/${category.path.toLowerCase()}`);   // JAB USER CATEORY PE CLICK KAREGA , BROSER PRODUCT PAGE PE CHALA JAYEGA
              scrollTo(0, 0);
            }}
          >
            <img  
              src={category.image}
              alt=""
              className="max-w-28 transition group-hover:scale-110"
            />
            <p className="text-sm font-medium">{category.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Category;
