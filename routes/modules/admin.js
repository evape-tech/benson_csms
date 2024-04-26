const router = require('express').Router()
const adminController = require('../../controllers/adminController')

const auth = require('../../middleware/auth')
const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/upload')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '_' + Date.now() + '_' + file.originalname)
  }
})

const upload = multer({ storage }).single('image')

router.get('/start_charging/:id', auth.authenticatedAdmin, adminController.start_charging)
router.get('/stop_charging/:id', auth.authenticatedAdmin, adminController.stop_charging)

router.get('/add_cp', auth.authenticatedAdmin, adminController.add_cp)
router.get('/cp_list', auth.authenticatedAdmin, adminController.cp_list)
router.get('/ocpp_log_list', auth.authenticatedAdmin, adminController.ocpp_log_list)
router.post('/add_cp', auth.authenticatedAdmin, adminController.post_add_cp)
router.delete('/post_del_cp/:id', auth.authenticatedAdmin, adminController.post_del_cp)
router.post('/post_edit_cp/:id', auth.authenticatedAdmin, upload, adminController.post_edit_cp)
router.get('/show_current_cp/:id', auth.authenticatedAdmin, upload, adminController.show_current_cp)



router.get('/sign-in', adminController.signInPage)
router.post('/sign-in', adminController.signIn)
router.get('/sign-out', adminController.signOut)

router.get('/products', auth.authenticatedAdmin, adminController.getProducts)
router.post('/products', auth.authenticatedAdmin, upload, adminController.postProducts)
router.get('/products/:id', auth.authenticatedAdmin, adminController.getProduct)
router.put('/products/:id', auth.authenticatedAdmin, upload, adminController.editProduct)
router.delete('/products/:id', auth.authenticatedAdmin, adminController.deleteProduct)

router.get('/orders', auth.authenticatedAdmin, adminController.getOrders)
router.get('/orders/:id', auth.authenticatedAdmin, adminController.getOrder)
router.post('/orders/:id/ship', auth.authenticatedAdmin, adminController.shipOrder)
router.post('/orders/:id/ship_user_received', auth.authenticatedAdmin, adminController.shipOrder_user_received)
router.post('/orders/:id/cancel', auth.authenticatedAdmin, adminController.cancelOrder)
router.post('/orders/:id/recover', auth.authenticatedAdmin, adminController.recoverOrder)

router.get('/authority', auth.authenticatedAdmin, adminController.getUsers)
router.post('/authority/:id', auth.authenticatedAdmin, adminController.changeAuth)

module.exports = router
