const express = require("express");
require("dotenv").config();
const createProductRoutes=require("./routes/createProduct");

const connectDB = require("./config/database");

const createUser = require("./routes/createUser");
const dashboard = require("./routes/dashboard");
const deleteUsers = require("./routes/deleteUsers");
const getProfile = require("./routes/getProfile");
const getUser = require("./routes/getUser");
const loginRoutes = require("./routes/login");
const Setting = require("./routes/setting");
const getUsers=require("./routes/getUsers");
const updateProduct=require("./routes/updateProducts");
const getProducts=require("./routes/getProducts");
const deleteProduct=require("./routes/deleteProduct");
const FashionRoutes=require("./routes/Categories");
const productDetails=require("./routes/productDetails");
const registerRoutes=require("./routes/register");
const clientDashboardRoutes=require("./routes/clientDashboard");
const FashionAnimation=require("./routes/FashionAnimation");
const CategoryTrendings=require("./routes/CategoryTrending");
const createTrending=require("./routes/CreateTrendings");
const loadProducts=require("./routes/loadProducts");
const buyerProfile=require("./routes/buyerProfile");
const DisplayTrendings=require("./routes/DisplayTrendings");
const CartRoutes=require("./routes/Cart");
const createOrder = require("./routes/createOrder");
const myOrders = require("./routes/myOrders");
const orderRoutes=require("./routes/orderRoutes");
const updateTrending = require("./routes/updateTrending");
const deleteTrending = require("./routes/deleteTrending");



const auth = require("./Authentication/auth");
const corsMiddleware = require("./config/cors");

// Creating App Server
const app = express();
app.use(corsMiddleware);
// Connecting Database
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Login - public route
app.use("/api",registerRoutes);
app.use("/api", loginRoutes);
app.use("/api",FashionAnimation);
app.use("/api",CategoryTrendings);
app.use("/api",FashionRoutes);
app.use("/api",getProducts);
app.use("/api",productDetails);
app.use("/api",loadProducts);
app.use("/api",DisplayTrendings);

// Protected routes
app.use("/api", auth, createUser);
app.use("/api", auth, dashboard);
app.use("/api", auth, deleteUsers);
app.use("/api", auth, getProfile);
app.use("/api", auth, getUser);
app.use("/api", auth, Setting);
app.use("/api",auth,createProductRoutes);
app.use("/api",auth,getUsers);
app.use("/api",auth,updateProduct);
app.use("/api",auth,deleteProduct);
app.use("/api",auth,clientDashboardRoutes);
app.use("/api",auth,createTrending);
app.use("/api",auth,buyerProfile);
app.use("/api", auth, CartRoutes);
app.use("/api", auth, createOrder);
app.use("/api", auth, myOrders);
app.use("/api",auth,orderRoutes);
app.use("/api", auth, updateTrending);
app.use("/api", auth, deleteTrending);

const Port = process.env.PORT || 8000;

app.listen(Port, () => {
    console.log(`Server is running on Port ${Port}`);
});