


const validateMedia = (req,res,next) =>{
    try {
        // resumableChunkNumber=1&resumableChunkSize=5242880&resumableCurrentChunkSize=5242880&resumableTotalSize=18561736&resumableType=video%2Fmp4&resumableIdentifier=18561736-Screen_Recording_20250610_083752_Chromemp4&resumableFilename=Screen_Recording_20250610_083752_Chrome.mp4&resumableRelativePath=Screen_Recording_20250610_083752_Chrome.mp4&resumableTotalChunks=3&uploadId=some-upload-id
        const {resumableChunkNumber,resumableTotalChunks} = req.query;
        const {upload_id} = req.headers;
        if(!resumableChunkNumber && !resumableTotalChunks){
            res.status(412).json({"success":false,"msg" : "Missing Parameters"});
        }
        if(parseInt(resumableChunkNumber) === parseInt(resumableTotalChunks)){
            req.headers.isLastChunk = true;
        }
        if(parseInt(resumableChunkNumber)<= parseInt(resumableTotalChunks)){
            next();
        }else{
            res.status(400).json({"success":false,"msg" : "Bad Request"});
        }
    } catch (error) {
        res.status(error.status || 500).json("Internal Server Error");
    }
}

export default validateMedia;