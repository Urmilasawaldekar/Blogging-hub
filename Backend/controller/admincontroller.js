import UserModel from "../models/User.js"
const Getuser=async(req,res)=>{
    try {
        const users=await UserModel.find()
         res.status(200).json({users})
    } catch (error) {
        res.status(500).json({message:"intenral server error"})
        console.log(error)
    }
}

const deletUser=async(req,res)=>{
    try {
        const userId=req.params.id
              const checkAdmin=await UserModel.findById(userId)

              if (checkAdmin.role =='admin') {
                return  res.status(409).json({message:"you can not delet youselfe"})
              }
        const user=await UserModel.findByIdAndDelete(userId)
        if (!user) {
          return  res.status(404).json({message:"user not found"})
        }
        res.status(200).json({message:"user delet successfully ",user})
    } catch (error) {
        res.status(500).json({message:"intenral server error"})
        console.log(error)
    }
}



const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email and password are required" });
        }
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User with this email already exists" });
        }
        const newUser = new UserModel({ name, email, password, role: role || 'user' });
        await newUser.save();
        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "internal server error" });
        console.log(error);
    }
};


export {Getuser,deletUser , createUser}