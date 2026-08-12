import dotenv from 'dotenv';
dotenv.config();
import { v4 as uvid } from "uuid";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authRepo from '../repository/authRepo.js';
import crypto from 'node:crypto'
const hashPass  = async(password)=>{
    try {
        if(!password){
            return null
        }
        const hashed_pass = await bcrypt.hash(password,parseInt(process.env.SALT_ROUND));
        return hashed_pass;
    } catch (error) {
        throw error;
    }
}
const comparePass = async(userData,loginData)=>{
    try {
        const {user_pass} =  loginData;
        const {hashed_pass} = userData;
        console.log(!user_pass)
        console.log(!hashed_pass)
        if(!user_pass || !hashed_pass){
            throw new Error("Incorrect Parameter");
        }
        const result  = await bcrypt.compare(user_pass,hashed_pass);
        return result;
    } catch (error) {
        console.error(`error==>${error.message || error}`);
        throw Error(error.message || error)
    }
}
const generateAccessToken = async(userNewData)=>{
    try {
        const {user_id}  = userNewData;
        const token = await jwt.sign({user_id},process.env.TOKEN_SECRET,{expiresIn:'2h'});
        return token;
    } catch (error) {
        console.error(`error in generating access Token=>${error.message || error}`);
        throw Error("Internal Server Error")
    }
}
const generateRefreshToken = async(userNewData)=>{
    try {
        const {user_id}  = userNewData;
        const refreshToken = crypto.randomBytes(16).toString("hex");
        console.log(refreshToken)

        const result = await authRepo.updateRefreshToken(refreshToken,user_id);
        if(result){
            return refreshToken;
        }
    } catch (error) {
        console.error(`error in refresh Token=>${error.message || error}`);
        throw Error("Internal Server Error")
    }
}
const prepareNewUser = async(userData)=>{
    try {
        const {name,email,password} = userData;
        const newData = {
            "user_id": uvid(),
            "user_name" : name,
            "user_email" : email,
            "hashed_pass" : await hashPass(password)
        }
        return newData;
    } catch (error) {
        console.error(`Error in creating new User Data=>${error.message || error}`);
        let err = Error(`Error in Preparing New User Data`);
        err.status = 500;
        throw err;
    }
}


export default {
    prepareNewUser,
    generateAccessToken,
    generateRefreshToken,
    comparePass
}