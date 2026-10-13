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
const createContentRoutes=require("./routes/CreateContent");
const manageContentsRoutes=require("./routes/ManageContents");


const auth = require("./Authentication/auth");
const corsMiddleware = require("./config/cors");

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(corsMiddleware);

// Login - public route
app.use("/api", loginRoutes);

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
app.use("/api",auth,getProducts);
app.use("/api",auth,deleteProduct);
app.use("/api",auth,productDetails);
app.use("/api",auth,createContentRoutes);
app.use("/api",auth,manageContentsRoutes);
app.use("/api",FashionRoutes);

const Port = process.env.PORT || 8000;

app.listen(Port, () => {
    console.log(`Server is running on Port ${Port}`);
});