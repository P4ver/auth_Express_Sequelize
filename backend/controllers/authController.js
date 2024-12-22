const {User}  = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const transporter = require('../config/nodemailer'); 
const { Op } = require('sequelize');
const crypto = require('crypto');

exports.signup = async(req, res,)=>{
    const {username, password, email} = req.body;
    try{
        if (!username || !password || !email) {
            return res.status(400).json({message : 'all of fields are required'})
        }

        const existingUser = await User.findOne({where : {email}})
        
        console.log("==>",existingUser)

        if (existingUser) {
            return res.status(400).json({message : 'this user already exists'})
        }
        
        const hashedPassword = await bcrypt.hash(password, 10) 
        const verifyOTP = Math.floor(100000 + Math.random() * 900000).toString()

        const user = await User.create({
            username,
            password: hashedPassword,
            email,
            verifyOTP,
            verifyOTPExpireAt : Date.now() + 24 * 60 * 60 * 1000
        })

        const token  = jwt.sign({id: user.id}, process.env.JWT_SECRET_KEY, {expiresIn: '2d'})

        res.cookie('token', token, {
            secure : process.env.NODE_ENV === 'production',
            httpOnly: true, // to prevent client side script from accessing the cookie
            maxAge : 7 * 24 * 60 * 60 * 1000
        })
        
        const mailOptions = {
            from : process.env.MAIL_SENDER,
            to : email,
            subject : 'HELLO There!',
            text : `welcome to our website, ${username}`, 
            html : `<h1>here is your mail verification ${verifyOTP}</h1>`
        }

        try {
            await transporter.sendMail(mailOptions);
        } catch (err) {
            console.error("Email sending failed:", err);
        }

        res.status(201).json({
            message: 'the user has been created successfullly',
            username,
            id : user.id
        })
 
    } catch (err){
        console.error(err)
        return res.status(500).json({message: 'signup : server err'})
    }
}

exports.login = async(req, res) => {
    const {username, password} = req.body;
    try{
        if (!username || !password) return res.status(400).json({message: 'all of fields are required'})
        
        const user = await User.findOne({where:{username}})
        // console.log("==>",user)
        if (!user) return res.status(401).json({message: 'invalid credentials : username is not valid'})
        
        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch) {
            return res.status(401).json({message: 'incorrect password'})
        }

        const token  = jwt.sign({id: user.id}, process.env.JWT_SECRET_KEY, {expiresIn: '2d'})

        // user.lastLogin = new Date();

        res.cookie('token', token, {
            secure : process.env.NODE_ENV === 'production',
            httpOnly: true, // to prevent client side script from accessing the cookie
            maxAge : 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({message: 'successfully Login', username, id : user.id})
    }
    catch(err){
        console.error(err)
        return res.status(500).json({message: 'LOGIN : server error'})
    }
}

exports.logout = async(req, res) => {
    try{
        res.clearCookie('token',{
            secure : process.env.NODE_ENV === 'production',
            httpOnly: true,
        })
        return res.status(200).json({message: 'successfully logged out'})
    }
    catch(err){
        console.error(err)
        return res.status(500).json({message: 'LOGOUT : server error'})
    }
}

exports.verifyOTP = async(req, res) => {
    const {verifyOTP} = req.body;
    try{
        const user = await User.findOne({
            where :{
                verifyOTP: verifyOTP,
                verifyOTPExpireAt : {
                    [Op.gt] : Date.now()
                }
            }
        })

        if (!user) return res.status(400).json({message: 'invalid or expired verification code'})
        
        user.isVerified = true;
        user.verifyOTP = "verified";
        user.verifyOTPExpireAt = null;
        
        await user.save();

        const mailOptions = {
            from : process.env.MAIL_SENDER,
            to : user.email,
            subject : 'HELLO :)',
            html : `<h1>welcome ${user.username}, to our website your verification is successffuly</h1>`
        }

        
        await transporter.sendMail(mailOptions);

        res.status(200).json({message: 'verification successful'})
    }catch (err){
        console.error(err)
        return res.status(500).json({message: 'verification : server error'})
    }
}


exports.forgotPassword = async(req, res) =>{
    const {email} = req.body;
    try{
        const user = await User.findOne({where : {email}})
        
        if (!user) return res.status(400).json({message: 'invalid email'})
            
        const resetToken = crypto.randomBytes(20).toString("hex")

        user.resetPasswordToken = resetToken
        user.resetPasswordTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000
    
        await user.save()

        const mailOptions = {
            from : process.env.MAIL_SENDER,
            to : email,
            subject : 'FORGOT PASSWORD',
            html : `<h1>Your link for reset password is</h1> ${process.env.CLIENT_URL}/reset-password/${resetToken}`
        }
        
        await transporter.sendMail(mailOptions);

        res.status(200).json({message: 'reset password link has been sent to your email'})
    }catch(err){
        console.error(err)
        return res.status(500).json({message: 'forgot password : server error'})
    }
}

exports.resetPassword = async(req, res) => {
    try {
        const {token} = req.params;
        const {newPassword} = req.body;

        const user = await User.findOne({
            where : {
                resetPasswordToken: token,
                resetPasswordTokenExpiresAt : {
                    [Op.gt] : Date.now()
                }
            }
        })

        if (!user) return res.status(400).json({message:'invalid or expired token'})
        
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        user.resetPasswordToken = ""
        user.resetPasswordTokenExpiresAt = null
        await user.save()
        
        const mailOptions = {
            from : process.env.MAIL_SENDER,
            to : user.email,
            subject : 'HELLO :)',
            html : `<h1>password has been reset successfully</h1>`
        }

        await transporter.sendMail(mailOptions);
        
        res.status(200).json({message: 'password has been reset successfully'})
    } catch (err) {
        console.error(err)
        return res.status(500).json({message: 'reset password : server error'})
    }
}


exports.checkAuth = async (req, res)=>{
    try {
        const user = await User.findOne({where : {id : req.userId}})
        
        if (!user) return res.status(401).json({message:"User is not authenticated"})

        res.status(200).json({message:"User is authenticated", user: `${user.username}`})
    } catch (error) {
        console.log("check auth : server error ", error)
        res.status(500).json({message: 'check auth : server error'})
    }
}