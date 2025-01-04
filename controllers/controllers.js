const Register = require('../models/RegisterModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Product = require("../models/ProductModel");
const Orders = require('../models/OrdersModel');

// Create a new user
const createUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await Register.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new Register({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        console.log("Error:", error.message);
        res.status(500).json({ error: error.message });
    }
};

// User login
const userLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userDetails = await Register.findOne({ email });
        if (!userDetails) {
            return res.status(404).json({ message: "Invalid email" });
        }

        const isPasswordValid = await bcrypt.compare(password, userDetails.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const jwtToken = jwt.sign({ userId: userDetails._id.toString(), email }, process.env.JWT_SECRET || "JWT_SECRET");

        return res.status(200).json({ message: "Login successful", jwtToken });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: "Internal server error: " + error.message });
    }
};

// Authentication middleware
const authentication = async (req, res, next) => {
    let jwtToken;
    const authHeader = req.headers["authorization"];
    if (authHeader !== undefined) {
        jwtToken = authHeader.split(' ')[1];
    }

    if (jwtToken === undefined) {
        return res.status(401).json({ message: "Invalid Jwt Token" });
    }

    try {
        const payload = jwt.verify(jwtToken, process.env.JWT_SECRET || "JWT_SECRET");
        req.userId = payload.userId;
        next();
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: error.message });
    }
};

// Get all products for the authenticated user
const getallProducts = async (req, res) => {
    const userId = req.userId;
    try {
        const products = await Product.find({ userId });
        if (products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }
        res.status(200).json({ products });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

// Add a new product
const addProduct = async (req, res) => {
    const userId = req.userId;
    console.log(userId);
    const data = { userId, ...req.body }
    try {
        const newProduct = new Product(data);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

// Get all orders for the authenticated user
const getAllOrders = async (req, res) => {
    const userId = req.userId;
    try {
        const ordersList = await Orders.find({userId});
        if (ordersList.length === 0) {
            return res.status(404).json({ message: "No orders found" });
        }
        res.status(200).json({ ordersList });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};



const getProductDetails = async(req,res)=>{
    const {id} = req.params;
    //console.log(id)

    try{
        const product = await Product.find({_id:id});
        //console.log(product)
        res.status(200).json(product)
    }catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

const orders = async(req,res)=>{
    const userId = req.userId;
    console.log(req.body)
    try{
        const order = new Orders({userId,...req.body});
        await order.save();
        res.json(order)
    }catch(error){
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

const getOrders = async(req,res)=>{
    const userId = req.userId;
    
    try{
        const orders =  Orders.findById({userId});
        res.json(orders)
    }catch(error){
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

const getOrderById = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;

    try {
        const order = await Orders.findOne({ _id: id, userId: userId })
            .populate({
                path: 'cartItems.productId',
                //select: 'name price description imageUrl'
            });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        return res.status(200).json({ order });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

const updatePassword = async (req, res) => {
    const { email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const updatedUser = await Register.findOneAndUpdate(
            { email },
            { $set: { password: hashedPassword } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

const searchResult = async (req, res) => {
    const userId = req.userId;
    const { input } = req.params;

    try {
        const products = await Product.find(
            { 
                userId, 
                name: { $regex: input, $options: "i" }
            }
        );
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};


module.exports = {
    createUser,
    userLogin,
    authentication,
    getallProducts,
    addProduct,
    getAllOrders,
    getProductDetails,
    orders,
    getOrders,
    getOrderById,
    updatePassword,
    searchResult
};
