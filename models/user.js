import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    fullName:String,
    username:String,
    password:String,
    email:String,
})

const User = mongoose.model("User", userSchema);

export default User;