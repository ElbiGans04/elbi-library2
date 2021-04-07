# Elbi-library2
This library management application written in the node js programming language and takes less than 2 months to complete has the following features:
* Forgot the password
* has 3 roles, namely: root, librarian and admin
* CRUD users, book, officers, group
* rent books
* calculate the delay in returning the book
* view user and transaction details
* get a report on the results of transactions in ms excel format
* gets corrupted book report in ms excel format


# What materials do i use?
* Template :  https://startbootstrap.com/theme/sb-admin-2
* Template Engine : Pug
* Programming Language : Node js
* Framework : Express js
* other : sequelize, multer, jwt, pug dll


# How To instal
### Requirements :

* **make sure you have installed the node on your computer**

##### First : 
please download first or fork this repository. then open a command prompt and navigate to this folder.

##### Then type command : 

```
npm install
```

it will automatically install the required modules.
##### Then please enter the command : 
```
npm audit fix
```

it is useful to prevent modules that are not installed properly / fail to install
##### after that we have to create an .env file with the following values : 
```
APP_USER= [your dbms username]
APP_PASSWORD= [your dbms password]
APP_HOST= [your host]
APP_DIALECT= [your dialect]
APP_DATABASE= [your database name]
APP_DB_PORT= [your dialect port]
PORT=3000
```

and save it in the config folder `/elbi-library2/config/[here]`.


##### The next step, please enter the command : 
```
node generatePrivAndPubKey.js 
```

This function is to add a private key and a public key to the .env file.
**please run this command only once and make sure you have created an .env file in the config folder**

##### If the database has not been created, enter the command : 
```
npx sequelize db:create
```

This command is used to create a database

##### The next step, please enter the command. : 
```
npx sequelize db:migrate
```
This is useful for creating tables and making associations between tables

##### The next step, please enter the command. : 
```
npx sequelize db:seed:all
```

This command is used to create sample data

##### Edit account to send email forgot password

open the mailer file in `/elbi-library2/middleware/mailer.js`
then change your email and password according to your account.

##### After all that, please enter the command : 
```
npm start
```

web is now up and running according to the port set in .env (default port 3000)

##### Account 
* email : root@gmail.com 
  password : 123
  role: root
* email : rhafaelbijaksana04@gmail.com 
  password : 123
  role: librarian
* email : admin@gmail.com
  password: 123
  role: admin
