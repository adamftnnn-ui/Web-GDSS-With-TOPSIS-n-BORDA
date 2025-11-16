const mongoose=require('mongoose')

const kriteriaSchema=new mongoose.Schema({
    
    id_user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    nama:{
        type: String,
        required: true
    },
    tipe:{
        type: String,
        required: true
    },
    bobot:{
        type: Number,
        required: true
    },
    nilai:[
        {
            key:String,
            value: mongoose.Schema.Types.Mixed
        }
    ]
},{timestamps:true})

module.exports=mongoose.model('Kriteria',kriteriaSchema)