import pool from '../config/db.js';

const addNewVideo = async(videoData)=>{
    try {
        const {video_id,video_name,video_desc,status,visiblity,likes,user_id} = videoData;
        const result = await pool.query('INSERT INTO videoData(video_id,video_name,video_desc,status,visiblity,likes,user_id) VALUES($1,$2,$3,$4,$5,$6,$7)',[video_id,video_name,video_desc,status,visiblity,likes,user_id]);
        return "Video Data Added Successfully";
    } catch (error) {
        throw new Error("Internal Server Error");
    }
}

const updateVideoStatus = async(videoId)=>{
    try{
        await pool.query(`UPDATE videoData SET status = 'ready' WHERE video_id = $1`,[videoId]);
    }
    catch(error){
        console.error(`Error in updating video status==>${error.message || error}`)
        throw new Error("Internal Server Error");
    }
}


const getVideos = async()=>{
    try {
        const result = await pool.query(`SELECT video_id,video_name,video_desc,likes FROM videodata WHERE status = $1`,["ready"]);
        return result.rows;
    } catch (error) {
        console.error(`Error Getting Videos==>${error.message || error}`);
        throw new Error(`Error Getting videos`);
    }
}
export default {
    addNewVideo,
    updateVideoStatus,
    getVideos
}