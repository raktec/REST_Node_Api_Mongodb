const express = require('express');
const router = express.Router();
const OrdersController = require('../controllers/orders');

const checkAuth = require('../middleware/chek-auth');

//Handle incomming Get requests to /orders
router.get('/',  checkAuth, OrdersController.orders_get_all);

router.post('/', checkAuth, OrdersController.orders_create_order);

router.get('/:orderId', checkAuth, OrdersController.orders_get_order);

router.delete('/:orderId', checkAuth, OrdersController.order_delete_order);

module.exports = router;