
const express = require("express");

const Cart = require("../models/Cart");
const Order = require("../models/Order");

const router = express.Router();

router.post("/createOrder", async (req, res) => {
    try {
        const buyerId = req.userId;

        // 1. Check authentication
        if (!buyerId) {
            return res.status(401).json({
                success: false,
                message: "Please login to place an order."
            });
        }

        // 2. Get delivery and payment information
        const {
            fullName,
            phone,
            address,
            city,
            paymentMethod
        } = req.body;

        // 3. Validate required fields
        if (
            !fullName?.trim() ||
            !phone?.trim() ||
            !address?.trim() ||
            !city?.trim() ||
            !paymentMethod
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required information."
            });
        }

        // 4. Validate payment method
        const allowedMethods = [
            "Cash on Delivery",
            "MTN MoMo"
        ];

        if (!allowedMethods.includes(paymentMethod)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment method."
            });
        }

        // 5. Validate Rwanda phone number
        const phonePattern = /^(?:\+2507\d{8}|07\d{8})$/;

        if (!phonePattern.test(phone.trim())) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid Rwanda phone number."
            });
        }

        // 6. Retrieve buyer's cart
        const cart = await Cart.findOne({
            buyer: buyerId
        }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Your cart is empty."
            });
        }

        // 7. Prepare order items using database prices
        const orderItems = [];
        let totalAmount = 0;

        for (const item of cart.items) {
            const product = item.product;

            if (!product) {
                return res.status(400).json({
                    success: false,
                    message: "One of the products in your cart no longer exists."
                });
            }

            const price = Number(product.price);

            if (
                !Number.isFinite(price) ||
                price <= 0 ||
                !Number.isInteger(item.quantity) ||
                item.quantity < 1
            ) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid price or quantity for ${product.name || "a product"}.`
                });
            }

            const subtotal = price * item.quantity;

            orderItems.push({
                product: product._id,
                productName: product.name || product.title || "Product",
                price,
                quantity: item.quantity,
                subtotal
            });

            totalAmount += subtotal;
        }

        // 8. Create order
        const order = await Order.create({
            buyer: buyerId,

            items: orderItems,

            shippingAddress: {
                fullName: fullName.trim(),
                phone: phone.trim(),
                address: address.trim(),
                city: city.trim()
            },

            paymentMethod,

            paymentStatus: "Pending",

            orderStatus: "Pending",

            totalAmount
        });

        // 9. Clear cart only after order is saved
        cart.items = [];
        await cart.save();

        // 10. Return success response
        return res.status(201).json({
            success: true,
            message: "Your order has been placed successfully.",
            order
        });

    } catch (error) {
        console.error("Create Order Error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to place your order."
        });
    }
});

module.exports = router;
