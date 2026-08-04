import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../utils/axiosInstance'

export const getProduct = createAsyncThunk('product/getProduct', async ({ keyword = '', page = 1, category, subcategory, sort, limit }, { rejectWithValue }) => {
    try {
        let link = '/api/v1/products?page=' + page
        if (limit) {
            link += `&limit=${limit}`
        }
        if (category && category !== 'All') {
            link += `&category=${encodeURIComponent(category)}`
        }
        if (subcategory && subcategory !== 'All') {
            link += `&subcategory=${encodeURIComponent(subcategory)}`
        }
        if (keyword) {
            link += `&keyword=${encodeURIComponent(keyword)}`
        }
        if (sort && sort !== 'default') {
            link += `&sort=${sort}`
        }

        const { data } = await axios.get(link)
        return data

    } catch (error) {
        return rejectWithValue(error.response?.data || 'An error occurred')
    }

})

// product details
export const getProductDetails = createAsyncThunk('product/getProductDetails', async(id,{rejectWithValue})=>{
    try {
        const link = `/api/v1/product/${id}`
        const {data} = await axios.get(link)
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data || "An error occurred")
    }
})

// Create / update product review
export const createReview = createAsyncThunk('product/createReview', async({productId, rating, comment},{rejectWithValue})=>{
    try {
        const config = 
        { headers: 
            { 
                "Content-Type": "application/json" 
            }, withCredentials: true }
        const {data} = await axios.put(`/api/v1/product/review/${productId}`, { rating, comment, productId }, config)
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to submit review")
    }
})

const productSlice = createSlice({
    name: 'product',
    initialState: {
        products: [],
        productCount: 0,
        loading: false,
        error: null,
        product: null,
        resultsPerPage: 4,
        totalPages: 1,
        reviewSuccess: false,
        reviewError: null,
        reviewLoading: false,
        filteredProductsCount: 0
    },
    reducers: {
        removeErrors: (state) => {
            state.error = null
        },
        removeReviewSuccess: (state) => {
            state.reviewSuccess = false
        },
        removeReviewError: (state) => {
            state.reviewError = null
        }
    },
    extraReducers: (builder) =>{
        builder
        .addCase(getProduct.pending, (state)=>{
            state.loading= true
            state.error = null
        })
        .addCase(getProduct.fulfilled,(state,action)=>{
            console.log('Fulfilled action payload' ,action.payload);
            state.loading = false
            state.error = null
            state.products=action.payload.products
            state.productCount=action.payload.productsCount
            state.resultsPerPage=action.payload.resultsPerPage
            state.totalPages=action.payload.totalPages
            state.filteredProductsCount = action.payload.filteredProductsCount


        })
        .addCase(getProduct.rejected,(state,action)=>{
            state.loading= false
            state.error = action.payload || 'Something went wrong.'
            state.products=[]
        })
        
        builder.addCase(getProductDetails.pending,(state)=>{
            state.loading=true
            state.error=null
        })
        .addCase(getProductDetails.fulfilled,(state, action)=>{
            console.log('Fulfilled action payload', action.payload);
            state.loading= false
            state.error = null
            state.product=action.payload.product
        })
        .addCase(getProductDetails.rejected,(state, action)=>{
            state.loading=false
            state.error= action.payload || 'Something went wrong.'
        })

        builder.addCase(createReview.pending,(state)=>{
            state.reviewLoading=true
            state.reviewError=null
            state.reviewSuccess=false
        })
        .addCase(createReview.fulfilled,(state, action)=>{
            state.reviewLoading= false
            state.reviewError = null
            state.reviewSuccess= true
        })
        .addCase(createReview.rejected,(state, action)=>{
            state.reviewLoading=false
            state.reviewError= action.payload || 'Failed to submit review'
            state.reviewSuccess=false
        })
    }
})

export const { removeErrors, removeReviewSuccess, removeReviewError } = productSlice.actions
export default productSlice.reducer