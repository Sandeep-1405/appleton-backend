const router = require('express').Router();

const {
    createUser,
    userLogin,
    authentication,
    getallProducts,
    addProduct,
    getAllOrders,
    getProductDetails,
    orders,
    getOrderById,
    updatePassword,
    searchResult
} = require('../controllers/controllers.js')


router.post('/register', createUser);

router.post('/login', userLogin);

router.post('/forgot-password', updatePassword);

router.get('/products', authentication, getallProducts);

router.post('/add-product', authentication, addProduct);

router.get('/orders', authentication, getAllOrders);

router.post('/orders', authentication, orders);

router.get('/products/:id', authentication, getProductDetails);

router.get('/orders/:id', authentication, getOrderById);

router.post('/search/:input', authentication, searchResult);

module.exports = router;