const express=require('express')
const { addPenilaian, perhitunganTopsis, getAllPenilaian, deletePenilaian, perhitunganBorda, getPenilaianByIdUserAndAlternatif } = require('../controllers/penilaianController')
const router=express.Router()

router.route('/').post(addPenilaian).get(getAllPenilaian).delete(deletePenilaian)
router.route('/individu').get(getPenilaianByIdUserAndAlternatif)
router.get('/topsis/:id_user',perhitunganTopsis)
router.get('/borda',perhitunganBorda)

module.exports=router