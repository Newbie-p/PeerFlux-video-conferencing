import httpStatus from "http-status";
import { User } from "../models/user.model.js";
import bcrypt, { hash } from "bcrypt";
import crypto from "crypto";

const login = async(req,res)=>{
    const {loginId, password} = req.body;
    if( !loginId || !password){
        return res.status(400).json({message:"Please provide required data"});
    }
    try{
        const user = await User.findOne({
      $or: [{ username: loginId }, { email: loginId }]});
        if(!user){
            return res.status(httpStatus.NOT_FOUND).json({message:"User not found. Please register"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid password" });
        }

        const token = crypto.randomBytes(20).toString("hex");
        user.token = token;
        await user.save();

        return res.status(httpStatus.OK).json({ token: token });
    }catch(e){
        return res.status(500).json({message:`Something went wrong ${e}`});
    }
}


const register = async(req, res)=>{
    const {name, email, username, password} = req.body;

    try{
        const existingUser = await User.findOne({ username });
        const existingMail = await User.findOne({email});
        if(existingUser || existingMail){
            return res.status(httpStatus.FOUND).json({message : "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name: name,
            email: email,
            username: username,
            password: hashedPassword
        })

        await newUser.save();
        res.status(httpStatus.CREATED).json({message: "User registered."});
    }catch(e){
        res.json({message: `Something went wrong ${e}`});
    }
}


export{ login, register };