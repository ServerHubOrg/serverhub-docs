# Getting Started

In this tutorial, you will learn how to build a simple website with the help of ServerHub

## Install

On your project directory, run:

```bash
npm i --save serverhub-mvc
```

## Usage

Here is an example directory for ServerHub web server. (You can generate such a demo with serverhub-cli tool on npm)

```js
demo_directory/
├─ controller/
│  ├─ home.js
├─ model/
│  ├─ home.json
├─ view/
│  ├─ home.html
└─ www/    // web directory
│   ├─ global.js
│   ├─ global.css
│─ app.js    // entry of server
```

Now, we need to do some modification to `app.js`.

### Set up configurations

In your `app.js`, you will probably see the following code:

```js
const serverhub = require("serverhub-mvc");
const fs = require("fs");
const path = require("path");

serverhub.Run(
  {
    BaseDir: __dirname,
    WebDir: "www/",
    Controllers: ["home.js"],
    MaxCacheSize: 256 // unit: MB
  },
  route => {
    route.MapRoute("default", "{controller}/{action}/{id}", {
      Controller: "home",
      Action: "index",
      id: ""
    });
  }
);
```

`Run` method has two required parameters:

* `config`

  The config file defines base directory of the server, which is current of app.js. There's a Controller property that specifies which controller to register.

  And then ServerHub will try to search and parse under controller file. When you are writing, you may check this document or search under `node_modules/serverhub-mvc/index.d.ts` file along with all your dependecies, which I've already provided the type definitions there.

* `route(callback function)`

  This function will have one parameter that refers to server route object, you can register custom route rule or ignore certain matches.

Now, try node `app.js`, ServerHub will start your website at port 926 (my best friend's birthday).

### More about that

Please follow [this link](/document/run-module-method.html) to dive into configuration parameter of `instance.Run()` method.
