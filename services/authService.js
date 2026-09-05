import authRepo from "../repository/authRepo.js";
import authHelpers from "../helpers/authHelpers.js";
import _ from 'lodash';
const registerUser = async(userdata)=>{
    try {
        const resultData = await authHelpers.prepareNewUser(userdata);
        if(!resultData){
            return null;
        }
        const result = await authRepo.addNewUser(resultData);
        const accessToken = await authHelpers.generateAccessToken(resultData);
        return {"msg": "User Added Successfully","tokens" : {accessToken}};
    } catch (error) {
        let err = Error(error.message);
        err.status = 500;
        throw err;
    }
}

const loginUser = async(loginData)=>{
    try {
        const userData  = await authRepo.getUserByEmail(loginData);
        console.log("userFound")
        if(userData && !_.isEmpty(userData)){
            const isValidPass = await authHelpers.comparePass(userData,loginData)
            if(isValidPass){
                const accessToken = await authHelpers.generateAccessToken(userData);
                // const refreshToken  = await authHelpers.generateRefreshToken(userData);
                return {"status": 200,"msg": "Login Successful","tokens" : {accessToken}};
            }
        } else{
            return {"success":false,"status": 404,"msg":"User Not Found"};
        }
    } catch (error) {
        let err = Error(error.message);
        err.status = 500;
        throw err;
    }
}

export default {
    registerUser,
    loginUser
}