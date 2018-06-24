# Run() Module Method

## ServerHub.Run()

[view this](</tutorial/Instance.Run().html>)

## Instance.Run()

ConfigThe other day, I introduced `instance.Run()` method to you. And in this chapter, we will talk about the first parameter of `instance.Run()` method - the configuration object.

### As simple as possible

Not like what we've seen in [Instance.Run()](</tutorial/Instance.Run().html>) chapter, the configuraton object is much too complicated. And in fact, there is only one property that is required: `BaseDir`.

`BaseDir` is the root path of server, which will be used during the whole life circle of your ServerHub application. If your current entry file, such as `app.js`, is just located in the directory that you want to use as server root. Then the value should be `__dirname`, which is a global variable of Node.js.

This is the simplest configuration that can make ServerHub work functional normally.

### Other properties

To customize ServerHub, you need some extra configurations.

#### WebDir

`WebDir` is website directory. Your page files, contents, scripts and assets should be put in this directory. ServerHub uses "www/" as its default value. If you want to set up a new website root directory, create a folder and pass its name to `WebDir` property.

#### ControllerDir

We all know that ServerHub routes request to controllers. If we want them to be registered, we have to provide the contain directory name to ServerHub. The path of controller directory should be relative to server root path. If you don't specify one, the default value will be "controller/".

#### Controllers

Sometimes, we don't want to register every controller in the contain folder. Then we can pass an array of required controller file name to this parameter. eg: `['home.js', 'data.js']`. But if you want all controller files to be registered, just ignore `Controllers` property and ServerHub will automatically scan and register every file under `ControllerDir`.

#### ViewDir and ModelDir

Pretty similar to `ControllerDir` in previous section. They are used to hold view files and models.

#### DBProvider

Specify your database provider. In current version, ServerHub only supports MySQL, which means the only valid value would be "mysql".

#### DBConnectionString

If you have only one database instance to connect, the suggested way is to pass a global database connection string to ServerHub. Because if you don't, you will have to provide a value every time you call `GetConnection()` method on your database provider.

#### MaxCacheSize

This specifies how much memory can ServerHub caching system allocate. If file sizes exceeded this limit, then ServerHub will call WCS to unload some unnecessary caches. This will be covered in later chapters.

#### DefaultPages

ServerHub uses a fallback strategy for default pages. And your default page file must be put under the root of `WebDir` directory. In default, ServerHub uses "index.html" first, then "default.html" and finally "page.html". You can override this configuration by passing an array like `['hello.html', 'first.html']` to this property.

#### PageNotFound `v0.0.93+`

When the request does not match any resources or route rules, ServerHub will render an error page to the response. From v0.0.93, you can add your custom error page to ServerHub server directory and specify with this property.

More property definitions are coming soon.

#### AsyncOperationTimeout `v0.0.97+`

In `v0.0.96`, we introduced `this.Runtime.WAIT` signal to be the workaroud for some time consuming asynchronous operations, such as database query etc. But you should know this signal is pretty dangrous. What if you `forget` to set false to it or the operation takes too much time and dead before callback? So, ServerHub has to count down as a backup operation if it cost too much time. The default value is 10 seconds. If you want it to be shorter or longer, just pass the value to the configuration parameter.(Unit: **milliseconds**)

#### TLSOption `v1.0.6+`

Since `v1.0.6`, ServerHub enhanced security with TLS/SSL. You may secure the connection with a `TLSOption` property. This property has four sub-properties: `Key: string, Cert: string, CA: string`x and `Port: Array<string>|Array<number>|number|string`. You need to load your private key and certificate files and assign their values to the properties above. And most importantly, you need to specify the port you want to secure.
