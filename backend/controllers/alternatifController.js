const Alternatif = require("../models/alternatif");

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
    await Alternatif.create({
      nama: nama,
      deskripsi: deskripsi,
    });

    res.sendStatus(201);
  } catch (e) {
    res.status(500).json({ message: "Error menambahkan alternatif ", e });
  }
};

const deleteAlternatif=async (req,res)=>{
    const {id_alternatif}=req.body
    
    try{
        await Alternatif.findByIdAndDelete(id_alternatif)

        res.sendStatus(200)
    }catch(e){
        res.status(500).json({message:"Gagal menghapus data"})
    }
}

module.exports = { getAllAlternatif, addAlternatif , updateAlternatif,deleteAlternatif,getTotalAlternatif};
