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
##### First : 
please download first or fork this repository. then open a command prompt and navigate to this folder.

##### Then type command : 

```
npm instal
```

it will automatically install the required modules.

after that we have to create an .env file with the following values : 
```
APP_USER= [your dbms username]
APP_PASSWORD= [your dbms password]
APP_HOST= [your host]
APP_DIALECT= [your dialect]
APP_DATABASE= [your database name]
APP_DB_PORT= [your dialect port]
PORT=3000
APP_PUBLIC_KEY="-----BEGIN RSA PUBLIC KEY-----\n[Replace this with your public key]\n-----END RSA PUBLIC KEY-----\n"
APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n[replace this with your private key]\n-----END RSA PRIVATE KEY-----\n"
```

and save it in the config folder `/elbi-library2/config/[here]`.


##### If the database has not been created, enter the command : 
`npx sequelize db:create`

This command is used to create a database

##### The next step, please enter the command. : 
`npx sequelize db:seed:all`.

This command is used to create sample data
##### After all that, please enter the command : 
`npm start`

web is now up and running according to the port set in .env (default port 3000)




