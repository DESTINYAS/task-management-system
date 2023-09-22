Task Management System
Welcome to my  Task Management System! This system is designed basically to do the following
which includes :
(1) Register users
(2) Login in users
After successful registration ang login, users can do the following on the app
(3) Fetch all tasks
(4) Fetch a specific task by id
(5) Update a specific task by id
(6) Delete a specific task by id

Installation and Usage
(1) Clone the repository: git clone https://github.com/DESTINYAS/task-management-system.git
(2) Navigate to the project directory: cd task-management-system
(3) Install dependencies: npm install
(4) Create a .env file and add MONGODB_URI and SECRET as indicated in the .env.copy file.
(5) You can then run the application using: npm start
(6) Once the application is running you can access it on your browser via http://localhost:3000
(8) Once the application is running you can access the API swagger documentation on your browser via http://localhost:3000/api/  

Note
(1) The hosted application can be reached on https://task-management.cyclic.cloud/. and the swagger url can be reached on https://task-management.cyclic.cloud/api
(2) The site was designed with Nodejs and Express so you must have nodejs installed to run it.
(3) A registered user can only get and perform operations on the task he or she created
(4)  The swagger documentation may not work as required because am rendering html pages as response.
