const mongoose=require('mongoose')

const penilaianSchema=new mongoose.Schema({
    id_user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    tanggal_penilaian:{
        type:Date,
        required:true
    },
    id_alternatif:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Alternatif',
        required:true
    },
    nilai:[
        {
            key:String,
            value:mongoose.Schema.Types.Mixed
        }
    ],
    keterangan:{
        type:String
    }
},{timestamps:true})

module.exports=mongoose.model('Penilaian',penilaianSchema)