const mongoose = require("mongoose");

const topsisSchema = new mongoose.Schema({
  id_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
  matriks_keputusan_ternormalisasi: {
    type: [[Number]],
    required: true,
  },
  matriks_keputusan_ternormalisasi_terbobot: {
    type: [[Number]],
    required: true,
  },
  d_positif: {
    type: [Number],
    required: true,
  },
  d_negatif: {
    type: [Number],
    required: true,
  },
  skor_akhir: {
    type: [Number],
    required: true,
  },
  peringkat: {
    type: Map,
    required: true,
  },
  alternatif_terbaik: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Topsis", topsisSchema);
