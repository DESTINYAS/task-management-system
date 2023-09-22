const bcrypt = require('bcryptjs');
const User = require("../models/user"); //Import the User Model
const Task = require("../models/task"); //Import the User Model

const { validationResult } = require('express-validator');//Require Express validator

// User Registration logic
exports.register= async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("error", "Please provide valid credentials and a strong password");
        return res.redirect("/auth/register")
    }
    try {
      // Check if the username already exists
      const existingUser = await User.find({ email: req.body.email })
      console.log(existingUser.length)
      if(existingUser.length>0){
        req.flash("error", "Email already exist.");
        return res.redirect("/auth/login")
}

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
      req.flash("error", "User registered successfully.Please Login");
      return res.redirect("/auth/login")
        
    }
      console.log(savedUser)
    } catch (error) {
      console.error('Error registering user:', error);
      req.flash("error", "Network error please try again");
      return res.redirect("/auth/register")
    }
  };

//   User login logic
  exports.login=async (req, res, next) => {
    const errors = validationResult(req);
    const password =req.body.password
    const email =req.body.email
  
    if (!errors.isEmpty()) {
      req.flash("error", "Invalid login credentials.");
    return res.redirect("/auth/login")
    }
    try {
      // Check if the user exists
      const user = await User.find({ email: email })
      console.log(user)
      const hashedPassword=user[0].passwordHash
        console.log(hashedPassword)
      if(!user){
        req.flash("error", "User does not exist.");
        return res.redirect("/auth/register")
        }
  
      const validPassword = await bcrypt.compare(password, hashedPassword);
  
      if (validPassword) {
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save()
        const tasks = await Task.find({ createdBy: req.session.user})
         return res.render("tasks",{ errorMessage: req.flash("error"),tasks})
      }
  
      req.flash("error", "Wrong password.");
    return res.redirect("/auth/login")
    } catch (error) {
      console.error('Error logging in user:', error);
      req.flash("error", "Network error Please try again.");
        return res.redirect("/auth/login")
    }
  };

  exports.loginPage = (req, res, next) => {
   return res.render("login",{ errorMessage: req.flash("error")});
  };
  exports.registerPage = (req, res, next) => {
    return res.render("register",{ errorMessage: req.flash("error")});
  };
  

//   User logout logic
  exports.getLogout = (req, res, next) => {
    req.session.destroy((err) => {
      console.log(err);
     return res.redirect("/auth/login");
    });
  };
  