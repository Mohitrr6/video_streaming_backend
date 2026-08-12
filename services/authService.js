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
        const refreshToken  = await authHelpers.generateRefreshToken(resultData);
        return {"msg": "User Added Successfully","tokens" : {accessToken,refreshToken}};
    } catch (error) {
        let err = Error(error.message);
        err.status = 500;
        throw err;
    }
}

const loginUser = async(loginData)=>{
    try {
        const userData  = await authRepo.getUserByEmail(loginData);
        
        if(userData && !_.isEmpty(userData)){
            const isValidPass = await authHelpers.comparePass(userData,loginData)
            if(isValidPass){
                const accessToken = await authHelpers.generateAccessToken(userData);
                const refreshToken  = await authHelpers.generateRefreshToken(userData);
                return {"status": 200,"msg": "Login Successful","tokens" : {accessToken,refreshToken}};
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