import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from '../../utils/axiosInstance'

// Fetch current cart from session
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/api/v1/cart')
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to fetch cart.')
    }
})

// Add an item to the cart 
export const addItemsToCart = createAsyncThunk('cart/addItemsToCart', async ({ id, quantity, size, image }, { rejectWithValue }) => {
    try {
        // Fetch product details first
        const { data: productData } = await axios.get(`/api/v1/product/${id}`)

        if (!productData.product || productData.product.stock <= 0) {
            return rejectWithValue({ message: 'Product is out of stock.' })
        }

        const isEssential = productData.product.category?.toLowerCase() === 'essentials'
        const itemSize = size || (isEssential ? 'OS' : (productData.product.sizes?.[0] || 'S'))

        const payload = {
            productId: productData.product._id,
            name: productData.product.name,
            price: productData.product.price,
            image: image || productData.product.image[0]?.url,
            stock: productData.product.stock,
            quantity,
            size: itemSize
        }

        // Send to backend to store in session
        const { data } = await axios.post('/api/v1/cart/add', payload)
        return { ...data, itemName: payload.name }
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message || 'An error Occurred.')
    }
})

// Update quantity of an item already in the cart
export const updateCartItemQty = createAsyncThunk('cart/updateCartItemQty', async ({ productId, quantity }, { rejectWithValue }) => {
    try {
        const { data } = await axios.put('/api/v1/cart/update', { productId, quantity })
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to update cart item.')
    }
})

// Remove a single item from the cart
export const removeItemFromCart = createAsyncThunk('cart/removeItemFromCart', async (productId, { rejectWithValue }) => {
    try {
        const { data } = await axios.delete(`/api/v1/cart/remove/${productId}`)
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to remove item.')
    }
})

// Clear the entire cart after an order is successfully placed
export const clearCart = createAsyncThunk('cart/clearCart', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.delete('/api/v1/cart/clear')
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to clear cart.')
    }
})

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cartItems: [],
        loading: false,
        error: null,
        success: false,
        message: null,
        removingId: null,
        shippingInfo: JSON.parse(localStorage.getItem('shippingInfo')) || {}
    },
    reducers: {
        removeErrors: (state) => {
            state.error = null
        },
        removeMessage: (state) => {
            state.message = null
        },
        removeSuccess: (state) => {
            state.success = false
        },
        saveShippingInfo: (state, action) => {
            state.shippingInfo = action.payload
            localStorage.setItem('shippingInfo', JSON.stringify(state.shippingInfo))
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch cart from session
            .addCase(fetchCart.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false
                state.cartItems = action.payload.cartItems
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload?.message || 'Failed to fetch cart.'
            })

            // Add item to cart
            .addCase(addItemsToCart.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(addItemsToCart.fulfilled, (state, action) => {
                state.loading = false
                state.cartItems = action.payload.cartItems
                state.success = true
                state.message = `${action.payload.itemName} added to cart successfully`
            })
            .addCase(addItemsToCart.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload?.message || 'An error Occurred.'
            })

            // Update item quantity
            .addCase(updateCartItemQty.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateCartItemQty.fulfilled, (state, action) => {
                state.loading = false
                state.cartItems = action.payload.cartItems
            })
            .addCase(updateCartItemQty.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload?.message || 'Failed to update cart item.'
            })

            // Remove item
            .addCase(removeItemFromCart.pending, (state, action) => {
                state.removingId = action.meta.arg
            })
            .addCase(removeItemFromCart.fulfilled, (state, action) => {
                state.cartItems = action.payload.cartItems
                state.removingId = null
            })
            .addCase(removeItemFromCart.rejected, (state, action) => {
                state.error = action.payload?.message || 'Failed to remove item.'
                state.removingId = null
            })

            // Clear cart
            .addCase(clearCart.fulfilled, (state) => {
                state.cartItems = []
            })
    }
})

export const { removeErrors, removeMessage, removeSuccess, saveShippingInfo } = cartSlice.actions
export default cartSlice.reducer