import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "../../utils/axiosInstance"

export const fetchNotifications = createAsyncThunk("notification/fetchNotifications", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get("/api/v1/notifications")
    return data.notifications
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch notifications")
  }
})

export const markNotificationAsRead = createAsyncThunk("notification/markNotificationAsRead", async (id, { rejectWithValue }) => {
  try {
    const { data } = await axios.put(`/api/v1/notification/${id}/read`)
    return data.notification
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to mark notification as read")
  }
})

export const deleteNotification = createAsyncThunk("notification/deleteNotification", async (id, { rejectWithValue }) => {
  try {
    const { data } = await axios.delete(`/api/v1/notification/${id}`)
    return { id, message: data.message }
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete notification")
  }
})

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notifications: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearNotificationErrors: (state) => {
      state.error = null
    },
    clearNotificationMessage: (state) => {
      state.message = null
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchNotifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false
        state.notifications = action.payload
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // markNotificationAsRead
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex((n) => n._id === action.payload._id)
        if (index !== -1) {
          state.notifications[index] = action.payload
        }
      })
      // deleteNotification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter((n) => n._id !== action.payload.id)
      })
  },
})

export const { clearNotificationErrors, clearNotificationMessage } = notificationSlice.actions
export default notificationSlice.reducer
