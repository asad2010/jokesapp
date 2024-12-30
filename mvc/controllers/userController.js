const bcrypt = require('bcrypt');
const Users = require('../models/userModel')


const userCtrl = {
    getUser: async(req,res)=> {
        const {id} = req.params;
        try { 
            const user = await Users.findById(id);
            if(user) {
                const {password, ...other} = user._doc;
                return res.status(200).json(other);
            }
        } catch(err){
            res.status(500).json({message: err.message});
        }
    },
    getAllUsers: async(req,res)=>{
        try {
            const users = Users.find();
            if(users) {
                let users = await Users.find();
                    users = users.map(user => {
                        const {password, ...otherDetails} = user._doc;
                        return otherDetails
                    })

                return res.status(200).json(users);
            }
        } catch(err){
            res.status(500).json({message: err.message});
        }
    }

}

module.exports = userCtrl;