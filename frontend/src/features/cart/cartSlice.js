import {createSlice} from '@reduxjs/toolkit'
import axios from 'axios'
const cartSlice = createSlice({
    name: 'cart',
    initialState:{
        cartItems:[],
        loading:false,
        error: null,
        success:false,
        message:null
    },
    reducers:{
        removeError:(state)=>{
            state.error=null
        },
        removeSuccess:(state)=>{
            state.message=null
        }
    }
})

export const { removeError,  removeMessage}= cartSlice.actions
export default reducer