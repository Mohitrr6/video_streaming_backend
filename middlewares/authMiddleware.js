import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const validateToken = async(req,res,next)=>{
    try {
        const authHeader = req.headers["authorization"];
        if(!authHeader){
            return res.status(412).json({"success":false,"message":"Token Header Missing"})
        }
        const token  = authHeader.split(" ")[1];
        if(!token){
            return res.status(412).json({"success":true,"message":"Token Missing"});
        }

        const decoded = jwt.verify(token,process.env.TOKEN_SECRET);
        req.userData = decoded;
        next()
    } catch (error) {
        console.error(`error in Validate token==>${error.message || error}`);
        res.status(401).json({"success":false,"message":"Expired or invalid Token"});
    }
}

export default validateToken