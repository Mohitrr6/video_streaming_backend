import {v4 as uuidv4} from 'uuid';
import fs from 'fs/promises'
const generateId = async () => {
    return uuidv4();
}


const prepareNewVideoData = (videoRawData)=>{
    try {
        const {upload_id,title,description,user_id} = videoRawData
        const videoData = {
            "video_id": upload_id,
            "video_name":title,
            "video_desc": description,
            "status": "processing",
            "visiblity":"public",
            "likes": '0',
            "user_id":user_id
        }
        return videoData;
    } catch (error) {
        console.log(`Error in preparing New Video Data ====>${error.message || error}`);
        throw new Error("Internal Server Error");
    }
}

const attachThumbnails = async(videos)=>{
    try {
        if(videos.length ==0){
            return finalVideos;

        }
        const finalVideos = await Promise.all( videos.map(async(video)=>{
            const image  = await fs.readFile(`${process.cwd().replace(/\\/g, "/")}/uploads/${video?.video_id}/test/thumbnail.jpg`);
            
            const encodedImage = image.toString("base64");
            
            return {...video,"thumbnail":encodedImage}
        }))
        return finalVideos;
    } catch (error) {
        throw new Error("Error in attaching thumbnails");
    }
}

export default {
    generateId,
    prepareNewVideoData,
    attachThumbnails
}