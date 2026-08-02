import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "../../utils/axiosInstance"

// Send contact message
export const createContact = createAsyncThunk("contact/createContact", async (contactData, { rejectWithValue }) => {
  try {
    const { data } = await axios.post("/api/v1/contact/new", contactData)
    return data.message
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to send message")
  }
})

// Fetch all contacts (Admin)
export const fetchContacts = createAsyncThunk("contact/fetchContacts", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get("/api/v1/admin/contacts")
    return data.contacts
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch contacts")
  }
})

// Delete contact (Admin)
export const deleteContact = createAsyncThunk("contact/deleteContact", async (id, { rejectWithValue }) => {
  try {
    const { data } = await axios.delete(`/api/v1/admin/contact/${id}`)
    return { id, message: data.message }
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete contact")
  }
})

const contactSlice = createSlice({
  name: "contact",
  initialState: {
    contacts: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearContactErrors: (state) => {
      state.error = null
    },
    clearContactMessage: (state) => {
      state.successMessage = null
    },
  },
  extraReducers: (builder) => {
    builder
      // createContact
      .addCase(createContact.pending, (state) => {
        state.loading = true
      })
      .addCase(createContact.fulfilled, (state, action) => {
        state.loading = false
        state.successMessage = action.payload
      })
      .addCase(createContact.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // fetchContacts
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false
        state.contacts = action.payload
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // deleteContact
      .addCase(deleteContact.pending, (state) => {
        state.loading = true
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.loading = false
        state.contacts = state.contacts.filter((item) => item._id !== action.payload.id)
        state.successMessage = action.payload.message || "Contact deleted successfully"
      })
      .addCase(deleteContact.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearContactErrors, clearContactMessage } = contactSlice.actions
export default contactSlice.reducer
