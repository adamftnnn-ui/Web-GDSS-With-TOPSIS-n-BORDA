const express = require("express");
const User = require("../models/users");
const bcrypt = require("bcryptjs");

const getAllUser = async (req, res) => {
  try {
    const response = await User.find();

    if (!response) {
      return res
        .status(500)
        .json({ message: "Error mengambil data user dari database" });
    }

    res.status(200).json(response);
  } catch (e) {
    res
      .status(500)
      .json({ message: `Error mengambil data user: ${e.message}` });
  }
};

const getUserById = async (req, res) => {
  const { id_user } = req.query;

  if (!id_user) {
    return res.status(400).json({ message: "id_user is required" });
  }
  console.log(id_user);

  try {
    const response = await User.findById(id_user);

    if (!response) {
      return res.status(404).json({
        message: `Tidak ada data user dengan id ${id_user} yang ditemukan`,
      });
    }

    res.status(200).json(response);
  } catch (e) {
    throw new Error(
      `Error mengambil data user id:${id_user} dari database: ${e.message}`
    );
  }
};

const getTotalUser = async (req, res) => {
  try {
    const total = await User.countDocuments();

    res.status(200).json(total);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error mengambil total user dari database: ", e });
  }
};

const updateUser = async (req, res) => {
  const { id_user, nama, email, peran } = req.body;

  try {
    const existingUser = await User.findOne({ _id: id_user });

    if (!existingUser) {
      return res
        .status(404)
        .json({ message: `User dengan id ${id_user} tidak ditemukan` });
    }

    existingUser.nama = nama;
    existingUser.email = email;
    existingUser.peran = peran;

    await existingUser.save();

    res.sendStatus(200);
  } catch (e) {
    throw new Error(`Error mengupdate data user id:${id_user}: ${e.message}`);
  }
};

const createUser = async (req, res) => {
  const { nama, email, password, peran } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      nama: nama,
      email: email,
      password: hashedPassword,
      peran: peran,
    });

    res.sendStatus(201);
  } catch (e) {
    throw new Error(`Error menambah data user: ${e.message}`);
  }
};

const deleteUser = async (req, res) => {
  const { id_user } = req.query;

  try {
    const user = await User.findByIdAndDelete(id_user);

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.sendStatus(200);
  } catch (e) {
    res.status(500).json({ message: `Error deleting user: ${e.message}` });
  }
};

const ubahPassword = async (req, res) => {
  const { id_user, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await User.findOne({ _id: id_user });

    if (!existingUser) {
      return res
        .status(404)
        .json({ message: `User with ID ${id_user} tidak ditemukan` });
    }

    existingUser.password = hashedPassword;

    await existingUser.save();

    res.sendStatus(200);
  } catch (e) {
    console.error(
      `Error updating password for user id:${id_user}: ${e.message}`
    );
    res.status(500).json({ message: `Error updating password: ${e.message}` });
  }
};

const getInisialUser = async (req, res) => {
  const { id_user } = req.params;

  try {
    const response = await User.findById(id_user);
    const peran_plain = response["peran"];
    const peran_splitted = peran_plain.split(" ");
    let peran = "";
    for (let i = 0; i < peran_splitted.length; i++) {
      peran += peran_splitted[i].charAt(0).toUpperCase();
    }
    res.status(200).json({ peran: peran });
  } catch (e) {
    res
      .status(500)
      .json({
        message: `Error saat mengambil inisial user id: ${id_user}: ${e}`,
      });
  }
};

module.exports = {
  getAllUser,
  getUserById,
  updateUser,
  ubahPassword,
  createUser,
  getTotalUser,
  deleteUser,
  getInisialUser,
};
