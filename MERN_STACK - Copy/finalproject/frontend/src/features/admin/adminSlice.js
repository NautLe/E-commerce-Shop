import { createAsyncThunk } from '@reduxjs/toolkit'
import {createSlice} from '@reduxjs/toolkit'
import axios from '../../utils/axiosInstance'
// fetch all products 
export const fetchAdminProducts = createAsyncThunk('/admin/fetchAdminProducts',async(_,{rejectWithValue})=>{
    try{
        
        const {data} = await axios.get("/api/v1/admin/products")
        return data;
    }catch(error){
        return rejectWithValue(error.response?.data || "Error while fetching the products.")
    }
})

// create  products 
export const createAdminProducts = createAsyncThunk('/admin/createAdminProducts',async(productData,{rejectWithValue})=>{
    try{
        
        const {data} = await axios.post("/api/v1/admin/product/create",productData)
        return data;
    }catch(error){
        return rejectWithValue(error.response?.data || "Product creation failed.")
    }
})

// Update Products
export const updateAdminProduct = createAsyncThunk('/admin/updateAdminProducts',async({id,formData},{rejectWithValue})=>{
    try{
        
        const {data} = await axios.put(`/api/v1/admin/product/${id}`,formData)
        return data;
    }catch(error){
        return rejectWithValue(error.response?.data || "Product update failed.")
    }
})

// delete Products
export const deleteProduct = createAsyncThunk('/admin/deleteProduct',async(productId,{rejectWithValue})=>{
    try{
        
        const {data} = await axios.delete(`/api/v1/admin/product/${productId}`)
        return {productId,data};
    }catch(error){
        return rejectWithValue(error.response?.data || "Product deletion failed.")
    }
})
// fetch  all users
export const fetchUsers = createAsyncThunk('/admin/fetchUsers',async(_,{rejectWithValue})=>{
    try{
        
        const {data} = await axios.get('/api/v1/admin/users/')
        return data
    }catch(error){
        return rejectWithValue(error.response?.data || "Failed to fetch users.")
    }
})

// get single user 
export const getSingleUser = createAsyncThunk('/admin/getSingleUser',async(id,{rejectWithValue})=>{
    try{
        
        const {data} = await axios.get(`/api/v1/admin/user/${id}`,{role})
        return data
    }catch(error){
        return rejectWithValue(error.response?.data || "Failed to fetch single user.")
    }
})

// update user role

export const updateUserRole = createAsyncThunk("/admin/updateUserRole",async ({ userId, role }, { rejectWithValue }) => {
        try {
            const { data } = await axios.put(
                `/api/v1/admin/user/${userId}`,{ role }
            );

            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update user role.");
        }
    }
);

// delete user 

export const deleteUser = createAsyncThunk("/admin/deleteUser",async ({ userId }, { rejectWithValue }) => {
        try {
            const { data } = await axios.delete(
                `/api/v1/admin/user/${userId}`
            );

            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to delete user.")
        }
    }
);

// fetch all orders

export const fetchAllOrders = createAsyncThunk("/admin/fetchAllOrders",async (_ , { rejectWithValue }) => {
        try {
            const { data } = await axios.get(
                "/api/v1/admin/orders/"
            );

            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch orders.")
        }
    }
);

// delete order

export const deleteOrder = createAsyncThunk("/admin/deleteOrder",async (orderId , { rejectWithValue }) => {
        try {
            const { data } = await axios.delete(
                (`/api/v1/admin/order/${orderId}`)
            );

            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to delete orders.")
        }
    }
);


// update order status

export const updateOrderStatus = createAsyncThunk("/admin/updateOrderStatus",async ({orderId,status} , { rejectWithValue }) => {
        try {
            const { data } = await axios.put(
                `/api/v1/admin/order/${orderId}`,{status}
            );
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to Update Order Status.")
        }
    }
);

// fetch product reviews

export const fetchProductReviews = createAsyncThunk("/admin/fetchProductReviews",async ({productId, } , { rejectWithValue }) => {
        try {
            const { data } = await axios.get(
                `/api/v1/admin/product/reviews?id=${productId}`
            );
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to Fetch Product Reviews")
        }
    }
);

// delete review

export const deleteReview = createAsyncThunk("/admin/deleteReview",async ({productId, reviewId} , { rejectWithValue }) => {
        try {
            const { data } = await axios.delete(
                `/api/v1/admin/product/reviews?productId=${productId}&id=${reviewId}`
            );
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to Delete Product Reviews")
        }
    }
);
// fetch all coupons (vouchers)
export const fetchAdminCoupons = createAsyncThunk('/admin/fetchAdminCoupons', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/api/v1/admin/coupons')
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to fetch vouchers.')
    }
})

// create coupon (voucher)
export const createAdminCoupon = createAsyncThunk('/admin/createAdminCoupon', async (couponData, { rejectWithValue }) => {
    try {
        const { data } = await axios.post('/api/v1/admin/coupon/new', couponData)
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to create voucher.')
    }
})

// delete coupon (voucher)
export const deleteAdminCoupon = createAsyncThunk('/admin/deleteAdminCoupon', async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.delete(`/api/v1/admin/coupon/${id}`)
        return { id, data }
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to delete voucher.')
    }
})

const adminSlice = createSlice({
    name: 'admin',
    initialState:{
        loading: false,
        error: null,
        success:false,
        products: [],
        product:{},
        deleting:{},
        users:[],
        user: {},
        message: null,
        orders: [],
        totalAmount:0,
        order:{},
        reviews:[],
        coupons: []

    },
    reducers:{
        removeSuccess:(state)=>
        {
            state.success = false
        },
        removeErrors:(state)=>
        {
            state.error = null
        },
        clearMessage:(state) =>{
            state.message = null
        }
    },
    extraReducers:(builder)=>{
        // fetch all products
        builder
        .addCase(fetchAdminProducts.pending,(state)=>{
            state.loading = true
            state.error = null
        })
        .addCase(fetchAdminProducts.fulfilled,(state,action)=>{
            state.loading = false,
            state.products = action.payload.products
        })
        .addCase(fetchAdminProducts.rejected,(state,action)=>{
            state.loading = false
            state.error = action.payload?.message || 'Error while fetching the products.'
        })

        // create product
        builder
        .addCase(createAdminProducts.pending,(state)=>{
            state.loading = true
            state.error = null
        })
        .addCase(createAdminProducts.fulfilled,(state,action)=>{
            state.loading = false,
            state.products.push(action.payload.product)
            state.success = action.payload.success
           
        })
        .addCase(createAdminProducts.rejected,(state,action)=>{
            state.loading = false
            state.error = action.payload?.message || 'Product creation failed.'
        })

        // update product
        builder
        .addCase(updateAdminProduct.pending,(state)=>{
            state.loading = true
            state.error = null
        })
        .addCase(updateAdminProduct.fulfilled,(state,action)=>{
            state.loading = false,
            state.product = action.payload.product
            state.success = action.payload.success

        })
        .addCase(updateAdminProduct.rejected,(state,action)=>{
            state.loading = false
            state.error = action.payload?.message || 'Product update failed.'
        })

        // delete product
        builder
        .addCase(deleteProduct.pending,(state,action)=>{
            const productId = action.meta.arg
           state.deleting[productId] = true
        })
        .addCase(deleteProduct.fulfilled,(state,action)=>{
            const productId=action.payload.productId
            state.deleting[productId] = false
            state.products=state.products.filter(product=>product._id!==productId)            
        })
        .addCase(deleteProduct.rejected,(state,action)=>{
            const productId=action.meta.arg
           state.deleting[productId] = false
            state.error = action.payload?.message || 'Product deletion failed.'
        })

        // fetch all users
        builder
        .addCase(fetchUsers.pending,(state,action)=>{
            state.loading = true;
            state.error = null;

        })
        .addCase(fetchUsers.fulfilled,(state,action)=>{
            state.loading = false;
            state.users = action.payload.users         
        })
        .addCase(fetchUsers.rejected,(state,action)=>{
            const productId=action.meta.arg
           state.deleting[productId] = false
            state.error = action.payload?.message || 'Failed to fetch users.'
        })

        // fetch single user
        builder
        .addCase(getSingleUser.pending,(state)=>{
            state.loading = true
            state.error = null
        })
        .addCase(getSingleUser.fulfilled,(state,action)=>{
            state.loading = false,
            state.user = action.payload.user

        })
        .addCase(getSingleUser.rejected,(state,action)=>{
            state.loading = false
            state.error = action.payload?.message || 'Failed to fetch single user.'
        })

        // update user role
        builder
        .addCase(updateUserRole.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateUserRole.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
        })
        .addCase(updateUserRole.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Failed to update user role.";
        });
        // delete user
        builder
        .addCase(deleteUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(deleteUser.fulfilled, (state, action) => {
            state.loading = false;
            state.message= action.payload.message
        })
        .addCase(deleteUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Failed to delete user.";
        });
        // fetch all orders
        builder
        .addCase(fetchAllOrders.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchAllOrders.fulfilled, (state, action) => {
            state.loading = false;
            state.orders= action.payload.orders
            state.totalAmount= action.payload.totalAmount

        })
        .addCase(fetchAllOrders.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Failed to fetch orders.";
        });
        // delete order
        builder
        .addCase(deleteOrder.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(deleteOrder.fulfilled, (state, action) => {
            state.loading = false;
            state.success = action.payload.success
            state.message = action.payload.message
        })
        .addCase(deleteOrder.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Failed to delete orders.";
        });

        // update order status
        builder
        .addCase(updateOrderStatus.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateOrderStatus.fulfilled, (state, action) => {
            state.loading = false;
            state.success = action.payload.success
            state.order = action.payload.order
        })
        .addCase(updateOrderStatus.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Failed to Update Order Status.";
        });

         // fetch product reviews
        builder
        .addCase(fetchProductReviews.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchProductReviews.fulfilled, (state, action) => {
            state.loading = false;
            state.reviews = action.payload.reviews
        })
        .addCase(fetchProductReviews.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Failed to Fetch Product Reviews.";
        });
        // delete product reviews
         builder
        .addCase(deleteReview.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(deleteReview.fulfilled, (state, action) => {
            state.loading = false;
            state.message = action.payload.message
            state.success = action.payload.success
        })
        .addCase(deleteReview.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Failed to Delete Product Reviews.";
        });

        // fetch all coupons (vouchers)
        builder
        .addCase(fetchAdminCoupons.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchAdminCoupons.fulfilled, (state, action) => {
            state.loading = false;
            state.coupons = action.payload.coupons;
        })
        .addCase(fetchAdminCoupons.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Failed to fetch vouchers.";
        });

        // create coupon (voucher)
        builder
        .addCase(createAdminCoupon.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(createAdminCoupon.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.message = `Voucher "${action.payload.coupon.code}" created successfully!`;
            state.coupons.unshift(action.payload.coupon);
        })
        .addCase(createAdminCoupon.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Failed to create voucher.";
        });

        // delete coupon (voucher)
        builder
        .addCase(deleteAdminCoupon.pending, (state, action) => {
            const id = action.meta.arg;
            state.deleting[id] = true;
        })
        .addCase(deleteAdminCoupon.fulfilled, (state, action) => {
            const id = action.payload.id;
            state.deleting[id] = false;
            state.message = action.payload.data.message;
            state.coupons = state.coupons.filter(c => c._id !== id);
        })
        .addCase(deleteAdminCoupon.rejected, (state, action) => {
            const id = action.meta.arg;
            state.deleting[id] = false;
            state.error = action.payload?.message || "Failed to delete voucher.";
        });
    }
})

export const {removeErrors, removeSuccess, clearMessage}= adminSlice.actions
export default adminSlice.reducer