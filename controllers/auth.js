const bcrypt = require('bcryptjs');
const User = require("../models/user"); //Import the User Model
const Task = require("../models/task"); //Import the User Model

const { validationResult } = require('express-validator');//Require Express validator

// User Registration logic
exports.register= async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // Check if the username already exists
      const existingUser = await User.find({ email: req.body.email })
      if(existingUser.length>0){
        return res.redirect("/auth/login");}

      const email=req.body.email
      const password=req.body.password
      const saltRounds = 10;

      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const user = new User({
        email: email,
        passwordHash: hashedPassword,
      });
     const savedUser = user.save()
    if(savedUser){
      return res.render("login")}
      console.log(savedUser)
    } catch (error) {
      console.error('Error registering user:', error);
      return res.render("register")
    }
  };

//   User login logic
  exports.login=async (req, res, next) => {
    const errors = validationResult(req);
    const password =req.body.password
    const email =req.body.email
  
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // Check if the user exists
      const user = await User.find({ email: email })
      console.log(user)
      const hashedPassword=user[0].passwordHash
        console.log(hashedPassword)
      if(!user){
        return res.redirect("/auth/register");}
  
      const validPassword = await bcrypt.compare(password, hashedPassword);
  
      if (validPassword) {
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save()
        const tasks = await Task.find({ createdBy: req.session.user})
         return res.render("tasks",{tasks})
      }
  
      res.status(401).json({ message: 'Invalid password' });
    } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  exports.loginPage = (req, res, next) => {
   return res.render("login");
  };
  exports.registerPage = (req, res, next) => {
    return res.render("register");
  };
  

//   User logout logic
  exports.getLogout = (req, res, next) => {
    req.session.destroy((err) => {
      console.log(err);
     return res.redirect("/auth/login");
    });
  };
  