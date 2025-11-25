const Alternatif = require("../models/alternatif");
const Kriteria = require("../models/kriteria");
const User=require("../models/users")
const Penilaian=require('../models/penilaian')

const getAllAlternatif = async (req, res) => {
  try {
    const response = await Alternatif.find();

    res.status(200).json(response);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error mengambil data alternatif dari database ", e });
  }
};

const getTotalAlternatif=async (req,res)=>{
    try{
        const total=await Alternatif.countDocuments()

        res.status(200).json(total)
    }catch(e){
        res.status(500).json({message:"Error menampilkan total alternatif: ",e})
    }
}

const updateAlternatif = async (req, res) => {
  const { id_alternatif, nama, deskripsi } = req.body

  try {
    const existingAlternatif = await Alternatif.findById(id_alternatif);

    existingAlternatif.nama=nama
    existingAlternatif.deskripsi=deskripsi

    await existingAlternatif.save()

    res.sendStatus(200)
  } catch (e) {
    res.status(500).json({message:"Error mengubah data alternatif: ",e})
  }
};

const addAlternatif = async (req, res) => {
  const { nama, deskripsi } = req.body;

  try {
    const newAlternatif=await Alternatif.create({
      nama: nama,
      deskripsi: deskripsi,
    });

    const existingKriteria=await Kriteria.find({},{_id:1}).sort({tipe:-1})

    const nilai = existingKriteria.map(k => ({
      id_kriteria: k._id,
      value: 0
    }));

    const idDMDocs = await User.find(
      { peran: { $ne: "Admin" } },
      { _id: 1 }
    );
    
    const idDM = idDMDocs.map(u => u._id);

    const penilaianData=idDM.map(idUser=>({
      id_alternatif:newAlternatif._id,
      id_user:idUser,
      nilai:nilai
    }))

    await Penilaian.insertMany(penilaianData)

    res.sendStatus(201);
  } catch (e) {
    res.status(500).json({ message: `Error menambahkan alternatif ${e.message}` });
  }
};

const deleteAlternatif=async (req,res)=>{
    const {id_alternatif}=req.body
    
    try{
        await Penilaian.deleteMany({id_alternatif:id_alternatif})

        // const allExistingPenilaian=await Penilaian.find({id_alternatif:id_alternatif})

        // for(const item of allExistingPenilaian){
        //   await item.deleteOne()
        // }

        await Alternatif.findByIdAndDelete(id_alternatif)

        res.sendStatus(200)
    }catch(e){
        res.status(500).json({message:"Gagal menghapus data"})
    }
}

module.exports = { getAllAlternatif, addAlternatif , updateAlternatif,deleteAlternatif,getTotalAlternatif};
