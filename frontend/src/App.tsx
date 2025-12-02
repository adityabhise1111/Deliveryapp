import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import UserLogin from './pages/UserLogin'
import UserSignUp from './pages/UserSignUp'
import CaptainLogin from './pages/CaptainLogin'
import CaptainSignUp from './pages/CaptainSignUp'
import Start from './pages/Start'
import UserProtectWrapper from './pages/UserProtectWrapper'
import UserLogout from './pages/UserLogout'
import CaptainProtectWrapper from './pages/CaptainProtectWrapper'
import CaptainHome from './pages/CaptainHome'
import CaptainLogout from './pages/CaptainLogout'
import Riding from './pages/Riding'
import CaptainRiding from './pages/CaptainRiding'
const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Start/>}/>


        
        <Route path='/home' element={ 
          <UserProtectWrapper>
            <Home/>
          </UserProtectWrapper>
         }/>
         <Route path='/captain-home' element={
          <CaptainProtectWrapper>
            <CaptainHome/>
          </CaptainProtectWrapper>
         }/>




        <Route path='/login' element={<UserLogin/>}/>
        <Route path='/signup' element={<UserSignUp/>}/>
        <Route path='/logout' element={<UserLogout/>}/>
        <Route path='/riding' element={<Riding/>}/>
        <Route path='/captain-riding' element={<CaptainRiding/>}/>
        <Route path='/captain-login' element={<CaptainLogin/>}/>
        <Route path='/captain-signup' element={<CaptainSignUp/>}/>
        <Route path='/captain-logout' element={<CaptainLogout/>}/>

        <Route path='*' element={<div>404 Not Found</div>}/>
      </Routes>
    </>
  )
}

export default App