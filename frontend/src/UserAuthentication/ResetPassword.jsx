import React from 'react'
import '../UserStyles/Form.css'
import PageTitle from '../components/PageTitle'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { removeErrors, removeSuccess, resetPassword } from '../features/users/userSlice'
import { useEffect } from 'react'
import { showToast } from '../utils/showToast'
const ResetPassword = () => {
    const { success, loading, error } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const{token} = useParams()
    const resetPasswordSubmit = (e)=>{
        e.preventDefault()
        const data={
            password,
            confirmPassword
        }
        dispatch(resetPassword({token: token,userData: data}))
    }
    useEffect(() => {
            if (error) {
                showToast.error(error)
                dispatch(removeErrors())
            }
        }, [dispatch, error])
         useEffect(() => {
                if (success) {
                    showToast.success("Password Reset Successful.")
                    dispatch(removeSuccess())
                    navigate('/login')
                }
            }, [dispatch, success, navigate])
  return (
    <>
     <PageTitle title='Reset Password' />
                    <div className="container form-container">
                        <div className="form-content">
                            <form className='form' onSubmit={resetPasswordSubmit}>
                                <h2>Reset Password</h2>
                                
                                <div className="input-group">
                                    <input
                                        type="password"
                                        name="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder='Enter your new Password'
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder='Confirm Password'
                                        required
                                    />
                                </div>
                                <button className="authBtn"     >
                                    Update
                                </button>
                            </form>
                        </div>
                    </div>
    </>  
  )
}

export default ResetPassword