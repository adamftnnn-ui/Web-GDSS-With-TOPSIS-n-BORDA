const express=require('express')
const {  getAllUser, getUserById, updateUser, ubahPassword, createUser, deleteUser, getTotalUser, getInisialUser } = require('../controllers/userController')
const router=express.Router()

router.route('/').get(getAllUser).put(updateUser).post(createUser).delete(deleteUser)
router.post('/password',ubahPassword)
router.route('/find').get(getUserById)
router.route('/find/peran/:id_user').get(getInisialUser)
router.get('/total',getTotalUser)

// router.get('/', getAllUser);
// router.get('/find', getUserById); 
// router.post('/', createUser);
// router.put('/', updateUser);
// router.delete('/', deleteUser);
// router.post('/password', ubahPassword);

module.exports=router