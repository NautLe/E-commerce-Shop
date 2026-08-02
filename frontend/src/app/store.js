import {configureStore} from '@reduxjs/toolkit'
import productReducer from  '../features/products/productSlice'
import userReducer from  '../features/users/userSlice'
import cartReducer from  '../features/cart/cartSlice'
import orderReducer from  '../features/order/orderSlice'
import adminReducer from  '../features/admin/adminSlice'
import couponReducer from '../features/coupon/couponSlice'
import wishlistReducer from '../features/wishlist/wishlistSlice'
import addressReducer from '../features/address/addressSlice'
import notificationReducer from '../features/notification/notificationSlice'
import contactReducer from '../features/contact/contactSlice'

export const store = configureStore({
    reducer:{
        product: productReducer,
        user: userReducer,
        cart: cartReducer,
        order: orderReducer,
        admin: adminReducer,
        coupon: couponReducer,
        wishlist: wishlistReducer,
        address: addressReducer,
        notification: notificationReducer,
        contact: contactReducer
    }
})