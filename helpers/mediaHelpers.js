import {v4 as uuidv4} from 'uuid';

const generateId = async () => {
    return uuidv4();
}


export default {
    generateId
}