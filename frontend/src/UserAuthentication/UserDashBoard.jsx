import React, { useState } from 'react'
import '../UserStyles/UserDashboard.css'
import { useNavigate } from 'react-router-dom'
import {useDispatch} from 'react-redux'
import { showToast } from '../utils/showToast'
import { logout, removeSuccess } from '../features/users/userSlice'
const UserDashBoard = ({user}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [menuVisible,setMenuVisible] = useState(false)
  function toggleMenu(){
    setMenuVisible(!menuVisible)
  }
  const options = [
    {name:'Orders',onClick: orders},
    {name:'Account Setting',onClick: profile},
    {name:'Logout',onClick: logoutUser}
  ]
  if(user.role==='user'){
    options.unshift({
      name:'Admin Dashboard', onClick:dashboard
    })
  }
  function orders(){
    navigate("/orders/user")
  }
  function profile(){
    navigate("/profile")
  }
  function logoutUser(){
    dispatch(logout())
    .unwrap()
    .then(()=>{
      showToast.success('Logout Successful.')
      dispatch(removeSuccess())
      navigate('/login')
    })
    .catch((error)=>{
      showToast.error(error.message || 'Logout Failed.')

    })
  }
  function dashboard(){
    navigate("/admin/dashboard")

  }

  return (
    <>
    <div className={`overlay ${menuVisible?'show':''}`} onClick={toggleMenu}></div>
    <div className="dashboard-container">
      <div className="profile-header" onClick={toggleMenu}>
        <img src={user.avatar.url?user.avatar.url:'/images/admin-logo.png' } alt="Profile Picture" className='profile-avatar' />
        <span className="profile-name">{user.name || 'user'}</span>
      </div>
      {menuVisible && (<div className="menu-options">
        {options.map((items)=>(
          <button className="menu-option-btn" onClick={items.onClick} key={items.name}>{items.name}</button>
        ))}
      </div>) }
    </div>
    </>
  )
}

export default UserDashBoard