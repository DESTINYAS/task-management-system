const { validationResult } = require('express-validator');//Require express validator
const  Task  = require('../models/task');//Import Task model

// Fetch all tasks already created
exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ createdBy: req.session.user[0]._id });
    res.render('tasks', { tasks });
  } catch (error) {
    console.log('Error fetching tasks:', error);
    return res.redirect("/auth/login")
  }
};

// Fetch a single task by ID
exports.getTaskById = async (req, res, next) => {
  const taskId = req.params.id;
  try {
    const task = await Task.findOne({ _id: taskId, createdBy: req.session.user[0]._id });
    if (!task) {
      return res.status(404).json({ message: 'Task with ID : '+taskId+ ' not found' });
    }
    res.render('task', { task });
  } catch (error) {
    console.error('Error fetching task:', error);
    return res.redirect("/auth/login")
  }
};

// Create a new task
exports.createTask = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
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
    return res.render("tasks",{tasks})
  } catch (error) {
    console.error('Error creating task:', error);
    res.redirect("/auth/login")
  }
};

// Update an existing task by ID
exports.updateTask = async (req, res, next) => {
    const title =req.body.title
    const description =req.body.description
  const taskId = req.params.id;
  try {
    let task = await Task.findOne({ _id: taskId, createdBy: req.session.user[0]._id });
    if (!task) {
      return res.status(404).json({ message: 'Task with ID '+ taskId + ' not found' });
    }
    task.title = title;
    task.description = description;
    await task.save();
    return  res.redirect("/tasks")
  } catch (error) {
    console.error('Error updating task:', error);
    return  res.redirect("/auth/login")
  }
};

// Delete an existing task by ID
exports.deleteTask = async (req, res, next) => {
  const taskId = req.params.id;
  try {
    const task = await Task.findOne({ _id: taskId, createdBy: req.session.user[0]._id });
    if (!task) {
      return res.status(404).json({ message: 'Task with ID '+ taskId + ' not found' });
    }
    await Task.findByIdAndRemove({_id:taskId})
    // const tasks=Task.find({createdBy:req.session.user[0]._id})
    return res.redirect("/tasks")

  } catch (error) {
    console.log(error)
    res.redirect("/auth/login")
  }
};
