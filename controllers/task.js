const { validationResult } = require('express-validator');//Require express validator
const  Task  = require('../models/task');//Import Task model

// Fetch all tasks already created
exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ createdBy: req.session.user[0]._id });
    res.render('tasks',{ errorMessage: req.flash("error"),tasks });
  } catch (error) {
    req.flash("error", "Please login to access your tasks.");
    return res.redirect("/auth/login")
  }
};

// Fetch a single task by ID
exports.getTaskById = async (req, res, next) => {
  const taskId = req.params.id;
  try {
    const task = await Task.findOne({ _id: taskId, createdBy: req.session.user[0]._id });
    if (!task) {
        req.flash("error", "Task Not Found.");
      return res.redirect("/tasks");
      
    }
    res.render('task', { errorMessage: req.flash("error"), task });
  } catch (error) {
    console.error('Error fetching task:', error);
    req.flash("error", "Error Fetching tasks.");
      return res.redirect("/auth/login");
  }
};

// Create a new task
exports.createTask = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("error", "Task title(must be betwee 1 to 100 characters long) and tast description must be tetween 5 to 1000 characters long.");
      return res.redirect("/tasks");
  }
  const title = req.body.title;
  const description = req.body.description;
  const userId=req.session.user[0]._id
  console.log(req.session.user[0]._id)
  try {
    const task = new Task({
      title: title,
      description: description,
      createdBy: userId,
    });
    console.log(task)
    await task.save();
    const tasks=await Task.find({createdBy:req.session.user[0]._id})
    return res.redirect("/tasks")
  } catch (error) {
    console.error('Error creating task:', error);
    req.flash("error", "Not authenticated.");
      return res.redirect("/auth/login");
  }
};

// Update an existing task by ID
exports.updateTask = async (req, res, next) => {
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("error", "Task title(must be betwee 1 to 100 characters long) and tast description must be tetween 5 to 1000 characters long.");
      return res.redirect("/tasks");
  }
    const title =req.body.title
    const description =req.body.description
  const taskId = req.params.id;
  try {
    let task = await Task.findOne({ _id: taskId, createdBy: req.session.user[0]._id });
    if (!task) {
        req.flash("error", "Task not found.");
        return res.redirect("/tasks");
    }
    task.title = title;
    task.description = description;
    await task.save();
    return  res.redirect("/tasks")
  } catch (error) {
    console.error('Error updating task:', error);
    req.flash("error", "Not Authenticated.");
    return  res.redirect("/auth/login")
  }
};

// Delete an existing task by ID
exports.deleteTask = async (req, res, next) => {
  const taskId = req.params.id;
  try {
    const task = await Task.findOne({ _id: taskId, createdBy: req.session.user[0]._id });
    if (!task) {
        req.flash("error", "Task not found.");
        return res.redirect("/tasks");;
    }
    await Task.findByIdAndRemove({_id:taskId})
    return res.redirect("/tasks")

  } catch (error) {
    console.log(error)
    req.flash("error", "Invalid login crendentials.");
   return res.redirect("/auth/login")
  }
};
