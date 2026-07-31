import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "../../utils/axiosInstance"

export const fetchWishlist = createAsyncThunk("wishlist/fetchWishlist", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get("/api/v1/wishlist")
    return data.wishlist
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch wishlist")
  }
})

export const addToWishlist = createAsyncThunk("wishlist/addToWishlist", async (productId, { rejectWithValue }) => {
  try {
    const { data } = await axios.post("/api/v1/wishlist/add", { productId })
    return data.wishlist
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to add to wishlist")
  }
})

export const removeFromWishlist = createAsyncThunk("wishlist/removeFromWishlist", async (productId, { rejectWithValue }) => {
  try {
    const { data } = await axios.delete(`/api/v1/wishlist/remove/${productId}`)
    return data.wishlist
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to remove from wishlist")
  }
})

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    wishlist: null,
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearWishlistErrors: (state) => {
      state.error = null
    },
    clearWishlistMessage: (state) => {
      state.message = null
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchWishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false
        state.wishlist = action.payload
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // addToWishlist
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false
        state.wishlist = action.payload
        state.message = "Added to wishlist successfully"
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // removeFromWishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false
        state.wishlist = action.payload
        state.message = "Removed from wishlist successfully"
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearWishlistErrors, clearWishlistMessage } = wishlistSlice.actions
export default wishlistSlice.reducer
