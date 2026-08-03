import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { fetchNotifications, markNotificationAsRead, deleteNotification } from '../features/notification/notificationSlice'
import { Notifications, DoneAll, Close } from '@mui/icons-material'
import '../componentStyles/NotificationMenu.css'

const NotificationMenu = () => {
    const dispatch = useDispatch()
    const location = useLocation()
    const { notifications } = useSelector(state => state.notification)
    const { isAuthenticated } = useSelector(state => state.user)

    const [open, setOpen] = useState(false)
    const menuRef = useRef(null)

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchNotifications())
        }
    }, [dispatch, isAuthenticated, location.pathname])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleToggleOpen = () => {
        if (!open && isAuthenticated) {
            dispatch(fetchNotifications())
        }
        setOpen(!open)
    }

    const unreadCount = notifications ? notifications.filter(n => !n.isRead).length : 0

    const handleMarkAsRead = (id, e) => {
        e.stopPropagation()
        dispatch(markNotificationAsRead(id))
    }

    const handleDelete = (id, e) => {
        e.stopPropagation()
        dispatch(deleteNotification(id))
    }

    if (!isAuthenticated) return null

    return (
        <div className="notification-menu-wrapper" ref={menuRef}>
            <button className="notification-btn" onClick={handleToggleOpen} aria-label="Notifications">
                <Notifications />
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>

            {open && (
                <div className="notification-dropdown">
                    <div className="notification-header">
                        <h3>Notifications</h3>
                        <span className="unread-tag">{unreadCount} unread</span>
                    </div>

                    <div className="notification-list">
                        {!notifications || notifications.length === 0 ? (
                            <div className="no-notifications">
                                <p>No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map((item) => (
                                <div
                                    key={item._id}
                                    className={`notification-item ${!item.isRead ? 'unread' : ''}`}
                                    onClick={() => !item.isRead && dispatch(markNotificationAsRead(item._id))}
                                >
                                    <div className="notif-content">
                                        <h4 className="notif-title">{item.title}</h4>
                                        <p className="notif-message">{item.message}</p>
                                        <span className="notif-time">
                                            {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div className="notif-actions">
                                        {!item.isRead && (
                                            <button
                                                className="mark-read-btn"
                                                onClick={(e) => handleMarkAsRead(item._id, e)}
                                                title="Mark as read"
                                            >
                                                <DoneAll className="notif-icon-sm" />
                                            </button>
                                        )}
                                        <button
                                            className="delete-notif-btn"
                                            onClick={(e) => handleDelete(item._id, e)}
                                            title="Delete"
                                        >
                                            <Close className="notif-icon-sm" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default NotificationMenu
