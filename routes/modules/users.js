const router = require('express').Router()
const userController = require('../../controllers/userController')
const orderController = require('../../controllers/orderController')

router.get('/sign-in', userController.signInPage)
router.get('/701', userController.sign_701)
router.get('/711', userController.sign_711)
router.post('/sign-in', userController.signIn)
router.get('/sign-out', userController.signOut)
router.get('/sign-up', userController.signUpPage)
router.post('/sign-up', userController.signUp)
router.post('/sign-up/captcha', userController.sendCaptcha)

router.post('/:id/linepay', orderController.linepay_test)
router.get('/linepay/result',orderController.linepay_result)
router.get('/sn/:id', orderController.into_db_payment)

router.post('/:id/ecpay', orderController.ecpay_all)
//router.get('/ecpay/callback', orderController.ecpay_call_back)
router.post('/ecpay_return_url', orderController.ecpay_return_url)
router.post('/ecpay_callback', orderController.ecpay_call_back)
router.get('/ecpay_into_db_payment/:id', orderController.ecpay_into_db_payment)

module.exports = router
