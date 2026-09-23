import jwt from 'jsonwebtoken'
import { prisma } from '../config/db.js '
function authonticated (req , res , next){
    let token = req.cookies.accessToken
    console.log(token); 
    if(!token){
        const authHeader = req.headers['authorization']
        token = authHeader && authHeader.split(' ')[1]
        console.log("cookie not found");
    }
    
    if(!token){
        return res.status(401).json({message : "user is not authonticated"})
    } 
    //this line decode the jwt with the access key 
    const decode = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET )
    console.log(decode.name);

    req.user = decode
    next()
}
export default authonticated