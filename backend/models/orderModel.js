import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  shippingInfo: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pinCode: { type: Number, required: true },
    phoneNumber: { type: Number, required: true },
  },
  orderStatus: {
    type: String,
    required: true,
    default: "Processing",
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  paymentInfo: {
    id: { type: String, default: "" },
    status: { type: String, default: "Not Paid" },
  },
  
  paidAt: 
  { 
    type: Date 
    },
  itemPrice: { 
    type: Number, 
    required: true, 
    default: 0 
},
  taxPrice: { 
    type: Number, 
    required: true, default: 0 
},
  shippingPrice: { 
    type: Number, 
    required: true, 
    default: 0 
},
  totalPrice: { 
    type: Number, 
    required: true, 
    default: 0 
},
  deliveredAt: Date,
  createdAt: { 
    type: Date, 
    default: Date.now 
},
});

export default mongoose.model("Order", orderSchema)