const express = require("express");
const app = express();
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const port = process.env.PORT || 3000;
const server = `http://localhost:${port}`;

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() +
        "_" +
        file.originalname
          .split(" ")
          .join()
          .replace(",", "_")
    );
  }
});
checkFileType = (file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("images only");
  }
};
app.use(cors());
let uploader = multer({
  storage,
  limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
}).single("file");
app.post("/upload", (req, res) => {
  uploader(req, res, err => {
    if (err) res.json({ message: "error", details: err });
    else {
      if (req.file == undefined) {
        res.json({ message: "error", details: "no file selected" });
      } else {
        res.json({
          message: "file uploaded",
          url: `${server}/upload/${req.file.filename}`
        });
      }
    }
  });
});
app.get("/upload/:path", (req, res) => {
  return res.sendFile(req.params.path, { root: "uploads/" });
});

app.listen(port, err => {
  if (err) throw err;
  console.log(`> Ready on http://localhost:${port}`);
});
