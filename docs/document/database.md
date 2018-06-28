# Database

Database is probably the next thing you really want to handle with after you set up the basic of the website. And ServerHub supports some of the most popular databases.

In this very first beta version of ServerHub, you can interact with MySQL (default) extremely easily with the controller scope variable: `this.Runtime.DBProvider`.

## An Easy-to-use Example

Let's begin with an example (MySQL):

```js
"use strict";

module.exports = {
    index: function (req, res, method) {
        let db = this.Runtime.DBProvider;
        let conn = db.GetConnection({
            Host: "localhost",
            Username: "devchache",
            Password: "ziyuan"
        });

        conn.connect(err => {
            if (err) throw err;
            this.Console.log("Connected!");
        });

        return this.View();
    }
};
```

This is a classic controller script file with 'index' action. Inside the action method, you can see how easily you can interact with MySQL database.

## Two Steps of Connecting to MySQL
Basically, there are two steps:

1. Get database provider object from `this.Runtime.DBProvider`. Don't forget to use `this` reference.
1. Get database connection with `db.GetConnection()` method. If you have already set up the configuration for database connection strings (in your entry file, like `app.js`), there are no required parameters. But if not, you must provide three parameters: `Host`, `Username` and `Password` (No need to explain more, hah?).

Now, you can handle with MySQL database.

## A More Common Way
Since ServerHub MVC v1.0.3 imported module syntax, you now have the ability to import/require your favorite packages/modules to build a stronger application. You may not need ServerHub's way of accessing databases, but you are always suggested to controller scope variables due to a better integration.