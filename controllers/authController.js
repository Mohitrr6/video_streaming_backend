import authService from "../services/authService.js";


const registerUser = async(req,res)=>{
    try {
        const userRawData  = req.body;
        console.log(userRawData)
        const result = await authService.registerUser(userRawData);
        
        res.status(result.status || 200).json({"success":true,"message":result.msg,"data": {"token": result?.tokens?.accessToken}})
    } catch (error) {
        res.status(error.status || 500).json({"success":false,"message":error.message || "Internal Server Error"});
    }
}

const loginUser = async(req,res)=>{
    try {
        const loginData = req.body;

        console.log(loginData)
        const result = await authService.loginUser(loginData);
        
        console.log("this",result)
        if(result.status === 200){
        res.cookie("refreshToken", result.tokens.refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
     return res.status(result.status).json({"success":result.success || 'true',"message":result.msg,"data": {"token": result?.tokens?.accessToken}})
    }
        else if(result.status === 404){
            return res.status(result.status).json({"success":result.success,"message":result.msg}) 
        }
    } catch (error) {
        res.status(error.status || 500).json({"success":false,"message":error.message || "Internal Server Error"});
    }
}

export default {
    registerUser,
    loginUser
}