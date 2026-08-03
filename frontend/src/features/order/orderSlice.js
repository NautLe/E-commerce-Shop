import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"; 
import axios from "../../utils/axiosInstance";

// Creating order
export const createOrder = createAsyncThunk('order/createOrder', async(order, {rejectWithValue}) => {
    try {   
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const {data} = await axios.post('/api/v1/new/order', order, config)
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Order creating failed.')
    }
})

// Get user order
export const getAllMyOrders = createAsyncThunk('order/getAllMyOrders', async(_, {rejectWithValue}) => {
    try {   
        const {data} = await axios.get('/api/v1/orders')
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to fetch orders.')
    }
})

// Get order details
export const getOrderDetails = createAsyncThunk('order/getOrderDetails', async(orderId, {rejectWithValue}) => {
    try {   
        const {data} = await axios.get(`/api/v1/order/${orderId}`)
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to fetch order details.')
    }
})

// Cancel order (User or Admin)
export const cancelUserOrder = createAsyncThunk('order/cancelUserOrder', async(orderId, {rejectWithValue}) => {
    try {   
        const {data} = await axios.put(`/api/v1/order/cancel/${orderId}`)
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.response?.data || 'Failed to cancel order.')
    }
})

const orderSlice = createSlice({
    name: 'order',
    initialState: {
        success: false,
        loading: false,
        error: null,
        message: null,
        orders: [],
        order: {}
    },
    reducers: {
        removeErrors: (state) => {
            state.error = null
        },
        removeSuccess: (state) => {
            state.success = false
            state.message = null
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(createOrder.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(createOrder.fulfilled, (state, action) => {
            state.loading = false
            state.order = action.payload.order
            state.success = action.payload.success
        })
        .addCase(createOrder.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload?.message || "Order creating failed."
        })

        .addCase(getAllMyOrders.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(getAllMyOrders.fulfilled, (state, action) => {
            state.loading = false
            state.orders = action.payload.orders
            state.success = action.payload.success
        })
        .addCase(getAllMyOrders.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload?.message || "Failed to fetch orders."
        })

        .addCase(getOrderDetails.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(getOrderDetails.fulfilled, (state, action) => {
            state.loading = false
            state.order = action.payload.order
            state.success = action.payload.success
        })
        .addCase(getOrderDetails.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload?.message || "Failed to fetch order details."
        })

        .addCase(cancelUserOrder.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(cancelUserOrder.fulfilled, (state, action) => {
            state.loading = false
            state.order = action.payload.order
            state.success = action.payload.success
            state.message = action.payload.message
        })
        .addCase(cancelUserOrder.rejected, (state, action) => {
            state.loading = false
            state.error = typeof action.payload === 'string' ? action.payload : action.payload?.message || "Failed to cancel order."
        })
    }
})

export const {removeErrors, removeSuccess} = orderSlice.actions
export default orderSlice.reducer