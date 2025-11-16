const Kriteria = require("../models/kriteria");
const mongoose = require("mongoose");

const toTitleCase = (str) => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const addKriteria = async (req, res) => {
  const { id_user, nama, tipe, bobot, nilai } = req.body;
  const clearedComma = nilai.split(";").map((item) => item.trim());
  const nilaiKriteria = clearedComma.map((item) => {
    const [key, value] = item.split(" - ");
    return {
      key: key.trim(),
      value: value.trim(),
    };
  });

  try {
    await Kriteria.create({
      id_user: id_user,
      nama: nama,
      tipe: tipe,
      bobot: bobot,
      nilai: nilaiKriteria,
    });

    res.sendStatus(201);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error menambah kriteria ke database: ", e });
  }
};

const deleteKriteria = async (req, res) => {
  const { id_kriteria } = req.query;

  try {
    await Kriteria.findByIdAndDelete(id_kriteria);

    res.sendStatus(200);
  } catch (e) {
    res
      .status(500)
      .json({ message: `Error hapus kriteria id ${id_kriteria}: ${e}` });
  }
};

const updateKriteria = async (req, res) => {
  const { id_kriteria, id_user, nama, tipe, bobot, nilai } = req.body;
  const clearedComma = nilai.split(";").map((item) => item.trim());
  const nilaiKriteria = clearedComma.map((item) => {
    const [key, value] = item.split(" - ");
    return {
      key: key.trim(),
      value: value.trim(),
    };
  });

  try {
    const existingKriteria = await Kriteria.findById(id_kriteria);

    if (!existingKriteria) {
      res
        .status(500)
        .json({ message: "Tidak ada kriteria yang sesuai ditemukan" });
    }

    existingKriteria.nama = nama;
    existingKriteria.id_user = id_user;
    existingKriteria.tipe = tipe;
    existingKriteria.bobot = bobot;
    existingKriteria.nilai = nilaiKriteria;

    await existingKriteria.save();

    res.sendStatus(200);
  } catch (e) {
    res
      .status(500)
      .json({ message: `Error update data kriteria id ${id_kriteria}: ${e}` });
  }
};

const getAllKriteria = async (req, res) => {
  try {
    const response = await Kriteria.find().sort({ tipe: -1 });

    res.status(200).json(response);
  } catch (e) {
    res
      .status(500)
      .json({
        message: "Error menampilkan semua data kriteria dari database: ",
        e,
      });
  }
};

const getKriteriaById = async (req, res) => {
  const { id_user } = req.params;

  try {
    const response = await Kriteria.find({ id_user: id_user }).sort({
      tipe: -1,
    });

    res.status(200).json(response);
  } catch (e) {
    res
      .status(500)
      .json({
        message: `Error mengambil data kriteria id:${id_user}: ${e}`,
      });
  }
};

const getKriteriaByTipe = async (req, res) => {
  let { tipe } = req.params;

  tipe = toTitleCase(tipe);

  try {
    const response = await Kriteria.find({ tipe: tipe }).sort({ nama: 1 });

    res.status(200).json(response);
  } catch (e) {
    res
      .status(500)
      .json({ message: `Error mengambil kriteria tipe ${tipe}: ${e}` });
  }
};

const getTotalKriteria = async (req, res) => {
  try {
    const total = await Kriteria.countDocuments();

    res.status(200).json(total);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error mengambil total kriteria dari database: ", e });
  }
};

module.exports = {
  addKriteria,
  getAllKriteria,
  getKriteriaById,
  getKriteriaByTipe,
  updateKriteria,
  deleteKriteria,
  getTotalKriteria,
};
