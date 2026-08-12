import express from "express";
import mediaController from "../controllers/mediaController.js";
import multer from "multer";
import fs from 'fs/promises';
import validateMedia from '../middlewares/mediaMiddleware.js'
const router = express.Router();

 const storage = multer.diskStorage({
  destination: function async(req, file, cb) {
    const uploadId = req.headers.upload_id;
    
    fs.mkdir(`${process.cwd().replace(/\\/g, "/")}/uploads/${uploadId}`,{recursive:true});
    cb(null, `${process.cwd().replace(/\\/g, "/")}/uploads/${uploadId}`)
  },
  filename: function (req, file, cb) {
    
    let chunk_count = req.query?.resumableChunkNumber;
    cb(null, file.fieldname + '-' + chunk_count + '.mp4')
  }
})

const upload = multer({ storage: storage });


router
  .get('/get/uploadId', mediaController.getUploadId)
  .post('/upload',validateMedia,upload.single("file"),mediaController.handleMedia)
  .get('/verify',mediaController.validateMedia)

export default router;  