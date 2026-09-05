import mediaHelpers from '../helpers/mediaHelpers.js';
import mediaRepo from '../repository/mediaRepo.js';


import fs from 'fs/promises';
const generateUploadId = async () => {
    const id = await mediaHelpers.generateId();
    return id;
}

const addVideoData = async(videoData)=>{
    try {
        const {upload_id,title,description} = videoData;
        if(!upload_id && !title && !description){
            return {"status":412,"msg":"Data Missing"}
        }
        const videoPreparedData = mediaHelpers.prepareNewVideoData(videoData);
        const result = await mediaRepo.addNewVideo(videoPreparedData);
        return result;
    } catch (error) {
        throw error;
    }
}

const fetchAllVideos = async()=>{
    try {
        const result = await mediaRepo.getVideos();
       

        return result;
    } catch (error) {
        throw error;
    }
}

const getThumbnail = async(video_id)=>{
    try {
        const thumbNailPath  = `${process.cwd().replace(/\\/g, "/")}/uploads/${video_id}/test/thumbnail.jpg`
        if(!thumbNailPath){
            return null;
        }
        return thumbNailPath;
    } catch (error) {
        console.error(`Error in Getting thumbnail`);
        throw "Intenal Server Error";
    }
}

const getManifestFilePath = async(video_id,resolution,fileName)=>{
    try {
        if(resolution && fileName){
            const manifestPath  = `${process.cwd().replace(/\\/g, "/")}/uploads/${video_id}/test/${resolution}/${fileName}`
            return manifestPath;
        }
        const manifestPath  = `${process.cwd().replace(/\\/g, "/")}/uploads/${video_id}/test/master.m3u8`
        if(!manifestPath){
            return null;
        }
        return manifestPath;
    } catch (error) {
        console.error(`Error in Getting thumbnail==>${error.message || error}`);
        throw "Intenal Server Error";
    }
}

export default {
    generateUploadId,
    addVideoData,
    fetchAllVideos,
    getThumbnail,
    getManifestFilePath
}