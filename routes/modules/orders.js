const router = require('express').Router()
const orderController = require('../../controllers/orderController')



router.get('/', orderController.getOrders)
router.get('/data', orderController.fillOrderData)
router.post('/data', orderController.postOrder)
router.get('/:id', orderController.getOrder)
router.post('/:id/cancel', orderController.cancelOrder)
router.post('/newebpay/callback', orderController.newebpayCallback)

router.post('/:id/linepay', orderController.linepay_test)
router.get('/linepay/result',orderController.linepay_result)
router.get('/sn/:id', orderController.into_db_payment)

router.post('/:id/ecpay', orderController.ecpay_all)
//router.get('/ecpay/callback', orderController.ecpay_call_back)
router.post('/ecpay_return_url', orderController.ecpay_return_url)
router.post('/ecpay_callback', orderController.ecpay_call_back)
router.get('/ecpay_into_db_payment/:id', orderController.ecpay_into_db_payment)

module.exports = router
