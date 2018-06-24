# Plugin System

::: tip TIP
avaliable since v1.0.0-beta
:::

As ServerHub is the foundation of a web server, if you start everything from scratch, then you have to handle with plenty of very basic operations. Just because ServerHub automatically route requests to the corresponding handlers (controllers or static cache), you cannot operate on everything seperately. How about doing something right before routing? Like authentication or filtering. And how about doing something after routing? Like triggering a statistic listener that help you analysis system performance.

Here, we introduce "plugin" to you. Instructions in this document is pretty simple, but don't miss the chance to build your own plugin!

## Plugin hooks

Let's see a picture first. (Tips: right click on the image and choose "open image in new tab" to view high definition image)

![plugin](/assets/serverhub-module-plugin-sequence.png)

So, when an HTTP request enters ServerHub, it will be handled with ServerHub core module. Then the first phase of plugins will be activated. After all of them successfully go through the data, ServerHub will call route functions to generate a corresponding `RouteResult`, which contains information about how the request should be handled (where, who). Next, the other phase of plugins will be activated to operate on the data.

The two phase of plugins are **before-route** plugin and **after-route** plugin.

Before-route plugins usually do not care about where will the request be sent to with route. It can do some global operations like authentication. After-route plugins usually concentrate on one specific kind of different request types. Some receive requests for controllers while others focus on handling cache-able static resources.

## How to compose a plugin

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

## Important things to remember

::: warning Keep this in mind:
**NEVER try to modify response parameter passing to your plugin `main` function!**
:::
