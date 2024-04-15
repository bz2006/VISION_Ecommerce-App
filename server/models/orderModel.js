import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userid: {
    type: String
  },
  orderid: {
    type: String
  },
  products: [
    [String,String,String,Number, Number]
  ],
  orderdate: {
    type: String
  }, 
  shipaddress: {
    name: String,
    address: String,
    city: String,
    state: String,
    country: String,
    pin: Number,
    phone: Number
  },
  billaddress: {
    name: String,
    address: String,
    city: String,
    state: String,
    country: String,
    pin: Number,
    phone: Number
  },
  total: {
    type: Number
  },
  status: {
    type: String,
    default:"Proccesing"
  },
});

export default mongoose.model("Order", orderSchema);