import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
async function hasher(val) {
    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync(val, salt);
    return hash;
}
const signup = async (req,res) => {
    const {name,email , password , field} = req.body

    const userExists = await prisma.user.findUnique({
        where : {email : email}
    })
    if(userExists){
        return res.status(400).send('you/re already registered')
    }

    //hashing
    const hashedPassword =await hasher(password)
    const user = await prisma.user.create({
        data:{
            name,
            email,
            password : hashedPassword,
            fieldOfWork : field
        }
    })
    res.status(201).json({
        satus : "success",
        data : {
            id:user.id,
            name:user.name,
            email:user.email,
            password:user.password,
            fieldOfWork : user.fieldOfWork,
            createdAt : user.createdAt,
        }
    })
}
export {signup};