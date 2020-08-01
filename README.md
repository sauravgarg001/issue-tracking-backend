# Issue Tracking Tool
> Tool for reporting and assigning an issue, dicussing it others and serach for pervious or ongoing issues.
## Table of contents
* [Files and architecture](#files-and-architecture)
* [Environment](#environment)
* [Installation](#installation)
* [Functionality](#functionality)
* [Technologies](#technologies)
* [Authors](#authors)
* [Important links](#Important-links)
* [References](#references)

## Files and architecture

* Frontend - Angular
    * Modules
        * dashboard
        * list
        * user
        * app
    *  components
        * dashbaord - to show list of all assigned and reported issues by user with filters and sort functionality
        * issue - to create, update and display issue with comments
        * list - to show list of all issues with filters and sort functionality
        * navbar - to handle navbar items like notifications
        * login - to login and forgot password of user's account
        * signup - to create a new account
    * services
        * app - call all api's related to user
        * issue - call all api's related to user's issue
        * issues - all all api's related to issues
        * socket - to emit and listen to events for RTC(Real Time Communication)
* Backend - Node.js
    * config - Redis, Mail, MongoDB and other configurations
    * controllers - contains function for each route
        * issueController - contains bussiness logic for issues document CRUD operation
        * userController - contains business logic for user document CRUD operation
    * libs - libraries
        * checkLib - contains utility functions
        * loggerLib - contains functions related to logger module
        * mailLib - contains functions related to mail
        * passwordLib - contains functions related to bcryptjs module
        * redisLib - contains functions related to redislabs
        * responseLib - contains functions related to api Response to client
        * socketLib - contains events related to socket.io module
        * timeLib - contains functions related to moment module
        * tokenLib - contains functions related to JWT
        * validationLib - contains functions related to backend validation
    * middlewares - for checking authorization and error handling
    * models - Database Models and schemas
        * Auth - to keep track of loginned users
        * Issue - defines Issue Model 
        * User - defines User Model
    * routes - api routes
        * index - handle global routes
        * issue - handle issue related routes
        * user - handle issue related routes
    * app.js - connection and imports

## Environment

* [Angular](https://angular.io/guide/setup-local)
* [Node.js](https://nodejs.org/dist/v12.18.0/node-v12.18.0-x64.msi)
* [MongoDB](https://fastdl.mongodb.org/win32/mongodb-win32-x86_64-2012plus-4.2.7-signed.msi)

## Installation

1. Clone or [Download Zip](https://github.com/sauravgarg001/TODO-list-backend.zip) 
```
git clone https://github.com/sauravgarg001/issue-tracking-backend.git
```
2. Goto issue-tracking-backend directory
```
cd issue-tracking-backend
```
3. Install all dependencies
```
npm install
```
4. [Signup](https://redislabs.com/try-free/) and [Login](https://app.redislabs.com/#/login) on redislabs.com

5. Create database and copy Endpoint and Redis Password, update the given info in *config/configApp.js* file.
```
redis: {
        url: 'redis://<endpoint>',
        password: '<redis password>'
    }
```
6. Run server
```
npm start
```
7. Open given below url on browser
```
http://localhost:3000/
```
8. Clone or [Download Zip](https://github.com/sauravgarg001/issue-tracking-frontend.zip) 
```
git clone https://github.com/sauravgarg001/issue-tracking-frontend.git
```
9. Goto issue-tracking-frontend directory
```
cd issue-tracking-frontend
```
10. Install all dependencies
```
npm install
```
11. Run server
```
ng serve
```
12. Open given below url on browser
```
http://localhost:4200/
```

## Functionality

* User can signup and create account and then login to dashboard
* Forgot password option can be used in case the user doesn't remember password. An OTP is send to the registered email of user. After entering the correct OTP and new password the passsword gets changed.
* The Dashboard is personalized according to each user with tabs of issues assigned and reported by him/her.
* The table of issues can be filtered using search or sorted according to each column.
* The table is paginated with maximum 10 rows and after clicking on any one it redirects to Issue Description View
* The Issue Description View has options to update issue, add attachments and comment
* Once an issue is marked as watch, the user will be notified whenever there is any update in that issue.
* All the unread notifications are visible as dropdown menu in navbar. Clicking on any notification will redirect the user to the issue.
* Whenever the user views any issue, the unread notifications of the particular issue are marked as read. There is also a special option to mark as notification as read at th navbar.
* All the operation performed by user will be visible to other in real time.

## Technologies

* [Node.js](https://nodejs.org/en/) - JavaScript runtime
* [Angular](https://angular.io/guide/setup-local) - Frontend JavaScript Framework
* [JavaScript](https://www.javascript.com/) - Programming language
* [MongoDB](https://www.mongodb.com/) - NoSQL database

## Authors

* **Saurav Garg** - *Initial work* - [sauravgarg001](https://github.com/sauravgarg001)


## Important links

* [API Documentation](http://ec2-54-167-94-143.compute-1.amazonaws.com:3000/apidoc/)
* [Socket Endpoints Documentation](http://ec2-54-167-94-143.compute-1.amazonaws.com:3000/eventdoc/)
* [Github repository for frontend](https://github.com/sauravgarg001/issue-tracking-frontend)
* [Github repository for frontend build version](https://github.com/sauravgarg001/issue-tracking-angular)
* [Github repository for backend](https://github.com/sauravgarg001/issue-tracking-backend)
* [Hosted app on AWS](http://ec2-54-167-94-143.compute-1.amazonaws.com)


## References

* Count subdocument array with conditional field: https://stackoverflow.com/questions/46339175/mongodb-aggregation-conditional-adding-field-based-on-value-in-array
* Symmetric difference of two sorted array: https://www.geeksforgeeks.org/symmetric-difference-two-sorted-array/
* To filter Subarray: https://docs.mongodb.com/manual/reference/operator/aggregation/filter/
* Font Awesome 5: https://github.com/FortAwesome/angular-fontawesome
* Check if two arrays are equal or not: https://www.geeksforgeeks.org/check-if-two-arrays-are-equal-or-not/
* Call a function on every route change: https://stackoverflow.com/questions/42453375/how-to-call-a-function-on-every-route-change-in-angular2
