const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "..", "uploads")); // Directory where uploaded files will be stored
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix+ '---' +file.originalname);
      }
})
const upload = multer({ storage: storage,
  fileFilter: (req, file, cb) => {
    // Accept Excel files (.xlsx, .xls)
    if (file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || 
        file.mimetype === "application/vnd.ms-excel") {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type, only Excel is allowed!'), false);
    }
  }
});

module.exports = upload;