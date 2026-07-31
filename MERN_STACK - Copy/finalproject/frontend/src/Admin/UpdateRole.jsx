import React, { useEffect, useState } from 'react'
import '../AdminStyles/UpdateRole.css'
import Navbar from '../components/Navbar'
import PageTitle from '../components/PageTitle'
import Footer from '../components/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { showToast } from '../utils/showToast'
import { getSingleUser, removeErrors, removeSuccess, updateUserRole } from '../features/admin/adminSlice'
import { loadUser } from '../features/users/userSlice'

const UpdateProduct = () => {
    const { userId } = useParams()
    const { user, error, success, loading } = useSelector(state => state.admin)
    const dispatch = useDispatch()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: ""
    })
    const { name, email, role } = formData

    useEffect(() => {
        dispatch(getSingleUser(userId))
    }, [dispatch])
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                role: user.role || ""
            })
        }
    }, [user])

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    const submitHandler = (e) => {
        e.preventDefault();

        dispatch(
            updateUserRole({
                userId,
                role
            })
        );
    };

    useEffect(() => {
        if (success) {
            showToast.success("Role updated successfully");
            dispatch(removeSuccess());
            dispatch(loadUser());
            navigate("/admin/users");
        }

        if (error) {
            showToast.error(error);
            dispatch(removeErrors());
        }
    }, [success, error, dispatch, navigate]);
    return (
        <>
            <Navbar />
            <PageTitle title="Update User Role" />
            <div className="page-wrapper">
                <div className="update-user-role-container">
                    <h1>Update User Role</h1>
                    <form className="update-user-role-form" onSubmit={submitHandler}>
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input type="text" id='name' name='name' readOnly value={name} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="text" id='email' name='email' readOnly value={email} />
                        </div><div className="form-group">
                            <label htmlFor="role">Role</label>
                            <select
                                id="role"
                                name="role"
                                value={role}
                                onChange={handleChange}
                            >
                                <option value="">Select Role</option>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary">Update Role </button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    )
}
export default UpdateProduct