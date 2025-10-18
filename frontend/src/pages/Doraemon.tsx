import React from 'react';

const Doraemon = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 p-4">
      {/* Main Container */}
      <div className="relative w-64 h-80">
        
        {/* Head */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-48 h-48 bg-blue-500 rounded-full border-4 border-blue-700">
          
          {/* Face */}
          <div className="relative w-full h-full">
            
            {/* Eyes */}
            <div className="absolute top-8 left-6 w-16 h-12 bg-white rounded-full flex justify-between">
              <div className="w-6 h-6 bg-black rounded-full mt-3 ml-2"></div>
              <div className="w-6 h-6 bg-black rounded-full mt-3 mr-2"></div>
            </div>
            
            {/* Nose */}
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-red-500 rounded-full border-2 border-red-600"></div>
            
            {/* Mouth */}
            <div className="absolute top-32 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-black"></div>
            <div className="absolute top-36 left-1/2 transform -translate-x-1/2 w-20 h-6 bg-white border-2 border-black rounded-b-full"></div>
            
            {/* Whiskers */}
            <div className="absolute top-24 left-4 w-12 h-0.5 bg-black transform -rotate-15"></div>
            <div className="absolute top-24 right-4 w-12 h-0.5 bg-black transform rotate-15"></div>
            <div className="absolute top-28 left-4 w-12 h-0.5 bg-black transform -rotate-15"></div>
            <div className="absolute top-28 right-4 w-12 h-0.5 bg-black transform rotate-15"></div>
            
          </div>
          
          {/* Bell */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-yellow-400 rounded-full border-2 border-yellow-500">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-2 bg-yellow-600"></div>
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-yellow-600"></div>
          </div>
          
        </div>
        
        {/* Body */}
        <div className="absolute top-48 left-1/2 transform -translate-x-1/2 w-40 h-32 bg-blue-500 rounded-b-3xl border-4 border-blue-700 border-t-0">
          
          {/* Pocket */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-32 h-20 bg-white rounded-lg border-2 border-blue-700">
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-28 h-4 bg-blue-500 rounded-full"></div>
          </div>
          
        </div>
        
        {/* Arms */}
        <div className="absolute top-52 left-4 w-6 h-16 bg-blue-500 rounded-full border-2 border-blue-700"></div>
        <div className="absolute top-52 right-4 w-6 h-16 bg-blue-500 rounded-full border-2 border-blue-700"></div>
        
        {/* Hands */}
        <div className="absolute top-64 left-4 w-8 h-6 bg-white rounded-full border-2 border-blue-700"></div>
        <div className="absolute top-64 right-4 w-8 h-6 bg-white rounded-full border-2 border-blue-700"></div>
        
        {/* Legs */}
        <div className="absolute top-72 left-12 w-8 h-12 bg-white rounded-full border-2 border-blue-700"></div>
        <div className="absolute top-72 right-12 w-8 h-12 bg-white rounded-full border-2 border-blue-700"></div>
        
        {/* Feet */}
        <div className="absolute top-80 left-10 w-12 h-6 bg-white rounded-full border-2 border-blue-700"></div>
        <div className="absolute top-80 right-10 w-12 h-6 bg-white rounded-full border-2 border-blue-700"></div>
        
      </div>
      
      {/* Title */}
      <h1 className="mt-8 text-3xl font-bold text-blue-800 font-comic">Doraemon</h1>
      <p className="mt-2 text-blue-600">From the future with love! 💙</p>
    </div>
  );
};

export default Doraemon;