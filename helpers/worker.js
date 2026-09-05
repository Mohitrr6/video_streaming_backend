import fs from 'fs';
import fsp from 'fs/promises';
import { spawn } from 'child_process';
import { execSync } from "child_process";

import { parentPort } from 'worker_threads';
import redisClient from '../config/redis.js';
import mediaRepo from '../repository/mediaRepo.js';

parentPort.on('message', async (workerData) => {
    try {
        while (true) {

            const transcodeJob = await redisClient.workerRedis.blpop("jobs", 0);
            const jobId = transcodeJob[1];
            const outputPath = `${process.cwd().replace(/\\/g, "/")}/uploads/${jobId}/output.mp4`
            const writeStream = fs.createWriteStream(outputPath);
            const chunks = await fsp.readdir(`${process.cwd().replace(/\\/g, "/")}/uploads/${jobId}`);


            for (const chunk of chunks) {

                if (chunk === "output.mp4") {
                    continue;
                }

                const chunkPath = `${process.cwd().replace(/\\/g, "/")}/uploads/${jobId}/${chunk}`;

                const chunkData = await fsp.readFile(chunkPath);

                writeStream.write(chunkData);
            }



            writeStream.end();
            //             writeStream.on("finish", () => {
            //     console.log("File completely written");
            // });


            console.log("Video merged:", outputPath);

            await transcoder(jobId,async(status)=>{
                try {
                    await mediaRepo.updateVideoStatus(jobId);
                    console.log("Trancoding Complete");

                } catch (error) {
                    console.log("Error in transcoding");
                }
            });
            

        }
    } catch (error) {
        console.error(`Error in worker=>${error.message || error}`);
    }
})


const qualities = [
    {
        name: "360",
        width: 640,
        height: 360,
    },
    {
        name: "480",
        width: 854,
        height: 480,
    },
    {
        name: "720",
        width: 1280,
        height: 720,
    },
    {
        name: "1080",
        width: 1920,
        height: 1080,
    }
];

const transcoder = async (jobId,oncomplete) => {
    try {

        const filePath = `${process.cwd().replace(/\\/g, "/")}/uploads/${jobId}/output.mp4`;
        await fsp.mkdir(`${process.cwd().replace(/\\/g, "/")}/uploads/${jobId}/output`, { recursive: true });
        const outputPath = `${process.cwd().replace(/\\/g, "/")}/uploads/${jobId}/test`;
        await fsp.mkdir(`${process.cwd().replace(/\\/g, "/")}/uploads/${jobId}/test/240p`, { recursive: true });
        await fsp.mkdir(`${process.cwd().replace(/\\/g, "/")}/uploads/${jobId}/test/360p`, { recursive: true });
        await fsp.mkdir(`${process.cwd().replace(/\\/g, "/")}/uploads/${jobId}/test/480p`, { recursive: true });
        await fsp.mkdir(`${process.cwd().replace(/\\/g, "/")}/uploads/${jobId}/test/720p`, { recursive: true });
        await fsp.mkdir(`${process.cwd().replace(/\\/g, "/")}/uploads/${jobId}/test/1080p`, { recursive: true });

        const ffmpegArgs = [
    "-i", filePath,

    // =========================
    // VIDEO FILTERS
    // =========================

    "-filter_complex",
    "[0:v]split=5[v240][v360][v480][v720][v1080];" +

    // 240p
    "[v240]scale=426:240:force_original_aspect_ratio=decrease," +
    "pad=426:240:(ow-iw)/2:(oh-ih)/2[v240out];" +

    // 360p
    "[v360]scale=640:360:force_original_aspect_ratio=decrease," +
    "pad=640:360:(ow-iw)/2:(oh-ih)/2[v360out];" +

    // 480p
    "[v480]scale=854:480:force_original_aspect_ratio=decrease," +
    "pad=854:480:(ow-iw)/2:(oh-ih)/2[v480out];" +

    // 720p
    "[v720]scale=1280:720:force_original_aspect_ratio=decrease," +
    "pad=1280:720:(ow-iw)/2:(oh-ih)/2[v720out];" +

    // 1080p
    "[v1080]scale=1920:1080:force_original_aspect_ratio=decrease," +
    "pad=1920:1080:(ow-iw)/2:(oh-ih)/2[v1080out];" +

    // =========================
    // THUMBNAIL - FRAME 5
    // =========================

    "[0:v]select='eq(n,5)',scale=640:-2[thumb]",

    // =========================
    // 240p
    // =========================

    "-map", "[v240out]",
    "-map", "0:a?",

    "-c:v:0", "libx264",
    "-threads:v:0", "1",
    "-b:v:0", "400k",
    "-maxrate:v:0", "450k",
    "-bufsize:v:0", "800k",

    "-c:a:0", "aac",
    "-b:a:0", "64k",

    // =========================
    // 360p
    // =========================

    "-map", "[v360out]",
    "-map", "0:a?",

    "-c:v:1", "libx264",
    "-threads:v:1", "1",
    "-b:v:1", "800k",
    "-maxrate:v:1", "900k",
    "-bufsize:v:1", "1600k",

    "-c:a:1", "aac",
    "-b:a:1", "96k",

    // =========================
    // 480p
    // =========================

    "-map", "[v480out]",
    "-map", "0:a?",

    "-c:v:2", "libx264",
    "-threads:v:2", "1",
    "-b:v:2", "1400k",
    "-maxrate:v:2", "1600k",
    "-bufsize:v:2", "2800k",

    "-c:a:2", "aac",
    "-b:a:2", "128k",

    // =========================
    // 720p
    // =========================

    "-map", "[v720out]",
    "-map", "0:a?",

    "-c:v:3", "libx264",
    "-threads:v:3", "1",
    "-b:v:3", "2800k",
    "-maxrate:v:3", "3200k",
    "-bufsize:v:3", "5600k",

    "-c:a:3", "aac",
    "-b:a:3", "128k",

    // =========================
    // 1080p
    // =========================

    "-map", "[v1080out]",
    "-map", "0:a?",

    "-c:v:4", "libx264",
    "-threads:v:4", "1",
    "-b:v:4", "5000k",
    "-maxrate:v:4", "5500k",
    "-bufsize:v:4", "10000k",

    "-c:a:4", "aac",
    "-b:a:4", "192k",

    // =========================
    // ENCODING
    // =========================

    "-preset", "veryfast",

    "-g", "48",
    "-keyint_min", "48",
    "-sc_threshold", "0",

    // =========================
    // PIXEL FORMAT
    // =========================

    "-pix_fmt", "yuv420p",

    // =========================
    // HLS
    // =========================

    "-f", "hls",
    "-hls_time", "6",
    "-hls_playlist_type", "vod",
    "-hls_flags", "independent_segments",

    "-hls_segment_filename",
    `${outputPath}/%v/segment_%03d.ts`,

    // =========================
    // MASTER PLAYLIST
    // =========================

    "-master_pl_name",
    "master.m3u8",

    "-var_stream_map",
    "v:0,a:0,name:240p " +
    "v:1,a:1,name:360p " +
    "v:2,a:2,name:480p " +
    "v:3,a:3,name:720p " +
    "v:4,a:4,name:1080p",

    // =========================
    // VARIANT PLAYLIST
    // =========================

    `${outputPath}/%v/index.m3u8`,

    // =========================
    // THUMBNAIL
    // =========================

    "-map", "[thumb]",
    "-frames:v", "1",
    "-q:v", "8",
    "-f", "image2",

    `${outputPath}/thumbnail.jpg`
];

    const ffmpegProc = spawn('ffmpeg',ffmpegArgs);

        ffmpegProc.stderr.on("data", (data) => {
            console.log(data.toString());
        });
        ffmpegProc.on("error", (error) => {
    console.error("FFmpeg spawn error:", error);

     
});
ffmpegProc.on("close", (code) => {

        if (code === 0) {
            console.log("✅ Transcoding successful");
            oncomplete(true);
            
        } else {
            console.log(`❌ Transcoding failed. Exit code: ${code}`);
            
        }

    });



        





    } catch (error) {
        console.log(error);
    }
}

