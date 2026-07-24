import React, { useEffect, useState } from 'react'
import '../UserStyles/Form.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { showToast } from '../utils/showToast'
import { useNavigate } from 'react-router-dom'
import { removeErrors, removeSuccess, updateProfile } from '../features/users/userSlice'
import Loader from '../components/Loader'

const UpdateProfile = () => {
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [avatar,setAvatar] = useState('')
    const [avatarPreview,setAvatarPreview] = useState('/images/admin-logo.png')
    const {loading , user, error, success, message} = useSelector(state=>state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const profileImageUpdate = (e)=>{           
        const file = e.target.files[0]
            if(!file) 
                return                                                                    
        const reader = new FileReader()
        reader.onload=()=>{
            if(reader.readyState===2){
                setAvatarPreview(reader.result)
                setAvatar(reader.result)
            }
        }
        reader.onerror=(error)=>{
            showToast.error('Error reading files.')
        }
        reader.readAsDataURL(e.target.files[0])
    }
    const updateSubmit = (e) => {
        e.preventDefault()
        const myForm = new FormData()
        myForm.set("name", name)
        myForm.set("email", email)
        myForm.set("avatar", avatar)

        dispatch(updateProfile(myForm))
    }
    useEffect(()=>{
        if(error){
          showToast.error(error)
          dispatch(removeErrors())
        }
      },[dispatch,error])
      useEffect(()=>{
          if(success){
            showToast.success(message)
            dispatch(removeSuccess())
            navigate('/profile')
          }
        },[dispatch,success])
        useEffect(()=>{
            if(user){
                setName(user.name)
                setEmail(user.email)
                setAvatarPreview(user.avatar?.url || '/images/admin-logo.png' )
            }   
        },[user])
  return (
    <>
   {loading ? <Loader/> :( <>
    <Navbar/>
    <div className="container update-container">
        <div className="form-content">
            <form className='form' encType='multipart/form-data' onSubmit={updateSubmit}>
                <h2>Update Profile</h2>
                <div className="input-group avatar-group">
                    <input type="file" accept='image/*' className="file-input" onChange={profileImageUpdate} />
                    <img src={avatarPreview} alt="User Profile" className='avatar' />
                </div>
                <div className="input-group">
                    <input type="text" value={name} name="name" onChange={(e)=>setName(e.target.value)}/>
                </div>
                <div className="input-group">
                    <input type="email" value={email} email="email" onChange={(e)=>setEmail(e.target.value)}/>
                </div>
                <button className="authBtn">Update</button>
            </form>
        </div>
    </div>
    <Footer/>
    </>)}
    </>
  )
}

export default UpdateProfile