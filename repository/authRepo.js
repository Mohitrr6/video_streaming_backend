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

const updateRefreshToken = async(refreshToken,user_id)=>{
    try {
        const result = await pool.query(`UPDATE users SET refresh_token = $1 WHERE user_id = $2`,[refreshToken,user_id]);
        return true;
    } catch (error) {
        console.error(`Error in updating token=>${error.message || error}`);
        throw new Error("Internal Server Error");
    }
}

const getUserByEmail = async(userData)=>{
    try {
        const { user_email} = userData;
        const result = await pool.query(`SELECT user_id,user_email,hashed_pass FROM users WHERE user_email = $1`,[user_email]);
        return result.rows[0];
    } catch (error) {
        console.error(`Error in updating token=>${error.message || error}`)
    }
}
export default {
    addNewUser,
    updateRefreshToken,
    getUserByEmail
}