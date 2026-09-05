import pool from '../config/db.js';

const addNewUser = async(newUserData)=>{
    try {
        const {user_id,user_name,user_email,hashed_pass} = newUserData;
        
        const result = await pool.query(`INSERT INTO users(user_id,user_name,user_email,hashed_pass,created_at) VALUES($1,$2,$3,$4,$5)`,[user_id,user_name,user_email,hashed_pass,new Date()]);
        return "User Created Successfully";
    } catch (error) {
        console.error(`Error in adding new user=>${error.message || error}`);
        throw new Error(`Internal Server Error`);
    }
}



const getUserByEmail = async(userData)=>{
    try {
        const { email} = userData;
        const result = await pool.query(`SELECT user_id,user_email,hashed_pass FROM users WHERE user_email = $1`,[email]);
        return result.rows[0];
    } catch (error) {
        console.error(`Error in updating token=>${error.message || error}`)
    }
}
export default {
    addNewUser,
    getUserByEmail
}