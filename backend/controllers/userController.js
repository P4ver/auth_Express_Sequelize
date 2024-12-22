const {User} = require('../models')

exports.createUser = async (req, res)=>{
    const {username, password, email} = req.body;
    try {
        const user = await User.create({username, password, email});
        res.status(200).json(user);
    }
    catch (error) {
        res.status(400).json({error: 'failed to create user', message: error.message});
    }
}

exports.getAllUsers = async(req, res)=>{
    try{
        const users = await User.findAll();
        res.status(200).json(users);
    }
    catch{
        res.status(500).send({message: 'server error : can\'t get all users'});
    }
}

exports.getUserById = async(req, res)=>{
    const {id} = req.params;
    try{
        const user = await User.findByPk(id);
        console.log("result id ",user)
        if(!user) return res.status(404).send({message: 'User not found'});
        res.status(200).json(user);
    }
    catch{
        res.status(500).send({message: 'server error : can\'t get user by id'});
    }
}