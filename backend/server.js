const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const alternatifRouter = require("./routes/alternatif");
const kriteriaRouter = require("./routes/kriteria");
const penilaianRouter = require("./routes/penilaian");
const { authenticateToken } = require("./controllers/authController");

dotenv.config();
const app = express();

app.use(cookieParser());
app.use(express.json());

const MONGO_URL = process.env.MONGO_URL;
mongoose
  .connect(MONGO_URL, {
    serverSelectionTimeoutMS: 30000,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((e) => {
    console.error("Failed to connect to MongoDB", e);
  });

const port = process.env.PORT;
app.listen(port, () => {
  console.log("App Running");
});

app.get("/api", authenticateToken, (req, res) => {
  res.send("Server is running");
});
app.use(cors());
app.use("/api/user", authenticateToken, userRouter);
app.use("/api/auth", authRouter);
app.use("/api/alternatif", authenticateToken, alternatifRouter);
app.use("/api/kriteria", authenticateToken, kriteriaRouter);
app.use("/api/penilaian", authenticateToken, penilaianRouter);
