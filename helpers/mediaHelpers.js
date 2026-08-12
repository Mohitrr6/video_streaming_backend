import {v4 as uuidv4} from 'uuid';

const generateId = async () => {
    const id = uuidv4();
    return id;
}


export default {
    generateId
}