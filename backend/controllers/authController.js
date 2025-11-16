const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const response = await User.findOne({ email: email });

    if (!response) {
      res.status(400).json({ message: "Email salah" });
    }

    const isMatch = await bcrypt.compare(password, response.password);

    if (!isMatch) {
      res.status(400).json({ message: "Password salah" });
    }

    const accessToken = jwt.sign(
      {
        id_user: response._id,
        nama: response.nama,
        email: response.email,
        peran: response.peran,
        tgl_bergabung: response.createdAt,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      {
        id_user: response._id,
        email: response.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ accessToken });
  } catch (e) {
    res.status(500).json({ message: `Error login from database: ${e}` });
  }
};

const register = async (req, res) => {
  try {
    const { email, nama, password, peran } = req.body;

    bcrypt.hash(password, 10, async (req, encrypted) => {
      const response = await User.create({
        nama: nama,
        email: email,
        password: encrypted,
        peran: peran,
      });

      const accessToken = jwt.sign(
        {
          id_user: response._id,
          nama: response.nama,
          email: response.email,
          peran: response.peran,
          tgl_bergabung: response.createdAt,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      const refreshToken = jwt.sign(
        {
          id_user: response._id,
          email: response.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({ accessToken });
    });
  } catch (e) {
    res.status(500).json({ message: `Error register user: ${e}` });
  }
};

const authenticateToken = (req, res, next) => {
  const accessToken = req.header("Authorization")?.replace("Bearer ", "");

  if (!accessToken) {
    return res.status(401).json({ message: "Akses ditolak, token tidak ada" });
  }

  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_SECRET,
      (err, decoded) => {
        if (err) {
          return res
            .status(403)
            .json({ message: "Token tidak valid atau sudah kedaluwarsa" });
        }

        req.user = decoded;
        next();
      }
    );
  } catch (e) {
    return res.status(403).json({ message: `Token tidak valid: ${e}` });
  }
};

const refreshAccessToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Token tidak ada" });
  }

  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Refresh token tidak valid" });
    }

    const accessToken = jwt.sign(
      { id_user: decoded.id_user, email: decoded.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ accessToken });
  });
};

const logout = async (req, res) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    res.sendStatus(200)
  } catch (e) {
    throw Exception("Gagal logout: ", e);
  }
};

module.exports = {
  login,
  register,
  authenticateToken,
  logout,
  refreshAccessToken,
};
