# Middleware

::: tip Availability
Since v1.5.0
:::

Middleware is a special program that runs before any plugin/route process when an HTTP request reached your server.

Sometimes, we don't want our users to browse certain resources, just want to show them some fake content to protect our server. A possible choice is **negative route rule** ([see this link](./route.html#negative-rules)). But you cannot display certain fake content easily with just a route rule. So, back-end path rewrite is our best choice.

## Start with Example
Here comes serverhub-mvc middleware. Let's begin with an example:

```js
const serverhub = require('serverhub-mvc');

serverhub.Middleware('/',function (req,path)=>{
    if(path.startsWith('/sensitive')){
        req.url = '/warning/index/1';
        return {
            Path: '/warning/index/1',
            Req: req
        }
    }
});

serverhub.Run(/* your configuration here */);
```

See, after server started, any requests has a path begin with "/" will be caught by our middleware. Then, any path starts with "/sensitive" will be rewrited to "/warning/index/1". Your browser will not recognize this change, your page indicates a URL of "/sensitive" but actually you get content of "/warning/index/1". In this way, your data could be secured.

## More from IncomingMessage
The example above shows how we can completely hide everything under "/sensitive" controller (or directory). But what if we want requests with certain conditions allowd to reach that path? See another example:

```js
const serverhub = require('serverhub-mvc');

serverhub.Middleware('/',function (req,path)=>{
    if(path.startsWith('/sensitive')){

        if(req.headers['x-api-key'] && req.headers['x-api-key'] === 'Administrator')
            return;

        req.url = '/warning/index/1';
        return {
            Path: '/warning/index/1',
            Req: req
        }
    }
});

serverhub.Run(/* your configuration here */);
```

Now, when an incoming request has an `X-Api-Key` HTTP header field and that equals to "Administrator", this request will be allowed to bypass the rewrite process.

---

In conclusion, ServerHub middleware is best for request filtering, and it is way more powerful if you want to secure the server.