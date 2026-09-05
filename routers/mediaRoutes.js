import express from "express";
import mediaController from "../controllers/mediaController.js";
import multer from "multer";
import fs from 'fs/promises';
import validateMedia from '../middlewares/mediaMiddleware.js'
import validateToken from "../middlewares/authMiddleware.js";
const router = express.Router();

 const storage = multer.diskStorage({
  destination: function async(req, file, cb) {
    const uploadId = req.headers.upload_id;
     const uploadPath = `${process.cwd()}/uploads/${uploadId}`;
    fs.mkdir(uploadPath, { recursive: true }, (err) => {
            if (err) {
                return cb(err);
            }

            cb(null, uploadPath);
        });
  },
  filename: function (req, file, cb) {
    
    let chunk_count = req.query?.resumableChunkNumber;
    cb(null, file.fieldname + '-' + chunk_count + '.mp4')
  }
})

const upload = multer({ storage: storage });


router
  .get('/get/uploadId', validateToken,mediaController.getUploadId)
  .post('/upload',validateToken,validateMedia,upload.single("file"),mediaController.handleMedia)
  .post('/verify',validateToken,mediaController.validateMedia)
  .get('/videos',mediaController.getAllVideos)
  .get('/:videoId/thumbnail',mediaController.getThumbnail)
  .get('/:videoId/manifest',mediaController.getManifestFile)
  .get('/:videoId/:resolution/:fileName',mediaController.getManifestFile)

export default router;  