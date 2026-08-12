import mediaHelpers from '../helpers/mediaHelpers.js';


const generateUploadId = async () => {
    const id = await mediaHelpers.generateId();
    return id;
}




export default {
    generateUploadId
}