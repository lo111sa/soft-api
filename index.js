import express from "express";
import cookieParser from "cookie-parser";
import multer from "multer";
import cors from "cors";
import ErrorHandler from "./middlewares/errorHandler.js";
//Routes
import patientsRoutes from "./routes/patient.js";
import doctorsGroupsRoutes from "./routes/doctorsGroups.js";

const app = express();

app.use(cors()); //corsOptions
app.use(express.json());
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage });

app.post("/api/upload", upload.single("file"), function (req, res) {
  const file = req.file;
  res.status(200).json(file.filename);
});

//Routes
app.use("/api/patients", patientsRoutes);
app.use("/api/doctorsGroups", doctorsGroupsRoutes);

// ERROR HANDLER MIDDLEWARE (Last middleware to use)
app.use(ErrorHandler);

app.listen(8000, () => {
  console.log("Connected!");
});
