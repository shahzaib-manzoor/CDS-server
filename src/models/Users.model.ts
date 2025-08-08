import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email:{
    type: String,
    required: true,
    unique: true,
  },
  profile_url: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
    role: {
        type: String,
        required: false,
    },
    verified:{
        type: Boolean,
        required: true
    },
  password: {
    type: String,
    required: true,
  },
});

const Users = mongoose.model("Users", UserSchema);

export default Users;