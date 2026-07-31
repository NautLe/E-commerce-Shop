import React from 'react'
import {useSelector } from 'react-redux'
import Loader from '../components/Loader'
import { Navigate, useLocation } from 'react-router-dom'


const ProtectedRoutes = ({element, adminOnly=false}) => {
    const {isAuthenticated,loading,user} = useSelector(state=>state.user)
    const location = useLocation()

    if(loading){
        return <Loader/>
    }
    if(!isAuthenticated){
        return <Navigate to={`/login?redirect=${location.pathname}${location.search}`} /> 
    }
    if(adminOnly && user.role!=='admin'){
        return <Navigate to ='/'/>
    }

  return element
}

export default ProtectedRoutes