
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },

            productName: {
                type: String,
                required: true
            },

            price: {
                type: Number,
                required: true,
                min: 0
            },

            quantity: {
                type: Number,
                required: true,
                min: 1
            },

            subtotal: {
                type: Number,
                required: true,
                min: 0
            }
        }
    ],

    shippingAddress: {
        fullName: {
            type: String,
            required: true,
            trim: true
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        address: {
            type: String,
            required: true,
            trim: true
        },

        city: {
            type: String,
            required: true,
            trim: true
        }
    },

    paymentMethod: {
        type: String,
        enum: ["Cash on Delivery", "MTN MoMo"],
        required: true
    },

    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Failed"],
        default: "Pending"
    },

    orderStatus: {
        type: String,
        enum: [
            "Pending",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled"
        ],
        default: "Pending"
    },

    totalAmount: {
        type: Number,
        required: true,
        min: 0
    }

}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
