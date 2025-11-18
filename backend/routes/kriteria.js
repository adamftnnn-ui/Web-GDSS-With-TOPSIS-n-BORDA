const express=require('express')
const { addKriteria, getAllKriteria, getKriteriaById, getKriteriaByTipe, updateKriteria, deleteKriteria, getTotalKriteria } = require('../controllers/kriteriaController')
const router=express.Router()

router.route('/').post(addKriteria).get(getAllKriteria).put(updateKriteria).delete(deleteKriteria)
// router.get('/id/:id_user',getKriteriaById)
router.route('/tipe/:tipe').get(getKriteriaByTipe)
router.get('/total',getTotalKriteria)

module.exports=router