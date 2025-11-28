const kriteria = require("../models/kriteria");
const Penilaian = require("../models/penilaian");
const Alternatif = require("../models/alternatif");
const Kriteria = require("../models/kriteria");
const Topsis = require("../models/topsis");
const topsisJS = require("../services/topsis");
const bordaJS = require("../services/borda");
const User = require("../models/users");
const Borda = require("../models/borda");
const { spawn } = require("child_process");

const getAllPenilaian = async (req, res) => {
  try {
    const result = await Penilaian.find({});

    res.status(200).json(result);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error mengambil semua data penilaian: ", e });
  }
};

const getPenilaianByIdUserAndAlternatif = async (req, res) => {
  const { id_user, id_alternatif } = req.query;

  try {
    const response = await Penilaian.findOne({
      id_user: id_user,
      id_alternatif: id_alternatif,
    }).populate("nilai.id_kriteria");

    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ message: `Error mengambil data penilaian${e}` });
  }
};

const addPenilaian = async (req, res) => {
  const {
    id_user,
    tanggal_penilaian,
    id_alternatif,
    id_kriteria,
    nilai,
    keterangan,
  } = req.body;

  const clearedComma = nilai.split(";").map((item) => item.trim());
  const nilaiPenilaian = clearedComma.map((item) => {
    const [id_kriteria, value] = item.split(" - ");
    return {
      id_kriteria: id_kriteria.trim(),
      value: value.trim(),
    };
  });

  const dateParts = tanggal_penilaian.split("/");
  const [bulan, hari, tahun] = dateParts;
  const formattedDate = `${tahun}-${bulan}-${hari}`;

  try {
    const existingPenilaian = await Penilaian.findOne({
      id_user: id_user,
      id_alternatif: id_alternatif,
    });

    existingPenilaian.tanggal_penilaian = formattedDate;
    existingPenilaian.keterangan = keterangan;
    existingPenilaian.nilai = nilaiPenilaian;

    await existingPenilaian.save();

    // await Penilaian.create({
    //   id_user: id_user,
    //   tanggal_penilaian: formattedDate,
    //   id_alternatif: id_alternatif,
    //   id_kriteria: id_kriteria,
    //   nilai: nilaiPenilaian,
    //   keterangan: keterangan,
    // });

    const existingTopsis=await Topsis.findOne({ id_user: id_user });

    if(existingTopsis){
      await existingTopsis.deleteOne()
    }

    await Borda.deleteMany()

    return res.sendStatus(201);
  } catch (e) {
    res.status(500).json({
      message: `Error dalam memasukkan data penilaian ke database: ${e.message}`,
    });
  }
};

const deletePenilaian = async (req, res) => {
  const { id_penilaian } = req.body;

  try {
    await Penilaian.findByIdAndDelete(id_penilaian);
    res.sendStatus(200);
  } catch (e) {
    res
      .status(500)
      .json({ message: `Error menghapus penilaian id ${id_penilaian}: ${e}` });
  }
};

const perhitunganTopsis = async (req, res) => {
  console.log("perhitunganTopsis function called"); // Log awal untuk memastikan fungsi dipanggil
  const { id_user } = req.params;

  const response = await Topsis.findOne({ id_user: id_user });

  if (response) {
    return res.status(200).json(response)
  }
  // Log data alternatif dan kriteria sebelum diproses
  const alternatifGet = await Alternatif.find({}, { nama: 1, _id: 0 });
  const kriteriaGet = await Kriteria.find(
    {},
    { nama: 1, tipe: 1, bobot: 1, _id: 0 }
  ).sort({ tipe: -1 });
  const penilaianGet = await Penilaian.find({ id_user: id_user });

  if (kriteriaGet.length == 0) {
    return res.status(500).json({ message: "Data kriteria kosong" });
  }

  const alternatif = alternatifGet.map((item) => item.nama);
  const kriteria = kriteriaGet.map((item) => ({
    nama: item.nama,
    item: item.tipe,
  }));
  const bobot = kriteriaGet.map((item) => parseFloat(item.bobot));
  const nilaiObj = penilaianGet.map((item) => item.nilai);
  const nilai = nilaiObj.map((row) => row.map((obj) => parseFloat(obj.value)));

  const dataToPython = { alternatif, kriteria, bobot, nilai };

  if (penilaianGet.length === 0) {
    return res.status(400).json({
      message: "Belum ada penilaian untuk user ini.",
    });
  }

  try {
    const parsed = topsisJS(dataToPython);

    if (parsed.status === "error") {
      return res.status(400).json(parsed);
    }

    await Topsis.create({
      id_user: id_user,
      matriks_keputusan_ternormalisasi:
        parsed["Matriks Keputusan Ternormalisasi"],
      matriks_keputusan_ternormalisasi_terbobot:
        parsed["Matriks Keputusan Ternormalisasi Terbobot"],
      d_positif: parsed["D+"],
      d_negatif: parsed["D-"],
      skor_akhir: parsed["Skor Akhir"],
      peringkat: parsed["Peringkat"],
      alternatif_terbaik: parsed["Alternatif Terbaik"],
    });

    await Borda.deleteMany()

    return res.status(200).json({
      matriks_keputusan_ternormalisasi:
        parsed["Matriks Keputusan Ternormalisasi"],
      matriks_keputusan_ternormalisasi_terbobot:
        parsed["Matriks Keputusan Ternormalisasi Terbobot"],
      a_plus: parsed["A+"],
      a_minus: parsed["A-"],
      d_positif: parsed["D+"],
      d_negatif: parsed["D-"],
      skor_akhir: parsed["Skor Akhir"],
      peringkat: parsed["Peringkat"],
      alternatif_terbaik: parsed["Alternatif Terbaik"],
    });
  } catch (error) {
    res.status(500).json({ message: `Error parsing Python result: ${error}` });
  }
  // const python = spawn("python", ["./services/topsis.py"]);

  // python.stdin.write(JSON.stringify(dataToPython));
  // python.stdin.end();

  // let result = "";
  // python.stdout.on("data", (data) => {
  //   result += data.toString();
  // });

  // python.stderr.on("data", (data) => {
  //   console.error("Python error: ", data.toString());
  //   return res.status(500).json({ message: data.toString() });
  // });

  // python.on("close", async (code) => {
  //   if (code !== 0) {
  //     return res
  //       .status(500)
  //       .json({ message: `Python access failed ${code}` });
  //   }

  // });
};

const perhitunganBorda = async (req, res) => {
  const borda = await Borda.find({}, { _id: 0, __v: 0 });

  if (borda.length > 0) {
    return res.status(200).json(borda);
  }

  const topsis = await Topsis.find(
    {},
    { id_user: 1, _id: 0, skor_akhir: 1, peringkat: 1 }
  )
    .populate("id_user", "peran")
    .exec();

  const result = topsis.map((item) => {
    const peran_plain = item.id_user.peran;
    const peran_splitted = peran_plain.split(" ");
    let peran = "";
    for (let i = 0; i < peran_splitted.length; i++) {
      peran += peran_splitted[i].charAt(0).toUpperCase();
    }

    const peringkatObj = Object.fromEntries(item.peringkat);

    return {
      nama: peran,
      skor_akhir: item.skor_akhir,
      peringkat: peringkatObj,
    };
  });

  try {
    const parsed = bordaJS.hitungBorda(result);

    await Borda.create({
      ranking_alternatif_per_decision_maker:
        parsed["ranking_alternatif_per_decision_maker"],
      perhitungan_skor_borda: parsed["perhitungan_skor_borda"],
    });

    res.status(200).json({
      ranking_alternatif_per_decision_maker:
        parsed["ranking_alternatif_per_decision_maker"],
      perhitungan_skor_borda: parsed["perhitungan_skor_borda"],
    });
  } catch (e) {
    res.status(500).json({ message: `Error parsing Python result: ${e}` });
  }

  // const python = spawn("python", ["./services/borda.py"]);

  // python.stdin.write(JSON.stringify(result));
  // python.stdin.end();

  // let results = "";

  // python.stdout.on("data", (data) => {
  //   results += data.toString();
  // });

  // python.stderr.on("data", (data) => {
  //   console.error("Python error: ", data.toString());
  // });

  // python.on("close", async (code) => {
  //   if (code !== 0) {
  //     return res.status(500).json({ message: "Python access failed" });
  //   }

  //   try {
  //     const parsed = JSON.parse(results);

  //     await Borda.create({
  //       ranking_alternatif_per_decision_maker:
  //         parsed["ranking_alternatif_per_decision_maker"],
  //       perhitungan_skor_borda: parsed["perhitungan_skor_borda"],
  //     });

  //     res.status(200).json({
  //       ranking_alternatif_per_decision_maker:
  //         parsed["ranking_alternatif_per_decision_maker"],
  //       perhitungan_skor_borda: parsed["perhitungan_skor_borda"],
  //     });
  //   } catch (e) {
  //     res.status(500).json({ message: `Error parsing Python result: ${e}` });
  //   }
  // });
};

const getInfoDecisionMakerLaporan = async (req, res) => {
  try {
    const dm = await User.find({}, { peran: 1 });

    let data = await Promise.all(
      dm
        .filter((item) => item.peran != "Admin")
        .map(async (item) => {
          const totalAlternatif = await Alternatif.countDocuments();
          const totalKriteria = await Kriteria.countDocuments();
          const tanggalPenilaian = await Penilaian.findOne(
            { id_user: item._id },
            { _id: 0, tanggal_penilaian: 1 }
          );
          return {
            id_user: item._id,
            peran: item.peran,
            total_alternatif: totalAlternatif,
            total_kriteria: totalKriteria,
            tanggal_penilaian: tanggalPenilaian?.tanggal_penilaian || null,
          };
        })
    );

    res.status(200).json(data);
  } catch (e) {
    res
      .status(500)
      .json({ message: `Error get info decision maker laporan ${e}` });
  }
};

module.exports = {
  addPenilaian,
  perhitunganTopsis,
  getAllPenilaian,
  deletePenilaian,
  perhitunganBorda,
  getPenilaianByIdUserAndAlternatif,
  getInfoDecisionMakerLaporan,
};
