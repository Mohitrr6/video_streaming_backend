import fs from 'fs/promises';

import mediaService from '../services/mediaServices.js';
import redisHandler from '../helpers/transcoderHelpers.js'
const getUploadId = async (req, res) => {
    try {
        const uploadId = await mediaService.generateUploadId(); 
        res.status(200).json({ "success": true, "data": uploadId });
    } catch (error) {  
        console.log(error); 
        res.status(500).json({ "success": false, "msg": 'Failed to generate upload ID' });
    } 
} 
const handleMedia = async(req,res)=>{
    try {
        res.json("done");
        
    } catch (error) {
        res.status(error.status || 500).json("Internal Server Error");
    }
}
const validateMedia = async(req,res)=>{
    try {
        const {upload_id,total_chunks} = req.headers;
        const videoDetail = req.body;
        videoDetail.upload_id = upload_id;
        const {user_id}  = req.userData;

        

        const files = await fs.readdir(`${process.cwd().replace(/\\/g, "/")}/uploads/${upload_id}`);
        if(files && files.length == total_chunks){
            await mediaService.addVideoData({...videoDetail,user_id});
            await redisHandler.addJobToQueue(upload_id)
            res.status(200).json({"success":true,"msg": "video Verified"})
        }else{
            console.log(files)
            res.status(400).json({"success":false,"msg":"Verification Failed"});
        }

        
    } catch (error) {
        console.log(`Error in verifying Files${error.message || error}`)
        res.status(error.status || 500).json("Internal Server Error");
    }
}




const getAllVideos = async(req,res)=>{
    try {
        const videos = await mediaService.fetchAllVideos();
        res.status(200).json({"success":true,"message":"Videos Fetched Successfully","data":videos})
    } catch (error) {
        res.status(error.status || 500).json("Internal Server Error")
    }
}

const getThumbnail = async(req,res)=>{
    try {
        const {videoId} = req.params;
        if(!videoId){
            return res.status(403).json({"success":false,"message":"Video Data Missing"})
        }
        const videoThumbnail  = await mediaService.getThumbnail(videoId);
        if(!videoThumbnail){
            return res.status(403).json("No file")
        }
        return res.status(200).sendFile(videoThumbnail);
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json("Internal Server Error")
    }
}

const getManifestFile  = async(req,res)=>{
    try {
        const {videoId,resolution,fileName} = req.params;
        if(!videoId){
            return res.status(403).json({"success":false,"message":"Video Data Missing"})
        }
        const manifestFilePath = await mediaService.getManifestFilePath(videoId,resolution,fileName);
        if(!manifestFilePath){
            return res.status(403).json("No file")
        }
        res.status(200).sendFile(manifestFilePath);
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json("Internal Server Error")
    }
}


export default {
    getUploadId,
    handleMedia,
    validateMedia,
    getAllVideos,
    getThumbnail,
    getManifestFile
}