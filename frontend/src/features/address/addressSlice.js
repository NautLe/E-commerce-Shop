import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "../../utils/axiosInstance"

export const fetchAddresses = createAsyncThunk("address/fetchAddresses", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get("/api/v1/addresses")
    return data.addresses
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch addresses")
  }
})

export const createAddress = createAsyncThunk("address/createAddress", async (addressData, { rejectWithValue }) => {
  try {
    const { data } = await axios.post("/api/v1/address/new", addressData)
    return data.address
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to create address")
  }
})

export const updateAddress = createAsyncThunk("address/updateAddress", async ({ id, addressData }, { rejectWithValue }) => {
  try {
    const { data } = await axios.put(`/api/v1/address/${id}`, addressData)
    return data.address
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to update address")
  }
})

export const deleteAddress = createAsyncThunk("address/deleteAddress", async (id, { rejectWithValue }) => {
  try {
    const { data } = await axios.delete(`/api/v1/address/${id}`)
    return { id, message: data.message }
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete address")
  }
})

const addressSlice = createSlice({
  name: "address",
  initialState: {
    addresses: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearAddressErrors: (state) => {
      state.error = null
    },
    clearAddressMessage: (state) => {
      state.message = null
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAddresses
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false
        state.addresses = action.payload
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // createAddress
      .addCase(createAddress.pending, (state) => {
        state.loading = true
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.loading = false
        state.addresses.unshift(action.payload)
        state.message = "Address added successfully"
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // updateAddress
      .addCase(updateAddress.pending, (state) => {
        state.loading = true
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.loading = false
        const index = state.addresses.findIndex((a) => a._id === action.payload._id)
        if (index !== -1) {
          state.addresses[index] = action.payload
        }
        state.message = "Address updated successfully"
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // deleteAddress
      .addCase(deleteAddress.pending, (state) => {
        state.loading = true
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.loading = false
        state.addresses = state.addresses.filter((a) => a._id !== action.payload.id)
        state.message = action.payload.message || "Address deleted successfully"
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearAddressErrors, clearAddressMessage } = addressSlice.actions
export default addressSlice.reducer
