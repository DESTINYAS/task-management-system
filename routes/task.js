const express = require('express');
const { body } = require('express-validator');
const { getTasks, getTaskById, createTask ,updateTask,deleteTask} = require('../controllers/task');
const{loginPage}=require('../controllers/auth')
const isAuth = require("../middleware/is_Auth");
const router = express.Router();


// Validation for task creation
const validateTask = [
  body('title').trim().isLength({ min: 1,max:100 }).withMessage('Title is required and must be between 1 and 100 characters in length'),
  body('description').trim().isLength({min:5, max: 1000 }).withMessage('Description is required and must be between 5 and 1000 characters'),
];

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Retrieve a list of tasks
 *     responses:
 *       200:
 *         description: A list of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *      
 */
router.get('/tasks', isAuth, getTasks);

/**
 * @swagger
 * /tasks:
*   post:
 *     summary: Create a new task
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task created successfully
 *       400:
 *         description: Validation error
 */
router.post('/tasks', isAuth, validateTask, createTask);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Retrieve a task by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the task to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A task
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 */
router.get('/tasks/:id', isAuth, getTaskById);

/**
 * @swagger
 * /updaTtask/{id}:
 *   post:
 *     summary: Update an existing task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the task to update
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Task not found
 * 
 */
router.post('/updateTask/:id', isAuth, validateTask, updateTask);

/**
 * @swagger
 * /deleteTask/{id}:
 *   post:
 *     summary: Delete an existing task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the task to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 */
router.post('/deleteTask/:id', isAuth, deleteTask);

// Get default landing page
router.get("/",loginPage)

module.exports = router;
