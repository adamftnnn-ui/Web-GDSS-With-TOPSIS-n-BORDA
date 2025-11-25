const mongoose=require('mongoose')

const penilaianSchema=new mongoose.Schema({
    id_user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    tanggal_penilaian:{
        type:Date
    },
    id_alternatif:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Alternatif',
        required:true
    },
    nilai:[
        {
            id_kriteria:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Kriteria',
                required:true
            },
            value:mongoose.Schema.Types.Mixed
        }
    ],
    keterangan:{
        type:String
    }
},{timestamps:true})

module.exports=mongoose.model('Penilaian',penilaianSchema)