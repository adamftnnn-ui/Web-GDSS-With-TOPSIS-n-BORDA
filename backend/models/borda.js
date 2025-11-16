const mongoose=require('mongoose')

const skorBordaSchema=new mongoose.Schema({
    skor_akhir:{type:Number,required:true},
    ranking:{type:Number,required:true}
})

const bordaSchema=new mongoose.Schema({
    ranking_alternatif_per_decision_maker:[
        {
            type:Map,
            required:true,
            of:{
                type:Number,
                required:true
            }
        }
    ],
    perhitungan_skor_borda:[
        {
            type:Map,
            of:skorBordaSchema
        }
    ]
})

module.exports=mongoose.model('Borda',bordaSchema)