const express=require('express')
const { addPenilaian, perhitunganTopsis, getAllPenilaian, deletePenilaian, perhitunganBorda } = require('../controllers/penilaianController')
const router=express.Router()

router.route('/').post(addPenilaian).get(getAllPenilaian).delete(deletePenilaian)
router.get('/topsis/:id_user',perhitunganTopsis)
router.get('/borda',perhitunganBorda)

module.exports=router