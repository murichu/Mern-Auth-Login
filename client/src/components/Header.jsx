import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';

const Header = () => {

  const { userData } = useContext(AppContext);


  return (
    <div className='flex flex-col items-center text-center p-4 sm:p-8'>
      <img 
        className='w-36 h-36 rounded-full mb-6 shadow-lg' 
        src={assets.header_img} 
        alt="User Header" 
      />
      <h1 className='text-2xl sm:text-3xl font-semibold mb-4'>
        Hey {userData ? userData.name : 'Developer'} ! <img className='w-8 aspect-square inline-block' src={assets.hand_wave} alt="Wave" />
      </h1>

      <h2 className='text-xl sm:text-2xl font-medium mb-4'>
        Welcome to our App
      </h2>
      <p className='text-gray-700 mb-6 max-w-md'>
        Let's start with a quick product tour and we will have you up and running in no time!
      </p>
      <button 
        className='border border-gray-500 rounded-full px-8 py-2.5 text-gray-800 hover:bg-gray-100 transition-all'
      >
        Get Started
      </button>
    </div>
  )
}

export default Header
