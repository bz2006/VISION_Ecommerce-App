import mongoose from 'mongoose';

const { Schema } = mongoose;

const cartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
  },
  items:[{}]
  ,
  createdAt: {
    type: Date,
    default: Date.now
  }
});


const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
