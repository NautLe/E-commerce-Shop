import React from 'react'
import '../AdminStyles/UsersList.css'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import PageTitle from '../components/PageTitle'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { clearMessage, deleteUser, fetchUsers, removeErrors, removeSuccess } from '../features/admin/adminSlice'
import Loader from '../components/Loader'
import { showToast } from '../utils/showToast'
import { Delete, Edit } from '@mui/icons-material'
const UsersList = () => {
    const {users,loading,error,message} = useSelector(state=>state.admin)
    const navigate = useNavigate()
    console.log(users);
    
    const dispatch = useDispatch()
    useEffect(()=>{
        dispatch(fetchUsers())
    },[dispatch])


        
    const handleDelete = (userId) =>{
        const confirm = window.confirm("Are you sure you want to delete this user?")
        if(confirm){
            dispatch(deleteUser(userId))
        }
    } 

    useEffect(() => {
            if (error) {
                showToast.error(error)
                dispatch(removeErrors())
            }
            if (message) {
                showToast.success(message)
                dispatch(clearMessage())
                navigate('/admin/dashboard')
            }
        }, [dispatch, error,message])
  return (
    <>
   {loading ? (<Loader />) :( <>
    <Navbar/>
    <PageTitle title = 'All Users'/>
    <div className="usersList-container">
        <h1 className="usersList-title">All Users</h1>
        <div className="usersList-table-container">
            <table className="usersList-table">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Created At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user,index)=>(
                    <tr key={user._id}>
                        <td>{index+1}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td>
                            <Link to={`/admin/user/${user._id}`} className='action-icon edit-icon' onClick={()=>handleDelete(user._id)}><Edit /></Link>
                            <button className="action-icon delete-icon"><Delete/></button>
    
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
    <Footer/>
    </>)}
    </>
  )
}

export default UsersList