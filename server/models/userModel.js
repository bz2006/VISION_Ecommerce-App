import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true

    },
    ordersNo: {
        type: Number,
        default: 0,
    },
    addresses: [{
        name: {
            type: String,
        },
        address: {
            type: String,
        },
        city: {
            type: String
        },
        state: {
            type: String
        },
        country: {
            type: String
        },
        pin: {
            type: Number
        },
        phone: {
            type: Number
        }
    
    }],
    defaddress:{
        type:String,
        default: "",
    },
    role: {
        type: Number,
        default: 0,
    },
    date:{
        type:String,
    },

},
    { timestamps: true }
);

export default mongoose.model("users", userSchema)