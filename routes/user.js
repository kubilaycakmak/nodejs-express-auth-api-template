import express from 'express';
import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      fullName: req.body.fullName,
      username: req.body.username,
      email: req.body.email,
      password: hash,
    });

    User.findOne({email:req.body.email}).then(user1=>{
      if(user1){
        return res.status(401).json({
          message: "User Already Exist!"
        })
      }

      user.save().then(result => {
        if(!result){
          return res.status(500).json({
            message: "Error when creating user"
          })
        }
        res.status(201).json({
          message: "User created!",
          result: result
        });
      })
    })   
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });;
  })
});
router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({email:req.body.email}).then(user=>{
    if(!user){
      return res.status(401).json({
        message: "Auth failed no such user"
      })
    }

    fetchedUser=user;

    return bcrypt.compare(req.body.password, user.password);

  }).then(result=>{
    console.log(fetchedUser)
    if(!result){
      return res.status(401).json({
        message: "Auth failed inccorect password"
      })
    }
    const token = jwt.sign(
      { email: fetchedUser.email, userId: fetchedUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
    res.status(200).json({
      token: token,
      expiresIn: 7200,
      userId: fetchedUser._id
    });
  })
  .catch(e=>{
    console.log(e)
  })
});
router.get("/:id",
  async (req, res, next) => {
    await User.findOne({ username: req.params.id}).then((user) =>{
      if(!user){
        return res.status(404).json({
          message: "User could not found."
        })
      }

      return res.status(200).json({
        message:"User found!",
        user:user
      })
    })
});
router.delete("/:id",
  async (req, res, next) => {
    await User.findOneAndRemove({ username: req.params.id}).then((user) => {
      if(!user) {
        return res.status(404).json({
          message: "User could not found."
        })
      }else{
        return res.status(200).json({
          message:"User deleted from db successfully!",
          user:user
        })
      }
    })
});

export default router