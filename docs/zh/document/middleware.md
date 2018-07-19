# 中间件

::: tip 可用性
自 v1.5.0 起可用
:::

中间件（Middleware）是一段特殊的程序，它主要在请求到达服务器之后和被路由分析系统处理之间工作。

有的时候我们并不希望用户访问到一些特定的资源，或者想用一些假资源返回给用户以保护服务器。一个可行的方案是使用**反路由规则**（[链接](./route.html#negative-rules)），但是此时你无法指定要返回给用户的内容。所以，由后端进行路径重写才是最佳方案。

## 先举一例
这是 serverhub-mvc 中间件的例子，请注意从旧版本升级到至少 `v1.5.0`：

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

serverhub.Run(/* 你的启动配置 */);
```

当服务器启动后，任何请求都会被你的中间件捕获。然后，所有以“/sensitive”开头的地址都会被重写为“/warning/index/1”。你的浏览器地址栏并不会显示重写的结果，因为它也不知道。但是你访问“/sensitive”得到的结果实际上已经变成了“/warning/index/1”的结果（前提是你得准备好这个 controller）。这样一来，数据就得到保护了。

## 深入挖掘传入参数的潜能
上面的例子展示了我们如何将“/sensitive”下所有的内容（不论是控制器的还是目录的）全部隐藏。但是如果我们想让某些特殊的请求访问被隐藏的地址怎么办？请看下例：

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

serverhub.Run(/* 你的启动配置 */);
```

好了，当传入请求包含一个 `X-Api-Key` HTTP 请求头，且该字段值为“Administrator”时，此请求会绕过路径重写过程。

---

一句话：ServerHub 中间件最适合于请求的过滤（而不是控制响应），并且它将成为你保护服务器数据安全的重要手段。