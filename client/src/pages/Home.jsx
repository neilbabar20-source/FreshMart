import React from 'react'
import Hero from '../components/Hero'
import Category from '../components/Category'
import BestSeller from '../components/BestSeller'
import NewsLetter from '../components/NewsLetter'
import BottomBanner from '../components/BottomBanner'


const Home = () => {
  return (
    <div className='mt-10'>
   <Hero/>  
   <Category/>  
   <BestSeller/>
   <BottomBanner/>
   <NewsLetter/>
    </div>
  )
}

export default Home 
