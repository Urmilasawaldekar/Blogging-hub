import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';


const isAdmin = async (req, res, next) => {
  try {
    const token = (req.headers.authorization && req.headers.authorization.split(' ')[1]) || (req.cookies && req.cookies.token);
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized: User is not an admin' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('isAdmin middleware error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const IsUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('IsUser middleware error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const  VerifyToken = (req, res, next )=>{
    const token = (req.cookies.token) || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    console.log('VerifyToken middleware - token:', token);
    if(!token){
        console.log('VerifyToken middleware - no token found');
        return res.status(401).json({ message: "You are not authenticated" });
    }
    jwt.verify(token, process.env.JWT_SECRET , async(err, data)=>{
if(err){
    console.log('VerifyToken middleware - token invalid:', err.message);
    return res.status(403).json({ message: "Token is invalid" });
}
req.user = await UserModel.findById(data.id);
console.log('VerifyToken middleware - user found:', req.user);
next()
    }
)}

export { isAdmin, IsUser ,VerifyToken };