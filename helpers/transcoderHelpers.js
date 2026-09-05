import fs from 'fs/promises'
import { Worker } from 'worker_threads';

import redisClient from '../config/redis.js';


const addJobToQueue = async (upload_id) => {
    try {
        const result = await redisClient.redis.rpush("jobs", upload_id);
        console.log("Job added Successfully");
        return true;
    } catch (error) {

        let err = Error(error.message);
        err.status = 500;
        throw err;
    }
}

const transcodeVideo = async () => {
    try {
        const worker = new Worker(`${process.cwd().replace(/\\/g, "/")}/helpers/worker.js`);
        worker.once("online", () => {
            console.log("✅ Worker is up and running");
        });

        worker.on("error", (err) => {
            console.error("❌ Worker crashed:", err);
        });

        worker.on("exit", (code) => {
            console.log(`Worker exited with code ${code}`);
        });
        worker.postMessage({
            "data":"hello"
        })



        // while (true) {
        //     worker.postMessage({
        //         "data": "here"
        //     })



        // }
    } catch (error) {
        console.log(`Error in transcoder=>${error.message || error}`);
        return
    }
}
transcodeVideo()
export default {
    addJobToQueue
}