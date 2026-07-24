import React, { useEffect, useState } from 'react'
import '../UserStyles/Form.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageTitle from '../components/PageTitle'
import Loader from '../components/Loader'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { removeErrors, removeSuccess, updatePassword } from '../features/users/userSlice'
import { showToast } from '../utils/showToast'

const UpdatePassword = () => {
    const { success, loading, error } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const updatePasswordSubmit = (e) => {
        e.preventDefault()

        if (!oldPassword || !newPassword || !confirmPassword) {
            showToast.error("Please fill in all fields.")
            return;
        }

        if (newPassword !== confirmPassword) {
            showToast.error("New password and confirm password do not match.")
            return;
        }

        const myForm = new FormData()
        myForm.set("oldPassword", oldPassword)
        myForm.set("newPassword", newPassword)
        myForm.set("confirmPassword", confirmPassword)

        dispatch(updatePassword(myForm))
    }

    useEffect(() => {
        if (error) {
            showToast.error(error)
            dispatch(removeErrors())
        }
    }, [dispatch, error])

    useEffect(() => {
        if (success) {
            showToast.success("Password Updated Successfully!")
            dispatch(removeSuccess())
            navigate('/profile')
        }
    }, [dispatch, success, navigate])

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <Navbar />
                    <PageTitle title='Password Update' />
                    <div className="container update-container">
                        <div className="form-content">
                            <form className='form' onSubmit={updatePasswordSubmit}>
                                <h2>Update Password</h2>
                                <div className="input-group">
                                    <input
                                        type="password"
                                        name="oldPassword"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        placeholder='Old Password'
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder='New Password'
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
                                <button className="authBtn" disabled={loading}>
                                    {loading ? "Updating..." : "Update Password"}
                                </button>
                            </form>
                        </div>
                    </div>
                    <Footer />
                </>
            )}
        </>
    )
}

export default UpdatePassword