import React, { useEffect, useState } from 'react'
import '../UserStyles/Form.css'
import Navbar from '../components/Navbar'
import PageTitle from '../components/PageTitle'
import { showToast } from '../utils/showToast'
import { removeErrors, removeSuccess, forgotPassword } from '../features/users/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'

const ForgotPassword = () => {
    const { loading, error, success, message } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [email, setEmail] = useState('')

    const handleForgotPasswordSubmit = (e) => {
        e.preventDefault()
        dispatch(forgotPassword({ email }))
        setEmail("")
    }

    useEffect(() => {
        if (error) {
            showToast.error(error)
            dispatch(removeErrors())
        }
    }, [dispatch, error])

    useEffect(() => {
        if (success) {
            showToast.success(message)
            dispatch(removeSuccess())
        }
    }, [dispatch, success])

    return (
        <>
        {loading?<Loader/> : (<>
            <PageTitle title='Forgot Password'></PageTitle>
            <Navbar />
            
            <div className='forgot-container'>
                <div className='form-content email-group'>
                    <form className="form" onSubmit={handleForgotPasswordSubmit}>
                        <h2>Forgot Password</h2>
                        <div className="input-group">
                            <input 
                                type="email" 
                                placeholder='Enter your registered email' 
                                name='email' 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                        </div>
                        <button className='authBtn' >
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </>)}
        </>
    )
}

export default ForgotPassword