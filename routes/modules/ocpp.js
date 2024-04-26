const router = require('express').Router()
const ocppController = require('../../controllers/ocppController')

router.get('/', ocppController.ocpp_test)
router.get('/see_connections', ocppController.ocpp_see_connections)
//router.get('/:id', ocppController.ocpp_cpid)
router.get('/api/test', ocppController.ocpp_send_test)
router.get('/api/ocpp_stop_charging/:cpid', ocppController.ocpp_stop_charging)

router.post('/api/ocpp_send_cmd', ocppController.ocpp_send_cmd)
router.post('/spacepark_cp_api', ocppController.spacepark_cp_api)


router.ws('/:id', ocppController.ocpp_ws)

module.exports = router
