import express from 'express';
import {Auth} from '../controlers/authControler.js';
const router = express.Router();

router.post('/signup',(req,res)=>{
    const auth = new Auth(req,res)
    auth.signup()
});
router.post('/login',(req,res)=>{
    const auth = new Auth(req,res)
    auth.login()
});


export default router;