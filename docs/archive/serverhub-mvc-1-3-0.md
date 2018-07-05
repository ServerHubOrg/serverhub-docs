---
sidebar: auto
collapsable: true
---
# ServerHub-MVC 1.3.0 Docs

## Controllers

Controllers are very important and extremely basic. Routed path will dispatch actions defined in each controller. In this article, we will discuss about controller composing and other essential parts you need to notice.

### Controller Composing

Here is a good example of `home.js` custom controller:

```js
"use strict";

return {
  index: function(req, res, method) {
    return this.View();
  },
  primary: function(req, res, method) {
    var context = this.View();
    context.name = "Ziyuan";
    return context;
  }
};
```

Controller files are plain but special JavaScript files. you must return an object providing **action functions** to ServerHub. So when ServerHub dispatching after routing, your custom controller actions can be invoked.

There are three primary paramters of a controller action method: _request_, _response_ and _method_. They are all required.

* **_request_** refers to the _IncomingMessage_ of Node.js.
* **_response_** refers to the _ServerResponse_ object of the request.
* **_method_** is a string and can be the following: GET, POST, PATCH, UPDATE, DELETE and PUT.

### Compile-time and Static Controllers

If you modify any controller files while ServerHub running, check if your browser will show you the latest modifications. There will be no effect when you refresh the web pages. ServerHub loads and registers controllers when the application first starts. And it will never automatically update these files. Not like views and models, ServerHub always cache and renew cached content for them. So that ServerHub can be both fast and stable.

So, never try to change controller files during ServerHub running.

### Controller Scope Variables

There are several variables that can be accessed inside controller actions. In order to use them, you must explicitly use pointer **_this_** as a reference to the controller instance. Or, there will be an error message displayed.

You are suggested to use **arrow functions** that accessible since ECMAScript 2015. Or, you may use some workaround to access to those variables (closure or something else).

#### Complete list of supported controller scope variables

Usage of these variables are avaliable at `doc/variables/{VariableName}.md`. Some variables that have primitive types like `string`, `number` etc. (as well as some reference to vanilla Node.js implementation) will not be doced, FYI.

* `this.View()` **_Function_** Returns the corresponding model file.
* `this.Runtime` **_Object_** Contains bunch of other runtime features.

  1.  `this.Runtime.DBProvider` **_Object_** A reference to initialized database provider instanced (default MySQL).
  1.  `this.Runtime.FileHelper` **_Object_** A reference to FileHelper object.
  1.  `this.Runtime.WAIT` **_boolean_** Force to hold connection until asynchronous operations done.

* `this.System` **_Object_** Provide bunch of readonly constants inside ServerHub instance.
  1.  `this.System.Version` **_string_** ServerHub version.
  1.  `this.System.NodeVersion` **_string_** Node.js version.
  1.  `this.System.Platform` **_string_** Platform information (win32, linux, etc.).
  1.  `this.System.Hardware` **_Object_** Bunch of information about hardware.
      * `this.System.Hardware.TotalMemory` **_number_** Installed memory size (byte).
      * `this.System.Hardware.FreeMemory` **_number_** Free memory size (byte).
      * `this.System.Hardware.NetworkInterfaces` **_Object_** Returns interfaces that have been assigned a network address.
  1.  `this.System.Die(exit_code)` **_Function_** Exit current ServerHub process.

### Actions in Controller

Actions are methods that been invoked when the HTTP request matches a certain route path. And it handles the request and operates on the response. In this chapter, we will discuss about actions in controller and help you learn more about ServerHub controllers.

#### How to compose an action

```js
index: function (request, response, method){
    // do something
    return this.View();
}
```

See, this is a very simple 'index' action. You need to declare the action as a function member of an object and return the object as the controller instance. One more thing, as we've mentioned a lot, you should always use 'this' pointer while referencing controller scope variables.

There are three parameters and they are all required. If you want to manually control server response by calling methods like `res.write()`, then ServerHub will ignore default render process, which means:

```js
index: function (request, response, method){
    response.write('Hello, XWZ');
    return this.View();
}
```

will only output 'Hello, XWZ' and the return value of 'index' action gonna be ignored.

The `request` parameter is the vanilla Node.js request (aka `IncomingMessage` object) (at version 0.0.7). But the `response` parameter is a virtual `ServerResponse` object. Several methods and properties are wrapped on that object, which are not exactly the same as the original one. Read the document before invoking. `Method` is a string that tells the current HTTP method (like GET, POST, etc).

#### Action name convention

Action names are all written in lower cases. Characters from 'a' to 'z', with numbers and '\_' (underscore) are allowed. There are several reserved action names that you cannot use: Runtime, System, Console, View.

The best practice are using single words as action names, and verbs are prefered. An action name with more 20 characters are pretty bad. And you should know that in later versions of ServerHub, maybe there will be an limitation of action name length, which might not run functional normally with your old-fashioned code.

### About Syntax

If you use some lint tools, ServerHub's controller file may report syntax errors. It could tell that "_return statement outside function_". But actually they are valid **partial** JavaScript files.

Controllers scripts are all **functions**, they are not independent JavaScript files. When you try to execute controller files directly, it is not gonna work.

Here is an example. We have a controller file like this (`home.js`):

```js
"use strict";

return {
  index: function(req, res, method) {
    return this.View();
  }
};
```

If you treat this `home.js` as a plain JavaScript file, there should be curly braces surrounding the return statement. Check this:

```js
"use strict";

function (){
    return {
        index: function(req, res, method) {
            return this.View();
        }
    }
}
```

Now, it is an absolute JavaScript file.

**But, do you remember that our controllers are all _functions_**? What does this mean? Your whole controller file is a function, and it has invisible boundries which are curly braces. So, if we manually add function definition to controller file, the loaded controller will be like:

```js
function (){
    "use strict";

    function (){
        return {
            index: function(req, res, method) {
                return this.View();
            }
        };
    }
}
```

As you can see, there is a redundant pair of function braces that should be removed. And this is why we call ServerHub controllers "partial JavaScript files".

---

## Database

Database is probably the next thing you really want to handle with after you set up the basic of the website. And ServerHub supports some of the most popular databases.

In this very first beta version of ServerHub, you can interact with MySQL (default) extremely easily with the controller scope variable: `this.Runtime.DBProvider`.

### An Easy-to-use Example

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

### Two Steps of Connecting to MySQL
Basically, there are two steps:

1. Get database provider object from `this.Runtime.DBProvider`. Don't forget to use `this` reference.
1. Get database connection with `db.GetConnection()` method. If you have already set up the configuration for database connection strings (in your entry file, like `app.js`), there are no required parameters. But if not, you must provide three parameters: `Host`, `Username` and `Password` (No need to explain more, hah?).

Now, you can handle with MySQL database.

### A More Common Way
Since ServerHub MVC v1.0.3 imported module syntax, you now have the ability to import/require your favorite packages/modules to build a stronger application. You may not need ServerHub's way of accessing databases, but you are always suggested to controller scope variables due to a better integration.

---

## Plugin

::: tip TIP
avaliable since v1.0.0-beta
:::

As ServerHub is the foundation of a web server, if you start everything from scratch, then you have to handle with plenty of very basic operations. Just because ServerHub automatically route requests to the corresponding handlers (controllers or static cache), you cannot operate on everything seperately. How about doing something right before routing? Like authentication or filtering. And how about doing something after routing? Like triggering a statistic listener that help you analysis system performance.

Here, we introduce "plugin" to you. Instructions in this document is pretty simple, but don't miss the chance to build your own plugin!

### Plugin hooks

Let's see a picture first. (Tips: right click on the image and choose "open image in new tab" to view high definition image)

![plugin](/assets/serverhub-module-plugin-sequence.png)

So, when an HTTP request enters ServerHub, it will be handled with ServerHub core module. Then the first phase of plugins will be activated. After all of them successfully go through the data, ServerHub will call route functions to generate a corresponding `RouteResult`, which contains information about how the request should be handled (where, who). Next, the other phase of plugins will be activated to operate on the data.

The two phase of plugins are **before-route** plugin and **after-route** plugin.

Before-route plugins usually do not care about where will the request be sent to with route. It can do some global operations like authentication. After-route plugins usually concentrate on one specific kind of different request types. Some receive requests for controllers while others focus on handling cache-able static resources.

### How to compose a plugin

A plugin is exactly a Node.js module. It has to obey all the rules for Node.js modules. But here are some limits:

* A valid plugin must have at least the following properties:

  * `app_name` A unique name for your plugin. All the letters must be in lower cases. Valid ones include alphanumeric characters and single dashes, eg: serverhub-plugin-my-filter (the serverhub-plugin- prefix is required).
  * `version` Version tag for your plugin. Suggested to follow NPM custom.
  * `version_support` Indicates the least version of ServerHub to run the plugin.
  * `phase` Whether this is a after-route or before-route plugin.
  * `main` Entry function for your plugin. For before-route plugins, 2 parameters are required; for after-route plugins, 3 parameters are requried.

* Here is an example

```js
module.exports = {
  app_name: "serverhub-plugin-my-plugin",
  version: "0.1.0",
  version_support: "1.0.0-alpha",
  phase: "before-route",
  main: function(req, res) {
    console.log("Hello, this is my first ServerHub plugin!");
  }
};
```

### Important things to remember

::: warning Keep this in mind:
**NEVER try to modify response parameter passing to your plugin `main` function!**
:::


---

## Route

Route is one of ServerHub's core features. With route, all HTTP request can be filtered and send to correct handlers. For example, `/index.html` might be a static webpage, but `/home/index` could be a controller URL. ServerHub's route system provide two ways to deal with it. One is called positive rules and the other one is called negative rules.

### Positive rules

Positive rules looks like JavaScript string formatting. There are several '{' and '}' symbols in the rule content. Between each pair of parenthess lies the segment name of rule syntax. Valid segment names are: controller, action and id. For example: `"api/{controller}/{action}/{id}"`.

Prefix `api` is a normal string. Every request that matches the rule should start with this prefix.

`controller` is the name of controller, which is right the name of the controller file.

`action` is the function property defined in controller scripts.

Here we have some examples (assuming that you have home controller with index/info actions in your project):

```
Valid request path:
  /api/home/index
  /api/home/info/
  /api/home/index/5
  /api/home/index/5?name=xu_wangzhe
  /api/home/index/?name=xu_wangzhe

Invalid request path:
  /home/index
  /api/home/index.html
  /api/home/5
  /api/index/5?name=xu_wangzhe
  /api/home-foo/index/?name=xu_wangzhe
```

Request paths that does not match the route rule will be treated as requests to static resources.

But how to set positive rule? Look at this:

```js
route => {
  route.MapRoute("default", "v1/{controller}/{action}/{id}");
};
```

Pass this annoymous function as the second parameter of `instance.Run()` method.

### Negative rules

**Negative rules are checked ahead of any positive rules**. If any request path matched any negative rule, it will immediately be treated as static resources.

Negative rules support **both** string rule definition and regular expressions. An array is used to contain all the rules needed.

Here are three examples:

#### String rule example

```js
route.IgnoreRoute(["/language/all"]);
```

As you can see. The `language` controller may have `english` and `chinese` actions, but `all` is not an action. If we don't ignore this route, ServerHub will try to seek for action named `all`, which will fire an exception. So, we use this string rule to ignore specific request path.

One thing that you should know about string negative route rule is: your rules should always start with '/'.

#### Regular expression example
What if want to ignore all routes that start with "no-route"? Should we write every possibilities? Of course, that is not possible. So we use the regular expression above to ignore all request with prefix "no-route" (upper-case or lower-case)

```js
route.IgnoreRoute([/^\/no-route.*$/i]);
```


#### Multiple negative rules

```js
route.IgnoreRoute(["/language/all", /^\/no-route.*$/i]);
```

### Search/Query in URL

According to [RFC 1738](https://tools.ietf.org/html/rfc1738), a valid search in URL is defined as follows:

```rfc
search         = *[ uchar | ";" | ":" | "@" | "&" | "=" ]
uchar          = unreserved | escape
unreserved     = alpha | digit | safe | extra
alpha          = lowalpha | hialpha
lowalpha       = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" |
                 "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" |
                 "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" |
                 "y" | "z"
hialpha        = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" |
                 "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" |
                 "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z"
digit          = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" |
                 "8" | "9"
safe           = "$" | "-" | "_" | "." | "+"
extra          = "!" | "*" | "'" | "(" | ")" | ","
escape         = "%" hex hex
hex            = digit | "A" | "B" | "C" | "D" | "E" | "F" |
                 "a" | "b" | "c" | "d" | "e" | "f"
```

More specificly, ServerHub allows:

* `?` as the start of a search/query.
* Identifier before `=` is used as search key.
* Identifier after `=` is used as search value.
* Search items use `&` as delimiter.

Please always obey the above rules, later versions of ServerHub might eable "strict mode" to force ignore search/query with invalid characters.

---

## Run() Module Method

### ServerHub.Run()

[View this](/tutorial/getting-started.html#usage). This chapter includes brief introduction of ServerHub instance Run() method.

### Instance.Run() Configuration

The other day, I introduced `instance.Run()` method to you. And in this chapter, we will talk about the first parameter of `instance.Run()` method - the configuration object.

#### As simple as possible

Not like what we've seen in [Usage](/tutorial/getting-started.html#usage) chapter, the configuraton object is much too complicated. And in fact, there is only one property that is required: `BaseDir`.

`BaseDir` is the root path of server, which will be used during the whole life circle of your ServerHub application. If your current entry file, such as `app.js`, is just located in the directory that you want to use as server root. Then the value should be `__dirname`, which is a global variable of Node.js.

This is the simplest configuration that can make ServerHub work functional normally.

#### Other properties

To customize ServerHub, you need some extra configurations.

##### WebDir

`WebDir` is website directory. Your page files, contents, scripts and assets should be put in this directory. ServerHub uses "www/" as its default value. If you want to set up a new website root directory, create a folder and pass its name to `WebDir` property.

##### ControllerDir

We all know that ServerHub routes request to controllers. If we want them to be registered, we have to provide the contain directory name to ServerHub. The path of controller directory should be relative to server root path. If you don't specify one, the default value will be "controller/".

##### Controllers

Sometimes, we don't want to register every controller in the contain folder. Then we can pass an array of required controller file name to this parameter. eg: `['home.js', 'data.js']`. But if you want all controller files to be registered, just ignore `Controllers` property and ServerHub will automatically scan and register every file under `ControllerDir`.

##### ViewDir and ModelDir

Pretty similar to `ControllerDir` in previous section. They are used to hold view files and models.

##### DBProvider

Specify your database provider. In current version, ServerHub only supports MySQL, which means the only valid value would be "mysql".

##### DBConnectionString

If you have only one database instance to connect, the suggested way is to pass a global database connection string to ServerHub. Because if you don't, you will have to provide a value every time you call `GetConnection()` method on your database provider.

##### MaxCacheSize

This specifies how much memory can ServerHub caching system allocate. If file sizes exceeded this limit, then ServerHub will call WCS to unload some unnecessary caches. This will be covered in later chapters.

##### DefaultPages

ServerHub uses a fallback strategy for default pages. And your default page file must be put under the root of `WebDir` directory. In default, ServerHub uses "index.html" first, then "default.html" and finally "page.html". You can override this configuration by passing an array like `['hello.html', 'first.html']` to this property.

##### PageNotFound `v0.0.93+`

When the request does not match any resources or route rules, ServerHub will render an error page to the response. From v0.0.93, you can add your custom error page to ServerHub server directory and specify with this property.

More property definitions are coming soon.

##### AsyncOperationTimeout `v0.0.97+`

In `v0.0.96`, we introduced `this.Runtime.WAIT` signal to be the workaroud for some time consuming asynchronous operations, such as database query etc. But you should know this signal is pretty dangrous. What if you `forget` to set false to it or the operation takes too much time and dead before callback? So, ServerHub has to count down as a backup operation if it cost too much time. The default value is 10 seconds. If you want it to be shorter or longer, just pass the value to the configuration parameter.(Unit: **milliseconds**)

##### TLSOption `v1.0.6+`

Since `v1.0.6`, ServerHub enhanced security with TLS/SSL. You may secure the connection with a `TLSOption` property. This property has four sub-properties: `Key: string, Cert: string, CA: string`x and `Port: Array<string>|Array<number>|number|string`. You need to load your private key and certificate files and assign their values to the properties above. And most importantly, you need to specify the port you want to secure.

Here is a [tutorial](/tutorial/tls-tutorial.html) help you with TLS in ServerHub MVC.
