import express from 'express'
import { Getuser, deletUser } from '../controller/admincontroller.js'
import { isAdmin } from '../middleware/verifiedtoken.js'

const AdminRouter = express.Router()
AdminRouter.get('/getuser', isAdmin, Getuser)
AdminRouter.delete('/delet/:id', isAdmin, deletUser)
AdminRouter.post('/create', isAdmin, createUser)


export default AdminRouter
