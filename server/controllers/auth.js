import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTER USER */
/*register is an async function because it is interacting with mongoDB*/
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;
    //we're gonna use this salt to encrypt our password.
    //Dono lines ka explanation - Salting me hum kuch additional characters add karte h fir password ko hash karte h.
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,//we are storing the hashed password.
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    //this will save newUser to the database.
    const savedUser = await newUser.save();
    //savedUser me humko data mil tha h naye created user ka. Jo hum frontend pe bhej rhe h.
    //201 ka matlb h successfully created. 
    res.status(201).json(savedUser);
  } catch (err) {
      //500 means internal server error. 
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //with findOne method, mongoose finds the one with email id == email in the mongodb.
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exist. " });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    //hum user password delete kar rhe h kyuki hum uska password json format me nhi bhejna chahte(agli llne me dekho).
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};