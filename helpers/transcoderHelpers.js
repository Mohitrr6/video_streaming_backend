import redis from '../config/redis.js';


const addJobToQueue = async(upload_id)=>{
    try {
        const result   = await redis.lpush("jobs",upload_id)
    } catch (error) {

        let err = Error(error.message);
        err.status = 500;
        throw err;
    }
}


export default {
    addJobToQueue
}