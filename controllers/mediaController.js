import mediaService from '../services/mediaServices.js';
import fs from 'fs/promises';

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
        const {upload_id,total_chunks,file_name} = req.headers;
        const files = await fs.readdir(`${process.cwd().replace(/\\/g, "/")}/uploads/${upload_id}`);
        if(files && files.length == total_chunks){
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
export default {
    getUploadId,
    handleMedia,
    validateMedia
}