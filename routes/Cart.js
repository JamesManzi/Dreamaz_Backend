
const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const router = express.Router();

router.post("/addCart/:id", async (req, res) => {
    try {
        const { quantity } = req.body;
        const productId = req.params.id;

        // 1. Validate quantity
        if (!Number.isInteger(quantity) || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid Quantity"
            });
        }

        // 2. Find product
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product Not Found"
            });
        }

        // 3. Get buyer ID
        const buyerId = req.userId;

        if (!buyerId) {
            return res.status(401).json({
                success: false,
                message: "User Not Authenticated"
            });
        }

        // 4. Find buyer's cart
        let cart = await Cart.findOne({ buyer: buyerId });

        // 5. Create cart if it doesn't exist
        if (!cart) {
            cart = await Cart.create({
                buyer: buyerId,
                items: []
            });
        }

        // 6. Check if product already exists in cart
        const existingItem = cart.items.find(
            item => item.product.toString() === product._id.toString()
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                product: product._id,
                quantity: quantity
            });
        }

        // 7. Save cart
        await cart.save();

        return res.status(201).json({
            success: true,
            message: "Product Added to Cart Successfully",
            cart
        });

    } catch (error) {
        console.log("Adding To Cart Error:", error);

        return res.status(500).json({
            success: false,
            message: "Adding to Cart Error"
        });
    }
});


router.get("/getCart", async (req, res) => {
    try {
        const buyerId = req.userId;

        if (!buyerId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }

        const cart = await Cart.findOne({ buyer: buyerId })
            .populate("items.product");

        return res.status(200).json({
            success: true,
            cart: cart || { items: [] }
        });

    } catch (error) {
        console.error("Get Cart Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve cart"
        });
    }
});

router.get("/totalCarts", async (req, res) => {
    try {
        // Total cart documents in the collection
        const totalCarts = await Cart.countDocuments();

        // Optional: only count carts that have at least 1 item
        const nonEmptyCarts = await Cart.countDocuments({
            "items.0": { $exists: true }
        });

        return res.status(200).json({
            success: true,
            totalCarts,
            nonEmptyCarts
        });
    } catch (error) {
        console.error("Total Carts Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to get total carts"
        });
    }
});


router.get("/cartCount", async (req, res) => {
    try {
        const buyerId = req.userId;

        if (!buyerId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }

        const cart = await Cart.findOne({ buyer: buyerId });

        if (!cart || !cart.items.length) {
            return res.status(200).json({
                success: true,
                totalItems: 0,
                totalQuantity: 0
            });
        }

        const totalItems = cart.items.length;
        const totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);

        return res.status(200).json({
            success: true,
            totalItems,
            totalQuantity
        });
    } catch (error) {
        console.error("Cart Count Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to get cart count"
        });
    }
});


module.exports = router;
