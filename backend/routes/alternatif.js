const express=require('express')
const router=express.Router()
const { getAllAlternatif, addAlternatif, updateAlternatif, deleteAlternatif, getTotalAlternatif } = require('../controllers/alternatifController')

router.route('/').post(addAlternatif).get(getAllAlternatif).put(updateAlternatif).delete(deleteAlternatif)
router.get('/total',getTotalAlternatif)

module.exports=router