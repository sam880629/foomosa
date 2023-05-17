const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
//const mysql = require('mysql');
const router = express.Router();
var cors = require('cors');
app.use(cors());

var corsOptions = {
  origin: ['http://127.0.0.1:5501'],//在port號不同的http://localhost:3000設定http://localhost:5500可以拿資料
  //methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};
app.use(cors(corsOptions));
app.use(express.json({ extended: false }));

const imgstorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join('./public/upload/shop_id_14/menu_img/'));
  },
  filename: function (req, file, cb) {
    const decodedFileName = decodeURI(file.originalname);
    cb(null, decodedFileName);
  }
});
const upload = multer({ storage: imgstorage });

router.post('/check_image_exists', upload.array('image_files'), (req, res) => {
  if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }
  const existingFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const file = req.files[i];
    const newPath = path.join('./public/upload/shop_id_14/menu_img/', file.originalname);
    //console.log(newPath);

    if (fs.existsSync(newPath)) {
      //console.log(fs.existsSync(newPath))
      existingFiles.push(file.originalname);
    }
  }

  res.json({ exists: existingFiles.length > 0, files: existingFiles });
}); 

router.post('/delete_old_image', upload.array('image_files'), (req, res) => {
  if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }

  for (let i = 0; i < req.files.length; i++) {
    const file = req.files[i];
    const newPath = path.join('./public/upload/shop_id_14/menu_img/', file.originalname);
    //console.log(newPath);

    if (fs.existsSync(newPath)) {
     // console.log(fs.existsSync(newPath))
      fs.unlinkSync(newPath); // 删除舊圖片
    }
  }

  res.send('Old images deleted successfully');
  console.log('Old images deleted successfully');
});


router.post('/upload_image', upload.array('image_files'), (req, res) => {
  if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }

  for (let i = 0; i < req.files.length; i++) {
    const file = req.files[i];
    //console.log(file)
    const newPath = path.join('./public/upload/shop_id_14/menu_img/', file.originalname);
    //console.log(newPath)
    fs.rename(file.path, newPath, (err) => {
      if (err) {
        console.error('Error renaming file:', err);
      }
    });
  }

  res.send('Files uploaded successfully');
  console.log('Files uploaded successfully');
});


module.exports = router;
 