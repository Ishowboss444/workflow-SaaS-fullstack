import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
async function hasher(val) {
    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync(val, salt);
    return hash;
}
const login = async (req,res)=>{
    const  {email , password} = req.body
    
    //getting db
    const userExist = await prisma.user.findUnique({
        where : {email : email}
    })
    if(!userExist) {
        res.status(404).json({message: "you need to sign up first"})
    }

    //hashing
    const hashedPassword = await hasher(password)

    //validation
    if(hashedPassword === userExist.password){
        res.status(201).json({
            status : "success",
            data:{
                name:userExist.name,
                email:userExist.email,
                role:userExist.role,
                id:userExist.id,
            }
        })
    }else{
        res.status(400).json({message:"password is wrong"})
    }
}
const signup = async (req,res) => {
    const {name,email , password , role} = req.body
    const userExists = await prisma.user.findUnique({
        where : {email : email}
    })
    if(userExists){
        return res.status(400).send('you/re already registered')
    }

    //hashing
    const hashedPassword = await hasher(password)
    const user = await prisma.user.create({
        data:{
            name,
            email,
            password : hashedPassword,
            role,
        }
    })
    res.status(201).json({
        satus : "success",
        data : {
            id:user.id,
            name:user.name,
            email:user.email,
            password:user.password,
            role : user.role,
            createdAt : user.createdAt,
        }
    })
}
export {signup};