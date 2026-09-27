import express from 'express'
import authonticated from '../middlewae/authMiddleware'
import authorization from '../middlewae/authorizationMiddleware'

const router = express.Router()

router.add('/add' , authonticated , authorization('MANAGER') , (req,res)=>{
    
})